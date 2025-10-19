interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AnthropicResponse {
  content: Array<{
    text: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AnthropicError {
  error?: {
    message?: string;
  };
}

export class AnthropicService {
  private apiKey: string;
  private baseUrl: string = "https://api.anthropic.com/v1";
  private model: string = "claude-3-haiku-20240307";

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";

    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }
  }

  async sendMessage(
    messages: ChatMessage[],
    context?: string
  ): Promise<ChatResponse> {
    try {
      // Find the system message that contains the RAG context
      const systemMessage = messages.find((msg) => msg.role === "system");
      const userMessages = messages.filter((msg) => msg.role !== "system");

      // Enhanced system prompt for better Wikipedia conversation handling
      let enhancedSystemPrompt = this.buildWikipediaPrompt(
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

      // Prepare the request body
      const requestBody = {
        model: this.model,
        max_tokens: 1500, // Optimized for cost efficiency
        messages: userMessages,
        system: enhancedSystemPrompt,
        temperature: 0.3, // More deterministic for factual responses
      };

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({}))) as AnthropicError;
        throw new Error(
          `Anthropic API error: ${response.statusText} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = (await response.json()) as AnthropicResponse;

      return {
        content: data.content[0].text,
        usage: data.usage,
      };
    } catch (error: unknown) {
      console.error("Anthropic API error:", error);
      this.handleApiError(error);
    }
  }

  private buildWikipediaPrompt(baseContext: string): string {
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

  private handleApiError(error: unknown): never {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("401")) {
      throw new Error("Invalid API key");
    }

    if (errorMessage.includes("429")) {
      throw new Error("Rate limit exceeded - please wait a moment");
    }

    if (errorMessage.includes("400")) {
      throw new Error("Invalid request to Anthropic API");
    }

    throw error;
  }

  async checkHealth(): Promise<boolean> {
    try {
      // Try to make a simple request to check if the service is working
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 10, // Minimal for testing
          messages: [{ role: "user", content: "test" }],
        }),
      });

      // Service is working if we get 200, 400, or 401
      // Other status codes might indicate service issues
      return [200, 400, 401].includes(response.status);
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Method to get model information
  getModelInfo() {
    return {
      model: this.model,
      maxTokens: 1500,
      provider: "Anthropic",
      optimizedFor: "Wikipedia Q&A",
      costEfficient: true,
    };
  }

  // Method to estimate token usage for cost tracking
  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  // Method to get current pricing info (approximate)
  getPricingInfo() {
    return {
      model: "claude-3-haiku-20240307",
      inputTokenCost: 0.00025, // per 1k tokens (approximate)
      outputTokenCost: 0.00125, // per 1k tokens (approximate)
      currency: "USD",
      note: "Pricing may vary - check Anthropic's current rates",
    };
  }
}
