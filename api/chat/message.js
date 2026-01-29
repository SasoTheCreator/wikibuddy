// Serverless function for Vercel
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      message: "Only POST requests are allowed",
    });
  }

  try {
    const { messages, context } = req.body;

    // Validate request body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Bad request",
        message: "Messages array is required",
      });
    }

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Configuration error",
        message: "ANTHROPIC_API_KEY is not configured",
      });
    }

    // Prepare Anthropic API request
    const systemMessage = messages.find((msg) => msg.role === "system");
    const userMessages = messages.filter((msg) => msg.role !== "system");

    // Enhanced system prompt
    let enhancedSystemPrompt = buildWikipediaPrompt(
      systemMessage?.content || context || ""
    );

    // Add conversation guidance based on context metadata
    if (context && context.includes("New article loaded: yes")) {
      enhancedSystemPrompt += `\n\nCONVERSATION UPDATE: A new Wikipedia article has been automatically loaded. You now have access to the new article's content. Acknowledge the article switch naturally and respond about the new topic.`;
    } else if (
      context &&
      context.includes("User is trying to change article")
    ) {
      enhancedSystemPrompt += `\n\nCONVERSATION GUIDANCE: The user is trying to change the article. If a new article was loaded automatically, acknowledge it and respond about the new topic. If not, guide them to use the search interface.`;
    }

    // Call Anthropic API
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1500,
          messages: userMessages,
          system: enhancedSystemPrompt,
          temperature: 0.3,
        }),
      }
    );

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.json().catch(() => ({}));
      console.error("Anthropic API error:", errorData);

      if (anthropicResponse.status === 401) {
        return res.status(401).json({
          error: "Authentication failed",
          message: "Invalid API key",
        });
      }

      if (anthropicResponse.status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        });
      }

      return res.status(anthropicResponse.status).json({
        error: "Anthropic API error",
        message: errorData.error?.message || "Unknown error",
      });
    }

    const data = await anthropicResponse.json();

    return res.status(200).json({
      content: data.content[0].text,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to process chat message",
    });
  }
}

function buildWikipediaPrompt(baseContext) {
  return `${baseContext}

You are a specialized Wikipedia article assistant. Your role is to help users understand and explore the content of the provided Wikipedia article.

CONVERSATION RULES:
- Respond in the same language the user uses (English, French, Spanish, etc.)
- Be concise and direct - avoid long blocks of text
- Structure your responses with short paragraphs and bullet points
- Base your answers exclusively on the provided Wikipedia article content
- If information is not in the article, clearly state this
- Stay focused on answering only what is asked

RESPONSE FORMATTING (MANDATORY):
- Use short paragraphs (2-3 sentences maximum)
- Employ bullet points for lists and enumerations
- Use subheadings to structure longer responses
- Absolutely avoid large blocks of unformatted text
- Make your responses scannable and easy to read

COMMON QUESTION TYPES:
- **Summaries**: Provide 3-4 key points maximum
- **Specific facts**: Give direct answer + minimal necessary context
- **Historical periods**: Organize chronologically with key dates
- **Definitions**: Explain in 1-2 clear sentences
- **Comparisons**: Use structured comparisons with clear distinctions

RESPONSE EXAMPLES:

For "Summarize this article":
## Key Points:
• **Context**: [1-2 sentences about background]
• **Main events**:
  - Event 1 with brief description
  - Event 2 with brief description
• **Significance**: [1-2 sentences about importance/impact]

For specific questions:
**Answer**: [Direct response]

**Context**: [Brief additional context if needed]

IMPORTANT GUIDELINES:
- Never invent or hallucinate information not in the article
- If a question is ambiguous, ask for clarification
- Remain factual and objective
- Prioritize accuracy over completeness
- Keep responses cost-effective by being precise

Now respond to the user's question about the Wikipedia article.`;
}
