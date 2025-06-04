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
    // Parse request body
    const { topic, perspective } = JSON.parse(event.body);

    if (!topic || topic.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Topic is required" }),
      };
    }

    // Initialize Google Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "API key not configured" }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create the prompt
    let prompt = `Create a comprehensive pros and cons analysis for: "${topic}"`;

    if (perspective && perspective.trim().length > 0) {
      prompt += ` from a ${perspective} perspective`;
    }

    prompt += `

Please provide your response in the following JSON format:
{
  "pros": [
    "First pro point",
    "Second pro point",
    "Third pro point"
  ],
  "cons": [
    "First con point", 
    "Second con point",
    "Third con point"
  ]
}

Make sure each point is clear, concise, and well-reasoned. Provide at least 3-5 points for both pros and cons.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let parsedResponse;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // Fallback: create structured response from plain text
      const lines = text.split("\n").filter((line) => line.trim());
      const prosIndex = lines.findIndex((line) =>
        line.toLowerCase().includes("pro")
      );
      const consIndex = lines.findIndex((line) =>
        line.toLowerCase().includes("con")
      );

      parsedResponse = {
        pros: lines
          .slice(prosIndex + 1, consIndex > prosIndex ? consIndex : undefined)
          .filter(
            (line) =>
              line.trim().startsWith("-") ||
              line.trim().startsWith("•") ||
              line.trim().startsWith("*")
          )
          .map((line) => line.replace(/^[-•*]\s*/, "").trim())
          .slice(0, 5),
        cons: lines
          .slice(consIndex + 1)
          .filter(
            (line) =>
              line.trim().startsWith("-") ||
              line.trim().startsWith("•") ||
              line.trim().startsWith("*")
          )
          .map((line) => line.replace(/^[-•*]\s*/, "").trim())
          .slice(0, 5),
      };
    }

    // Validate response structure
    if (
      !parsedResponse.pros ||
      !parsedResponse.cons ||
      !Array.isArray(parsedResponse.pros) ||
      !Array.isArray(parsedResponse.cons)
    ) {
      throw new Error("Invalid response structure from AI");
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          topic: topic,
          perspective: perspective || "general",
          pros: parsedResponse.pros,
          cons: parsedResponse.cons,
          generatedAt: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error("Error generating pros and cons:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to generate pros and cons",
        details: error.message,
      }),
    };
  }
};
