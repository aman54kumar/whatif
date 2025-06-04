const { GoogleGenerativeAI } = require("@google/generative-ai");

// Security configuration
const SECURITY_CONFIG = {
  MAX_TOPIC_LENGTH: 500,
  MAX_PERSPECTIVE_LENGTH: 200,
  MIN_TOPIC_LENGTH: 3,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_WINDOW: 10,
  BLOCKED_PATTERNS: [
    // Harmful content patterns
    /(?:suicide|self.?harm|kill.?(?:myself|yourself))/i,
    /(?:bomb|explosive|terrorist|attack)/i,
    /(?:drug.?dealing|illegal.?drugs|cocaine|heroin)/i,
    /(?:hack|exploit|ddos|malware)/i,
    /(?:gore|violence|torture|murder)/i,
    /(?:child.?abuse|pedophile|minor.?sexual)/i,
    // Spam patterns
    /(.)\1{20,}/, // Repeated characters
    /(?:http|www\.|\.[a-z]{2,4}\/)/i, // URLs
    /(?:@|#)\w+/g, // Social media handles
    // Prompt injection attempts
    /(?:ignore|forget|disregard).{0,20}(?:previous|above|instruction)/i,
    /(?:system|admin|root|debug)\s*(?:mode|access|prompt)/i,
    /(?:execute|run|eval)\s*(?:code|script|command)/i,
  ],
  SENSITIVE_TOPICS: [
    /(?:political|election|vote|democrat|republican)/i,
    /(?:religious|christian|muslim|jewish|hindu|buddhist)/i,
    /(?:race|racist|discrimination|prejudice)/i,
    /(?:sexual|erotic|nsfw|adult.?content)/i,
  ],
};

// Rate limiting store (in-memory for this example, use Redis in production)
const rateLimitStore = new Map();

// Security utilities
function validateInput(topic, perspective) {
  const errors = [];

  // Length validation
  if (!topic || topic.length < SECURITY_CONFIG.MIN_TOPIC_LENGTH) {
    errors.push("Topic must be at least 3 characters long");
  }
  if (topic && topic.length > SECURITY_CONFIG.MAX_TOPIC_LENGTH) {
    errors.push(
      `Topic must be less than ${SECURITY_CONFIG.MAX_TOPIC_LENGTH} characters`
    );
  }
  if (
    perspective &&
    perspective.length > SECURITY_CONFIG.MAX_PERSPECTIVE_LENGTH
  ) {
    errors.push(
      `Perspective must be less than ${SECURITY_CONFIG.MAX_PERSPECTIVE_LENGTH} characters`
    );
  }

  // Content validation
  const combinedText = `${topic} ${perspective || ""}`.toLowerCase();

  // Check for blocked patterns
  for (const pattern of SECURITY_CONFIG.BLOCKED_PATTERNS) {
    if (pattern.test(combinedText)) {
      errors.push("Content contains inappropriate or harmful material");
      break;
    }
  }

  // Check for sensitive topics (warning, not blocking)
  const sensitiveTopics = [];
  for (const pattern of SECURITY_CONFIG.SENSITIVE_TOPICS) {
    if (pattern.test(combinedText)) {
      sensitiveTopics.push(pattern.source);
    }
  }

  return { errors, sensitiveTopics, isValid: errors.length === 0 };
}

function sanitizeInput(text) {
  if (!text) return "";

  return text
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .replace(/[<>]/g, "") // Remove potential HTML/XML
    .replace(/[\r\n\t]+/g, " ") // Normalize whitespace
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .substring(0, 1000); // Hard limit
}

function checkRateLimit(userIP) {
  const now = Date.now();
  const userKey = `rate_${userIP}`;

  if (!rateLimitStore.has(userKey)) {
    rateLimitStore.set(userKey, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - 1,
    };
  }

  const userData = rateLimitStore.get(userKey);

  // Reset window if expired
  if (now - userData.windowStart > SECURITY_CONFIG.RATE_LIMIT_WINDOW) {
    rateLimitStore.set(userKey, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - 1,
    };
  }

  // Check if limit exceeded
  if (userData.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userData.windowStart + SECURITY_CONFIG.RATE_LIMIT_WINDOW,
    };
  }

  // Increment count
  userData.count++;
  rateLimitStore.set(userKey, userData);

  return {
    allowed: true,
    remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW - userData.count,
  };
}

