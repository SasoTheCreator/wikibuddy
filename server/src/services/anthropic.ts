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
  private model: string = "claude-sonnet-4-20250514";

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

      // Enhanced system prompt for better conversation handling
      let enhancedSystemPrompt = systemMessage?.content || context || "";

      // Add conversation guidance if context contains metadata
      if (context && context.includes("New article loaded: yes")) {
        enhancedSystemPrompt += `

CONVERSATION UPDATE:
- A new Wikipedia article has been automatically loaded based on the user's request
- You now have access to the new article's content
- Provide a helpful response about the new topic
- Acknowledge the article switch naturally in your response`;
      } else if (
        context &&
        context.includes("User is trying to change article")
      ) {
        enhancedSystemPrompt += `

CONVERSATION GUIDANCE:
- The user is trying to change the article or provided a new URL
- If a new article was loaded automatically, acknowledge it and respond about the new topic
- If no new article was loaded, guide them to use the search interface
- Be helpful and explain the correct workflow for changing articles
- Always maintain context of the current conversation while guiding them appropriately`;
      }

      // Prepare the request body
      const requestBody: any = {
        model: this.model,
        max_tokens: 2000,
        messages: userMessages,
        system: enhancedSystemPrompt,
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

      // Re-throw with more specific error messages
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("401")) {
        throw new Error("Invalid API key");
      }

      if (errorMessage.includes("429")) {
        throw new Error("Rate limit exceeded");
      }

      if (errorMessage.includes("400")) {
        throw new Error("Invalid request to Anthropic API");
      }

      throw error;
    }
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
          max_tokens: 1,
          messages: [{ role: "user", content: "test" }],
        }),
      });

      // If we get a 400 or 401, the service is working but our request is invalid
      // If we get a 200, the service is working perfectly
      // If we get other errors, the service might be down
      return (
        response.status === 200 ||
        response.status === 400 ||
        response.status === 401
      );
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  // Method to get model information
  getModelInfo() {
    return {
      model: this.model,
      maxTokens: 1000,
      provider: "Anthropic",
    };
  }
}
