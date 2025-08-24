export interface ConversationMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface SavedBotResponse {
  id: string;
  content: string;
  timestamp: Date;
  articleTitle: string;
  articleUrl: string;
  conversationId: string; // To group responses by conversation
  userQuestion?: string; // The question that triggered this response
}

export interface ArticleConversation {
  id: string;
  articleTitle: string;
  articleUrl: string;
  savedResponses: SavedBotResponse[];
  lastUpdated: Date;
  responseCount: number;
  firstQuestion?: string;
}

export class LocalStorageService {
  private static readonly STORAGE_KEY = "wiki_scribe_conversations";
  private static readonly MAX_CONVERSATIONS = 20;

  public static saveBotResponse(
    articleTitle: string,
    articleUrl: string,
    response: SavedBotResponse
  ): void {
    try {
      const conversations = this.getAllConversations();

      // Find or create conversation for this article
      let conversation = conversations.find(
        (conv) => conv.articleUrl === articleUrl
      );

      if (!conversation) {
        conversation = {
          id: this.generateId(),
          articleTitle: articleTitle || "Untitled Article",
          articleUrl,
          savedResponses: [],
          lastUpdated: new Date(),
          responseCount: 0,
        };
        conversations.push(conversation);
      }

      // Add the response to the conversation
      conversation.savedResponses.push(response);
      conversation.lastUpdated = new Date();
      conversation.responseCount = conversation.savedResponses.length;
      conversation.firstQuestion =
        conversation.firstQuestion || response.userQuestion;

      // Keep only the most recent conversations
      conversations.sort(
        (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
      );
      const limitedConversations = conversations.slice(
        0,
        this.MAX_CONVERSATIONS
      );

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(limitedConversations)
      );
    } catch (error) {
      console.error("Error saving bot response to localStorage:", error);
    }
  }

  public static removeBotResponse(
    articleUrl: string,
    responseId: string
  ): void {
    try {
      const conversations = this.getAllConversations();
      const conversationIndex = conversations.findIndex(
        (conv) => conv.articleUrl === articleUrl
      );

      if (conversationIndex >= 0) {
        const conversation = conversations[conversationIndex];
        conversation.savedResponses = conversation.savedResponses.filter(
          (response) => response.id !== responseId
        );
        conversation.responseCount = conversation.savedResponses.length;
        conversation.lastUpdated = new Date();

        // Remove conversation if no responses left
        if (conversation.savedResponses.length === 0) {
          conversations.splice(conversationIndex, 1);
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
      }
    } catch (error) {
      console.error("Error removing bot response from localStorage:", error);
    }
  }

  public static getConversation(
    articleUrl: string
  ): ArticleConversation | null {
    try {
      const conversations = this.getAllConversations();
      const conversation = conversations.find(
        (conv) => conv.articleUrl === articleUrl
      );

      if (conversation) {
        return {
          ...conversation,
          savedResponses: conversation.savedResponses.map((response) => ({
            ...response,
            timestamp: new Date(response.timestamp),
          })),
          lastUpdated: new Date(conversation.lastUpdated),
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting conversation from localStorage:", error);
      return null;
    }
  }

  public static getAllConversations(): ArticleConversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const conversations = JSON.parse(stored);
      return conversations.map((conv: Partial<ArticleConversation>) => ({
        ...conv,
        savedResponses: (conv.savedResponses || []).map(
          (response: Partial<SavedBotResponse>) => ({
            ...response,
            timestamp: new Date(response.timestamp || Date.now()),
          })
        ),
        lastUpdated: new Date(conv.lastUpdated || Date.now()),
      }));
    } catch (error) {
      console.error(
        "Error getting all conversations from localStorage:",
        error
      );
      return [];
    }
  }

  public static deleteConversation(articleUrl: string): void {
    try {
      const conversations = this.getAllConversations();
      const filteredConversations = conversations.filter(
        (conv) => conv.articleUrl !== articleUrl
      );
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(filteredConversations)
      );
    } catch (error) {
      console.error("Error deleting conversation from localStorage:", error);
    }
  }

  public static clearAllConversations(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error(
        "Error clearing all conversations from localStorage:",
        error
      );
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public static getStorageInfo(): {
    used: number;
    total: number;
    conversations: number;
  } {
    try {
      const conversations = this.getAllConversations();
      const used = new Blob([JSON.stringify(conversations)]).size;
      const total = 5 * 1024 * 1024; // 5MB typical localStorage limit

      return {
        used,
        total,
        conversations: conversations.length,
      };
    } catch (error) {
      return { used: 0, total: 0, conversations: 0 };
    }
  }
}
