const crypto = require("crypto");

// Security configuration
const SECURITY_CONFIG = {
  DAILY_LIMIT: 10,
  HOURLY_LIMIT: 5,
  BURST_LIMIT: 3, // Max requests per minute
  MAX_IP_REQUESTS_PER_DAY: 50,
  SUSPICIOUS_THRESHOLD: 20,
  BLOCKED_IPS: new Set(),
};

// Enhanced IP hashing with better security
function createSecureHash(ip, salt = "") {
  const combined =
    ip +
    salt +
    (process.env.UPSTASH_REDIS_REST_TOKEN?.slice(0, 10) || "default-salt");
  return crypto
    .createHash("sha256")
    .update(combined)
    .digest("hex")
    .substring(0, 16);
}

// Detect suspicious activity patterns
function detectSuspiciousActivity(requests) {
  if (!Array.isArray(requests) || requests.length === 0) {
    return { suspicious: false, tooManyRecent: false };
  }

  const now = Date.now();
  const oneMinute = 60 * 1000;
  const recentRequests = requests.filter((req) => now - req < oneMinute);

  return {
    suspicious: requests.length > SECURITY_CONFIG.SUSPICIOUS_THRESHOLD,
    tooManyRecent: recentRequests.length >= SECURITY_CONFIG.BURST_LIMIT,
  };
}

// Initialize default user data structure
function getDefaultUserData() {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  return {
    // Settings
    settings: {
      darkMode: false,
      resultsCount: 7,
      lastUpdated: now.toISOString(),
    },

    // Usage tracking
    usage: {
      daily: {
        date: today,
        count: 0,
      },
      hourly: {
        date: today,
        hour: currentHour,
        count: 0,
      },
      requests: [], // Array of timestamps
    },

    // Security and metadata
    security: {
      createdAt: now.toISOString(),
      lastActivity: now.toISOString(),
      blocked: false,
      suspiciousActivity: 0,
    },

    // Cache expiry
    expiresAt: new Date(
      now.getTime() + 365 * 24 * 60 * 60 * 1000
    ).toISOString(), // 1 year
  };
}

