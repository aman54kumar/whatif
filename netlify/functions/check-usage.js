const crypto = require("crypto");

// Security configuration
const SECURITY_CONFIG = {
  DAILY_LIMIT: 10,
  HOURLY_LIMIT: 5,
  BURST_LIMIT: 3, // Max requests per minute
  MAX_IP_REQUESTS_PER_DAY: 50, // Absolute max per IP
  SUSPICIOUS_THRESHOLD: 20, // Flag suspicious activity
  BLOCKED_IPS: new Set(), // In production, use Redis
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

// Check for suspicious patterns
function detectSuspiciousActivity(requests) {
  const now = Date.now();
  const recentRequests = requests.filter(
    (timestamp) => now - timestamp < 60000
  ); // Last minute

  return {
    tooManyRecent: recentRequests.length > SECURITY_CONFIG.BURST_LIMIT,
    suspicious: requests.length > SECURITY_CONFIG.SUSPICIOUS_THRESHOLD,
    patterns: {
      rapidFire: recentRequests.length >= 3,
      highVolume: requests.length > 15,
    },
  };
}

exports.handler = async (event, context) => {
  // Enhanced security headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      // Max IPv6 length
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: "Invalid request source",
          count: 0,
          limit: SECURITY_CONFIG.DAILY_LIMIT,
          remaining: 0,
        }),
      };
    }

    // Check if IP is blocked
    if (SECURITY_CONFIG.BLOCKED_IPS.has(userIP)) {
      return {
        statusCode: 429,
        headers: {
          ...headers,
          "Retry-After": "3600", // 1 hour
        },
        body: JSON.stringify({
          success: false,
          error: "Access temporarily restricted",
          count: SECURITY_CONFIG.DAILY_LIMIT,
          limit: SECURITY_CONFIG.DAILY_LIMIT,
          remaining: 0,
        }),
      };
    }

    // Create secure hash for privacy
    const hashedIP = createSecureHash(userIP);
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const currentHour = new Date().getHours();

    const dailyKey = `usage:${hashedIP}:${today}`;
    const hourlyKey = `usage:${hashedIP}:${today}:${currentHour}`;
    const requestsKey = `requests:${hashedIP}:${today}`;

    let currentDailyCount = 0;
    let currentHourlyCount = 0;
    let requestTimestamps = [];
    let redisAvailable = false;

    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (event.httpMethod === "POST") {
          // Get current counts first
          const [dailyResponse, hourlyResponse, requestsResponse] =
            await Promise.all([
              fetch(`${redisUrl}/get/${dailyKey}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
              fetch(`${redisUrl}/get/${hourlyKey}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
              fetch(`${redisUrl}/lrange/${requestsKey}/0/-1`, {
                method: "GET",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
            ]);

          if (dailyResponse.ok && hourlyResponse.ok && requestsResponse.ok) {
            const dailyData = await dailyResponse.json();
            const hourlyData = await hourlyResponse.json();
            const requestsData = await requestsResponse.json();

            currentDailyCount = parseInt(dailyData.result) || 0;
            currentHourlyCount = parseInt(hourlyData.result) || 0;
            requestTimestamps = requestsData.result || [];

            // Convert string timestamps back to numbers
            requestTimestamps = requestTimestamps
              .map((ts) => parseInt(ts))
              .filter(Boolean);

            // Security checks before incrementing
            const suspiciousActivity =
              detectSuspiciousActivity(requestTimestamps);

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
                  count: currentDailyCount,
                  limit: SECURITY_CONFIG.DAILY_LIMIT,
                  remaining: 0,
                }),
              };
            }

            // Check limits before incrementing
            if (currentDailyCount >= SECURITY_CONFIG.DAILY_LIMIT) {
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
                  count: currentDailyCount,
                  limit: SECURITY_CONFIG.DAILY_LIMIT,
                  remaining: 0,
                }),
              };
            }

            if (currentHourlyCount >= SECURITY_CONFIG.HOURLY_LIMIT) {
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
                  count: currentDailyCount,
                  limit: SECURITY_CONFIG.DAILY_LIMIT,
                  remaining: Math.max(
                    0,
                    SECURITY_CONFIG.DAILY_LIMIT - currentDailyCount
                  ),
                }),
              };
            }

            // Increment counters
            const now = Date.now();
            const incrementPromises = [
              fetch(`${redisUrl}/incr/${dailyKey}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
              fetch(`${redisUrl}/incr/${hourlyKey}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
              fetch(`${redisUrl}/lpush/${requestsKey}/${now}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${redisToken}` },
              }),
            ];

            const incrementResults = await Promise.all(incrementPromises);

            if (incrementResults.every((r) => r.ok)) {
              const dailyResult = await incrementResults[0].json();
              currentDailyCount = dailyResult.result || currentDailyCount + 1;
              redisAvailable = true;

              // Set expiration times
              await Promise.all([
                fetch(`${redisUrl}/expire/${dailyKey}/86400`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${redisToken}` },
                }),
                fetch(`${redisUrl}/expire/${hourlyKey}/3600`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${redisToken}` },
                }),
                fetch(`${redisUrl}/expire/${requestsKey}/86400`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${redisToken}` },
                }),
                fetch(`${redisUrl}/ltrim/${requestsKey}/0/99`, {
                  // Keep only last 100 requests
                  method: "POST",
                  headers: { Authorization: `Bearer ${redisToken}` },
                }),
              ]);

              // Log suspicious activity
              if (suspiciousActivity.suspicious) {
                console.warn(
                  `Suspicious activity detected for IP hash: ${hashedIP}, requests: ${requestTimestamps.length}`
                );
              }
            }
          }
        } else {
          // GET request - just check current counts
          const [dailyResponse, hourlyResponse] = await Promise.all([
            fetch(`${redisUrl}/get/${dailyKey}`, {
              method: "GET",
              headers: { Authorization: `Bearer ${redisToken}` },
            }),
            fetch(`${redisUrl}/get/${hourlyKey}`, {
              method: "GET",
              headers: { Authorization: `Bearer ${redisToken}` },
            }),
          ]);

          if (dailyResponse.ok && hourlyResponse.ok) {
            const dailyData = await dailyResponse.json();
            const hourlyData = await hourlyResponse.json();
            currentDailyCount = parseInt(dailyData.result) || 0;
            currentHourlyCount = parseInt(hourlyData.result) || 0;
            redisAvailable = true;
          }
        }
      }
    } catch (redisError) {
      console.error("Redis error:", redisError);
      redisAvailable = false;
    }

    // Calculate remaining requests
    const dailyRemaining = Math.max(
      0,
      SECURITY_CONFIG.DAILY_LIMIT - currentDailyCount
    );
    const hourlyRemaining = Math.max(
      0,
      SECURITY_CONFIG.HOURLY_LIMIT - currentHourlyCount
    );

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "X-RateLimit-Limit": SECURITY_CONFIG.DAILY_LIMIT.toString(),
        "X-RateLimit-Remaining": dailyRemaining.toString(),
        "X-RateLimit-Reset": new Date(Date.now() + 86400000).toISOString(),
      },
      body: JSON.stringify({
        success: true,
        count: currentDailyCount,
        redisAvailable,
        limit: SECURITY_CONFIG.DAILY_LIMIT,
        remaining: dailyRemaining,
        hourlyRemaining,
        resetDate: today,
        security: {
          withinLimits:
            currentDailyCount < SECURITY_CONFIG.DAILY_LIMIT &&
            currentHourlyCount < SECURITY_CONFIG.HOURLY_LIMIT,
          hourlyCount: currentHourlyCount,
        },
      }),
    };
  } catch (error) {
    console.error("Error in check-usage:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Service temporarily unavailable",
        count: 0,
        redisAvailable: false,
        limit: SECURITY_CONFIG.DAILY_LIMIT,
        remaining: SECURITY_CONFIG.DAILY_LIMIT,
      }),
    };
  }
};