exports.handler = async (event, context) => {
  // Enhanced CORS with security headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Get user IP for rate limiting
    const userIP =
      event.headers["x-forwarded-for"] ||
      event.headers["x-real-ip"] ||
      event.requestContext?.identity?.sourceIp ||
      "unknown";

    // Rate limiting check
    const rateLimitResult = checkRateLimit(userIP);
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime).toISOString();
      return {
        statusCode: 429,
        headers: {
          ...headers,
          "Retry-After": Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit":
            SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": resetTime,
        },
        body: JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
          resetTime,
        }),
      };
    }

    // Parse and validate request size
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    // Check request size (max 10KB)
    if (event.body.length > 10240) {
      return {
        statusCode: 413,
        headers,
        body: JSON.stringify({ error: "Request too large" }),
      };
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    const { topic, perspective = "general", resultsCount = 7 } = requestData;

    // Security validation
    const validation = validateInput(topic, perspective);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: validation.errors[0],
          details: "Content policy violation",
        }),
      };
    }

    // Sanitize inputs
    const cleanTopic = sanitizeInput(topic);
    const cleanPerspective = sanitizeInput(perspective);

    if (!cleanTopic) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Topic is required after sanitization" }),
      };
    }

    // Validate resultsCount
    const validResultsCount = Math.min(
      Math.max(parseInt(resultsCount) || 7, 3),
      10
    );

    // Additional topic validation
    if (cleanTopic.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            "Please enter a more detailed scenario (at least 3 characters)",
        }),
      };
    }

    // Check for valid words
    const hasValidWords = /[a-zA-Z]{2,}/.test(cleanTopic);
    if (!hasValidWords) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Please enter a meaningful scenario with actual words",
        }),
      };
    }

    // Initialize Gemini AI with error handling
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "AI service temporarily unavailable",
        }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create secure, validated prompt
    const perspectiveText =
      cleanPerspective && cleanPerspective !== "general"
        ? ` from a ${cleanPerspective} perspective`
        : "";

    const securePrompt = `You are a helpful AI assistant that analyzes "what if" scenarios responsibly.

STRICT INSTRUCTIONS:
- Only respond to legitimate hypothetical scenarios
- Do not provide advice on illegal, harmful, or dangerous activities
- If the scenario involves sensitive topics, provide balanced, educational responses
- Focus on realistic outcomes and challenges

Analyze this scenario: "${cleanTopic}"${perspectiveText}

Provide exactly ${validResultsCount} positive outcomes and ${validResultsCount} potential challenges.

Respond ONLY in this JSON format:
{
  "positiveOutcomes": [${Array(validResultsCount)
    .fill(0)
    .map((_, i) => `"outcome${i + 1}"`)
    .join(", ")}],
  "potentialChallenges": [${Array(validResultsCount)
    .fill(0)
    .map((_, i) => `"challenge${i + 1}"`)
    .join(", ")}]
}

If this scenario is inappropriate, respond with:
{"error": "This scenario cannot be analyzed due to content policy restrictions"}`;

    // Call AI with timeout and error handling
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI request timeout")), 30000)
    );

    const aiPromise = model.generateContent(securePrompt);

    const result = await Promise.race([aiPromise, timeoutPromise]);
    const response = await result.response;
    const text = response.text();

    // Parse and validate AI response
    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Check if AI detected inappropriate content
        if (parsed.error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error:
                "This scenario cannot be analyzed due to content restrictions",
            }),
          };
        }

        analysis = parsed;
      } else {
        throw new Error("No JSON found in AI response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);

      // Fallback responses
      const positiveOutcomes = Array(validResultsCount).fill(
        "This scenario offers potential for growth and new opportunities"
      );
      const potentialChallenges = Array(validResultsCount).fill(
        "This scenario may present some challenges that require careful consideration"
      );

      analysis = { positiveOutcomes, potentialChallenges };
    }

    // Validate response structure
    if (
      !analysis.positiveOutcomes ||
      !analysis.potentialChallenges ||
      !Array.isArray(analysis.positiveOutcomes) ||
      !Array.isArray(analysis.potentialChallenges) ||
      analysis.positiveOutcomes.length < 3 ||
      analysis.potentialChallenges.length < 3
    ) {
      throw new Error("Invalid analysis structure from AI");
    }

    // Add rate limit headers to successful response
    const responseHeaders = {
      ...headers,
      "X-RateLimit-Limit": SECURITY_CONFIG.MAX_REQUESTS_PER_WINDOW.toString(),
      "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
    };

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        success: true,
        data: {
          topic: cleanTopic,
          perspective: cleanPerspective || "general",
          positiveOutcomes: analysis.positiveOutcomes,
          potentialChallenges: analysis.potentialChallenges,
          generatedAt: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error("Error generating analysis:", error);

    // Don't expose internal errors to users
    const userError = error.message.includes("timeout")
      ? "Request timed out. Please try again."
      : "AI service temporarily unavailable. Please try again.";

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: userError,
      }),
    };
  }
};
