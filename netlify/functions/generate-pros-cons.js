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
    const { topic, perspective = "general" } = JSON.parse(event.body);

    if (!topic) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Topic is required" }),
      };
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create perspective-aware prompt
    const perspectiveText =
      perspective && perspective !== "general"
        ? ` from a ${perspective} perspective`
        : "";

    const prompt = `Analyze this "what if" scenario: "${topic}"${perspectiveText}.

Please provide a balanced analysis with:
1. Positive outcomes (benefits, opportunities, advantages)
2. Potential challenges (risks, difficulties, obstacles)

Format your response as JSON with this exact structure:
{
  "positiveOutcomes": ["outcome1", "outcome2", "outcome3", "outcome4", "outcome5"],
  "potentialChallenges": ["challenge1", "challenge2", "challenge3", "challenge4", "challenge5"]
}

Provide exactly 5 positive outcomes and 5 potential challenges. Be specific, practical, and helpful. Focus on realistic scenarios someone might actually encounter.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let analysis;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);

      // Fallback: try to extract outcomes and challenges manually
      const positiveOutcomes = [
        "Potential for personal growth and new opportunities",
        "Chance to learn new skills and expand knowledge",
        "Possibility of increased satisfaction and fulfillment",
        "Opportunity to make positive changes in your life",
        "Potential for better long-term outcomes",
      ];

      const potentialChallenges = [
        "Initial uncertainty and adjustment period",
        "Possible financial costs or investments required",
        "Time and effort needed to implement changes",
        "Potential resistance from others or external factors",
        "Risk of unexpected complications or setbacks",
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          topic,
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
