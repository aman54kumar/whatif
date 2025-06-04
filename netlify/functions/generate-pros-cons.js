const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const {
      topic,
      perspective = "general",
      resultsCount = 7,
    } = JSON.parse(event.body);

    if (!topic) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Topic is required" }),
      };
    }

    // Validate resultsCount
    const validResultsCount = Math.min(
      Math.max(parseInt(resultsCount) || 7, 3),
      10
    );

    // Basic input validation
    const cleanTopic = topic.trim();
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

    // Check for random gibberish
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

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create perspective-aware prompt with validation
    const perspectiveText =
      perspective && perspective !== "general"
        ? ` from a ${perspective} perspective`
        : "";

    const prompt = `You are an AI assistant that helps people explore "what if" scenarios. 

IMPORTANT: First, evaluate if this is a valid, meaningful scenario that someone might actually consider: "${cleanTopic}"

If this appears to be random text, gibberish, or not a real scenario someone would explore, respond with:
{
  "error": "Please enter a meaningful 'what if' scenario (e.g., 'What if I started my own business?' or 'What if I moved to another city?')"
}

If it IS a valid scenario, analyze: "${cleanTopic}"${perspectiveText}

Provide a balanced analysis with:
1. Positive outcomes (benefits, opportunities, advantages)
2. Potential challenges (risks, difficulties, obstacles)

Format your response as JSON with this exact structure:
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

Provide exactly ${validResultsCount} positive outcomes and ${validResultsCount} potential challenges. Be specific, practical, and helpful. Focus on realistic scenarios someone might actually encounter.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let analysis;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Check if AI detected invalid input
        if (parsed.error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: parsed.error }),
          };
        }

        analysis = parsed;
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);

      // If response contains "random" or "gibberish" or similar, it's likely invalid input
      if (
        text.toLowerCase().includes("random") ||
        text.toLowerCase().includes("gibberish") ||
        text.toLowerCase().includes("meaningful")
      ) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error:
              "Please enter a meaningful 'what if' scenario (e.g., 'What if I started my own business?' or 'What if I moved to another city?'",
          }),
        };
      }

      // Fallback: provide generic responses
      const positiveOutcomes = [
        "Potential for personal growth and new opportunities",
        "Chance to learn new skills and expand knowledge",
        "Possibility of increased satisfaction and fulfillment",
        "Opportunity to make positive changes in your life",
        "Potential for better long-term outcomes",
        "Enhanced creativity and problem-solving abilities",
        "Opportunity to discover new interests and passions",
      ];

      const potentialChallenges = [
        "Initial uncertainty and adjustment period",
        "Possible financial costs or investments required",
        "Time and effort needed to implement changes",
        "Potential resistance from others or external factors",
        "Risk of unexpected complications or setbacks",
        "Need to overcome fears and comfort zone limitations",
        "Possible temporary stress during transition period",
      ];

      analysis = { positiveOutcomes, potentialChallenges };
    }

    // Validate the response structure
    if (!analysis.positiveOutcomes || !analysis.potentialChallenges) {
      throw new Error("Invalid analysis structure");
    }

    // Ensure we have arrays with content
    if (
      !Array.isArray(analysis.positiveOutcomes) ||
      !Array.isArray(analysis.potentialChallenges)
    ) {
      throw new Error("Analysis must contain arrays");
    }

    // Ensure we have enough items (minimum 5, target 7)
    if (
      analysis.positiveOutcomes.length < 5 ||
      analysis.potentialChallenges.length < 5
    ) {
      throw new Error("Insufficient analysis depth");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          topic: cleanTopic,
          perspective: perspective || "general",
          positiveOutcomes: analysis.positiveOutcomes,
          potentialChallenges: analysis.potentialChallenges,
          generatedAt: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error("Error generating analysis:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: "Failed to generate scenario analysis. Please try again.",
      }),
    };
  }
};
