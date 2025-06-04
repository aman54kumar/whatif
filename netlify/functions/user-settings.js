exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Content-Type": "application/json",
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
    // Get user IP for identification (with privacy considerations)
    const userIP =
      event.headers["x-forwarded-for"] ||
      event.headers["x-real-ip"] ||
      event.requestContext?.identity?.sourceIp ||
      "anonymous";

    // Hash the IP for privacy
    const crypto = require("crypto");
    const hashedIP = crypto
      .createHash("md5")
      .update(
        userIP + process.env.UPSTASH_REDIS_REST_TOKEN?.slice(0, 10) || "salt"
      )
      .digest("hex");

    const settingsKey = `settings:${hashedIP}`;

    // Default settings
    const defaultSettings = {
      darkMode: false,
      resultsCount: 7,
      lastUpdated: new Date().toISOString(),
    };

    let redisAvailable = false;
    let settings = defaultSettings;

    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (event.httpMethod === "POST" || event.httpMethod === "PUT") {
          // Update settings
          const body = JSON.parse(event.body || "{}");
          const newSettings = {
            ...defaultSettings,
            ...body,
            lastUpdated: new Date().toISOString(),
          };

          // Validate settings
          if (typeof newSettings.darkMode !== "boolean") {
            newSettings.darkMode = false;
          }
          if (
            typeof newSettings.resultsCount !== "number" ||
            newSettings.resultsCount < 3 ||
            newSettings.resultsCount > 10
          ) {
            newSettings.resultsCount = 7;
          }

          const response = await fetch(`${redisUrl}/set/${settingsKey}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${redisToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSettings),
          });

          if (response.ok) {
            settings = newSettings;
            redisAvailable = true;

            // Set expiration to 1 year (31536000 seconds)
            await fetch(`${redisUrl}/expire/${settingsKey}/31536000`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${redisToken}`,
              },
            });
          }
        } else {
          // GET request - retrieve settings
          const response = await fetch(`${redisUrl}/get/${settingsKey}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${redisToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.result) {
              settings =
                typeof data.result === "string"
                  ? JSON.parse(data.result)
                  : data.result;
              redisAvailable = true;
            }
          }
        }
      }
    } catch (redisError) {
      console.error("Redis error:", redisError);
      redisAvailable = false;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        settings,
        redisAvailable,
      }),
    };
  } catch (error) {
    console.error("Error in user-settings:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Failed to handle user settings",
        settings: defaultSettings,
        redisAvailable: false,
      }),
    };
  }
};