exports.handler = async (event, context) => {
  // Enhanced security headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    // Enhanced IP detection with validation
    const userIP =
      event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      event.headers["x-real-ip"] ||
      event.requestContext?.identity?.sourceIp ||
      "unknown";

    // Basic IP validation
    if (userIP === "unknown" || userIP.length > 45) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid request source",
        }),
      };
    }

    // Create secure hash for privacy (single user identifier)
    const hashedIP = createSecureHash(userIP);
    const userKey = `user:${hashedIP}`;

    let redisAvailable = false;
    let userData = getDefaultUserData();

    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        // Get existing user data
        const response = await fetch(`${redisUrl}/get/${userKey}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${redisToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            const existingData =
              typeof data.result === "string"
                ? JSON.parse(data.result)
                : data.result;

            // Merge with defaults to ensure all fields exist
            userData = {
              ...userData,
              ...existingData,
              settings: { ...userData.settings, ...existingData.settings },
              usage: { ...userData.usage, ...existingData.usage },
              security: { ...userData.security, ...existingData.security },
            };
            redisAvailable = true;
          }
        }

        // Handle different request types
        const queryParams = new URLSearchParams(event.rawQuery || "");
        const action = queryParams.get("action") || "get";

        if (event.httpMethod === "POST") {
          const body = JSON.parse(event.body || "{}");

          switch (action) {
            case "usage":
              // Increment usage tracking
              const result = await handleUsageIncrement(
                userData,
                redisUrl,
                redisToken,
                userKey,
                headers
              );
              return result;

            case "settings":
              // Update user settings
              const settingsResult = await handleSettingsUpdate(
                userData,
                body,
                redisUrl,
                redisToken,
                userKey
              );
              return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  success: true,
                  settings: settingsResult.settings,
                  redisAvailable: true,
                }),
              };

            default:
              return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                  success: false,
                  error: "Invalid action",
                }),
              };
          }
        }

        // GET request - return appropriate data based on action
        switch (action) {
          case "settings":
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                settings: userData.settings,
                redisAvailable,
              }),
            };

          case "usage":
            const dailyRemaining = Math.max(
              0,
              SECURITY_CONFIG.DAILY_LIMIT - userData.usage.daily.count
            );
            const hourlyRemaining = Math.max(
              0,
              SECURITY_CONFIG.HOURLY_LIMIT - userData.usage.hourly.count
            );

            return {
              statusCode: 200,
              headers: {
                ...headers,
                "X-RateLimit-Limit": SECURITY_CONFIG.DAILY_LIMIT.toString(),
                "X-RateLimit-Remaining": dailyRemaining.toString(),
              },
              body: JSON.stringify({
                success: true,
                count: userData.usage.daily.count,
                redisAvailable,
                limit: SECURITY_CONFIG.DAILY_LIMIT,
                remaining: dailyRemaining,
                hourlyRemaining,
                resetDate: userData.usage.daily.date,
                security: {
                  withinLimits: dailyRemaining > 0 && hourlyRemaining > 0,
                  hourlyCount: userData.usage.hourly.count,
                },
              }),
            };

          default:
            // Return complete user data summary
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                user: {
                  settings: userData.settings,
                  usage: {
                    daily: userData.usage.daily.count,
                    remaining: Math.max(
                      0,
                      SECURITY_CONFIG.DAILY_LIMIT - userData.usage.daily.count
                    ),
                    limit: SECURITY_CONFIG.DAILY_LIMIT,
                  },
                  lastActivity: userData.security.lastActivity,
                },
                redisAvailable,
              }),
            };
        }
      }
    } catch (redisError) {
      console.error("Redis error:", redisError);
      redisAvailable = false;
    }

    // Fallback response when Redis is unavailable
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        settings: userData.settings,
        usage: {
          daily: 0,
          remaining: SECURITY_CONFIG.DAILY_LIMIT,
          limit: SECURITY_CONFIG.DAILY_LIMIT,
        },
        redisAvailable: false,
      }),
    };
  } catch (error) {
    console.error("Error in user-data:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Service temporarily unavailable",
        redisAvailable: false,
      }),
    };
  }
};

// Handle usage increment
async function handleUsageIncrement(
  userData,
  redisUrl,
  redisToken,
  userKey,
  headers
) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  // Reset daily count if new day
  if (userData.usage.daily.date !== today) {
    userData.usage.daily = { date: today, count: 0 };
    userData.usage.requests = []; // Clear old requests
  }

  // Reset hourly count if new hour
  if (
    userData.usage.hourly.date !== today ||
    userData.usage.hourly.hour !== currentHour
  ) {
    userData.usage.hourly = { date: today, hour: currentHour, count: 0 };
  }

  // Clean old request timestamps (keep only last hour)
  const oneHour = 60 * 60 * 1000;
  const nowTimestamp = now.getTime();
  userData.usage.requests = userData.usage.requests.filter(
    (timestamp) => nowTimestamp - timestamp < oneHour
  );

  // Security checks
  const suspiciousActivity = detectSuspiciousActivity(userData.usage.requests);

  if (suspiciousActivity.tooManyRecent) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        "Retry-After": "60",
        "X-RateLimit-Limit": SECURITY_CONFIG.BURST_LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      },
      body: JSON.stringify({
        success: false,
        error: "Too many requests. Please slow down.",
        count: userData.usage.daily.count,
        limit: SECURITY_CONFIG.DAILY_LIMIT,
        remaining: 0,
      }),
    };
  }

  // Check limits
  if (userData.usage.daily.count >= SECURITY_CONFIG.DAILY_LIMIT) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        "X-RateLimit-Limit": SECURITY_CONFIG.DAILY_LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      },
      body: JSON.stringify({
        success: false,
        error: "Daily limit reached",
        count: userData.usage.daily.count,
        limit: SECURITY_CONFIG.DAILY_LIMIT,
        remaining: 0,
      }),
    };
  }

  if (userData.usage.hourly.count >= SECURITY_CONFIG.HOURLY_LIMIT) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        "X-RateLimit-Limit": SECURITY_CONFIG.HOURLY_LIMIT.toString(),
        "X-RateLimit-Remaining": "0",
      },
      body: JSON.stringify({
        success: false,
        error: "Hourly limit reached. Please try again later.",
        count: userData.usage.daily.count,
        limit: SECURITY_CONFIG.DAILY_LIMIT,
        remaining: Math.max(
          0,
          SECURITY_CONFIG.DAILY_LIMIT - userData.usage.daily.count
        ),
      }),
    };
  }

  // Increment counters
  userData.usage.daily.count += 1;
  userData.usage.hourly.count += 1;
  userData.usage.requests.push(nowTimestamp);

  // Update security data
  userData.security.lastActivity = now.toISOString();
  if (suspiciousActivity.suspicious) {
    userData.security.suspiciousActivity += 1;
  }

  // Save updated data to Redis
  try {
    const saveResponse = await fetch(`${redisUrl}/set/${userKey}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (saveResponse.ok) {
      // Set expiration to 1 year
      await fetch(`${redisUrl}/expire/${userKey}/31536000`, {
        method: "POST",
        headers: { Authorization: `Bearer ${redisToken}` },
      });
    }
  } catch (saveError) {
    console.error("Failed to save user data:", saveError);
  }

  const dailyRemaining = Math.max(
    0,
    SECURITY_CONFIG.DAILY_LIMIT - userData.usage.daily.count
  );

  return {
    statusCode: 200,
    headers: {
      ...headers,
      "X-RateLimit-Limit": SECURITY_CONFIG.DAILY_LIMIT.toString(),
      "X-RateLimit-Remaining": dailyRemaining.toString(),
    },
    body: JSON.stringify({
      success: true,
      count: userData.usage.daily.count,
      redisAvailable: true,
      limit: SECURITY_CONFIG.DAILY_LIMIT,
      remaining: dailyRemaining,
      hourlyRemaining: Math.max(
        0,
        SECURITY_CONFIG.HOURLY_LIMIT - userData.usage.hourly.count
      ),
      security: {
        withinLimits: dailyRemaining > 0,
        hourlyCount: userData.usage.hourly.count,
      },
    }),
  };
}

// Handle settings update
async function handleSettingsUpdate(
  userData,
  newSettings,
  redisUrl,
  redisToken,
  userKey
) {
  // Validate and update settings
  const updatedSettings = {
    ...userData.settings,
    ...newSettings,
    lastUpdated: new Date().toISOString(),
  };

  // Validate settings
  if (typeof updatedSettings.darkMode !== "boolean") {
    updatedSettings.darkMode = false;
  }
  if (
    typeof updatedSettings.resultsCount !== "number" ||
    updatedSettings.resultsCount < 3 ||
    updatedSettings.resultsCount > 10
  ) {
    updatedSettings.resultsCount = 7;
  }

  // Update user data
  userData.settings = updatedSettings;
  userData.security.lastActivity = new Date().toISOString();

  // Save to Redis
  try {
    const saveResponse = await fetch(`${redisUrl}/set/${userKey}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (saveResponse.ok) {
      // Set expiration to 1 year
      await fetch(`${redisUrl}/expire/${userKey}/31536000`, {
        method: "POST",
        headers: { Authorization: `Bearer ${redisToken}` },
      });
    }
  } catch (saveError) {
    console.error("Failed to save settings:", saveError);
  }

  return { settings: updatedSettings };
}
