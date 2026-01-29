export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  newArticleLoaded?: {
    title: string;
    url: string;
  };
}

export interface ArticleContext {
  title: string;
  content: string;
  url: string;
}

export class AIService {
  private static instance: AIService;
  private conversationHistory: ChatMessage[] = [];
  private backendUrl: string;
  private currentArticleContext: ArticleContext | null = null;
  private onArticleChange?: (article: ArticleContext) => void;

  private constructor() {
    // Use environment variable or default to localhost
    this.backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

    // Production host override: if running on Vercel, use relative API path
    // This allows the frontend to call serverless functions on the same domain
    if (typeof window !== "undefined") {
      const host = window.location.host;

      // For Vercel deployments, use relative API path
      if (host.includes("vercel.app") || host === "wikibuddy.lovable.app") {
        this.backendUrl = "";
      }
    }
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public setArticleChangeCallback(callback: (article: ArticleContext) => void) {
    this.onArticleChange = callback;
  }

  public setSystemPrompt(prompt: string): void {
    // Remove any existing system prompt
    this.conversationHistory = this.conversationHistory.filter(
      (msg) => msg.role !== "system"
    );

    // Add the new system prompt at the beginning
    this.conversationHistory.unshift({
      role: "system",
      content: prompt,
    });
  }

  public setArticleContext(context: ArticleContext): void {
    this.currentArticleContext = context;

    // Update system prompt with article context
    const systemPrompt = `You are an AI learning assistant helping users understand Wikipedia articles. 

Current article: ${context.title}
Article URL: ${context.url}

IMPORTANT GUIDELINES:
1. You have access to the full article content below. Use this content to provide accurate, detailed, and contextual answers to user questions.
2. If the user asks about topics not covered in this article, politely redirect them to ask questions about the current article or suggest they search for a different Wikipedia article.
3. Structure your responses clearly with proper formatting:
   - Use ***bold text*** for important concepts and key terms
   - Use bullet points (•) for lists and multiple answers
   - Break down complex topics into clear sections
   - Be concise but comprehensive
   - Use paragraphs to separate different ideas
4. When answering multiple questions, address each one separately with clear headings or bullet points.
5. Always provide context and explanations that help the user understand the topic better.
6. If the user provides a new Wikipedia URL, acknowledge that you'll switch to that article and provide a helpful response about the new topic.

Article content:
${context.content}`;

    this.setSystemPrompt(systemPrompt);
  }

  public getCurrentArticleContext(): ArticleContext | null {
    return this.currentArticleContext;
  }

  public clearArticleContext(): void {
    this.currentArticleContext = null;
    this.clearHistory();
  }

  // New method to detect Wikipedia URLs in user messages
  public detectWikipediaUrl(message: string): string | null {
    const urlPattern = /https?:\/\/[a-z]{2,3}\.wikipedia\.org\/wiki\/[^\s]+/gi;
    const match = message.match(urlPattern);
    return match ? match[0] : null;
  }

  // New method to check if user is trying to change the article
  public isUserChangingArticle(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const hasUrl = this.detectWikipediaUrl(message);
    const hasChangeKeywords =
      /(wrong|incorrect|mistake|different|change|switch|new|another)/i.test(
        message
      );

    return Boolean(hasUrl) || hasChangeKeywords;
  }

  // New method to load article from URL
  public async loadArticleFromUrl(url: string): Promise<ArticleContext | null> {
    try {
      const { WikipediaService } = await import("./wikipedia");

      if (!WikipediaService.isValidWikipediaUrl(url)) {
        throw new Error("Invalid Wikipedia URL");
      }

      const articleTitle = WikipediaService.extractTitleFromUrl(url);
      if (!articleTitle) {
        throw new Error("Could not extract article title from URL");
      }

      const summaryData = await WikipediaService.getPageSummary(articleTitle);
      const fullContent = await WikipediaService.getPageContentText(
        articleTitle
      );

      const newContext: ArticleContext = {
        title: summaryData.title,
        content: fullContent,
        url: url,
      };

      // Update the current context
      this.setArticleContext(newContext);

      // Notify the parent component
      if (this.onArticleChange) {
        this.onArticleChange(newContext);
      }

      return newContext;
    } catch (error) {
      console.error("Error loading article from URL:", error);
      return null;
    }
  }

  public async sendMessage(
    userMessage: string,
    context?: string
  ): Promise<ChatResponse> {
    // Check if user is trying to change the article
    const isChangingArticle = this.isUserChangingArticle(userMessage);
    const detectedUrl = this.detectWikipediaUrl(userMessage);

    // If a new URL is detected, try to load it automatically
    let newArticleLoaded = null;
    if (detectedUrl && isChangingArticle) {
      newArticleLoaded = await this.loadArticleFromUrl(detectedUrl);
    }

    // Add user message to conversation history
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    try {
      // Generate AI response through backend
      const response = await this.generateResponse(userMessage, context, {
        isChangingArticle,
        detectedUrl,
        newArticleLoaded,
      });

      // Add assistant response to conversation history
      this.conversationHistory.push({
        role: "assistant",
        content: response.content,
      });

      return {
        ...response,
        newArticleLoaded: newArticleLoaded
          ? {
              title: newArticleLoaded.title,
              url: newArticleLoaded.url,
            }
          : undefined,
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate AI response");
    }
  }

  private async generateResponse(
    userMessage: string,
    context?: string,
    metadata?: {
      isChangingArticle: boolean;
      detectedUrl: string | null;
      newArticleLoaded: ArticleContext | null;
    }
  ): Promise<ChatResponse> {
    // Prepare messages for the API
    const messages = this.conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add metadata to context if available
    let enhancedContext = context;
    if (metadata) {
      enhancedContext = `${
        context || ""
      }\n\nUser is trying to change article: ${
        metadata.isChangingArticle
      }\nDetected URL: ${metadata.detectedUrl || "none"}\nNew article loaded: ${
        metadata.newArticleLoaded ? "yes" : "no"
      }`;
    }

    // Call the backend API
    return await this.callBackendAPI(messages, enhancedContext);
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }

  public getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  // Method to call our backend API
  private async callBackendAPI(
    messages: ChatMessage[],
    context?: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.backendUrl}/api/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          context: context,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Backend API error: ${response.statusText} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      return {
        content: data.content,
        usage: data.usage,
      };
    } catch (error: unknown) {
      console.error("Backend API error:", error);

      // Handle specific error types
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("Failed to fetch")) {
        throw new Error(
          "Cannot connect to backend server. Please check if the server is running."
        );
      }

      if (errorMessage.includes("401")) {
        throw new Error(
          "Authentication failed. Please check your API configuration."
        );
      }

      if (errorMessage.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }

  // Method to check if backend is healthy
  public async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("Backend health check failed:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const aiService = AIService.getInstance();
