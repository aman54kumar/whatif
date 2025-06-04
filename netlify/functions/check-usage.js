exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    // Get user IP for rate limiting (with privacy considerations)
    const userIP =
      event.headers["x-forwarded-for"] ||
      event.headers["x-real-ip"] ||
      event.requestContext?.identity?.sourceIp ||
      "anonymous";

    // Hash the IP for privacy (simple hash, not for security)
    const crypto = require("crypto");
    const hashedIP = crypto
      .createHash("md5")
      .update(
        userIP + process.env.UPSTASH_REDIS_REST_TOKEN?.slice(0, 10) || "salt"
      )
      .digest("hex");

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const redisKey = `usage:${hashedIP}:${today}`;

    // Try to connect to Redis
    let currentCount = 0;
    let redisAvailable = false;

    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
        const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (event.httpMethod === "POST") {
          // Increment usage count
          const response = await fetch(`${redisUrl}/incr/${redisKey}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${redisToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            currentCount = data.result || 1;
            redisAvailable = true;

            // Set expiration to end of day (24 hours from now)
            await fetch(`${redisUrl}/expire/${redisKey}/86400`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${redisToken}`,
              },
            });
          }
        } else {
          // GET request - just check current count
          const response = await fetch(`${redisUrl}/get/${redisKey}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${redisToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            currentCount = parseInt(data.result) || 0;
            redisAvailable = true;
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
        count: currentCount,
        redisAvailable,
        limit: 5,
        remaining: Math.max(0, 5 - currentCount),
        resetDate: today,
      }),
    };
  } catch (error) {
    console.error("Error in check-usage:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Failed to check usage",
        count: 0,
        redisAvailable: false,
        limit: 5,
        remaining: 5,
      }),
    };
  }
};
