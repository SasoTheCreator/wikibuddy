import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/lib/ai";
import { LocalStorageService, ArticleConversation } from "@/lib/storage";
import { ChatContainer } from "./ChatContainer";
import { ConversationHistory } from "./ConversationHistory";
import { SearchInterface } from "./SearchInterface";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface SearchSectionProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
  onResetConversation?: () => void;
}

export const SearchSection = ({
  isHistoryOpen,
  setIsHistoryOpen,
  onResetConversation,
}: SearchSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [currentArticle, setCurrentArticle] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [isConversationSaved, setIsConversationSaved] = useState(false);
  const [savedResponseIds, setSavedResponseIds] = useState<string[]>([]);
  const [hasUnsavedMessages, setHasUnsavedMessages] = useState(false);
  const [unsavedMessageCount, setUnsavedMessageCount] = useState(0);
  const { toast } = useToast();

  // Check for existing conversation on component mount
  useEffect(() => {
    const checkExistingConversation = () => {
      const context = aiService.getCurrentArticleContext();
      if (context) {
        setCurrentArticle({
          title: context.title,
          url: context.url,
        });

        // Load existing conversation from localStorage
        const savedConversation = LocalStorageService.getConversation(
          context.url
        );
        if (savedConversation) {
          setIsConversationSaved(true);
        }
      }
    };

    checkExistingConversation();
  }, []);

  // Set up article change callback
  useEffect(() => {
    aiService.setArticleChangeCallback((newArticle) => {
      setCurrentArticle({
        title: newArticle.title,
        url: newArticle.url,
      });

      // Clear previous messages when switching articles
      setMessages([]);
      setIsConversationSaved(false);
      setHasUnsavedMessages(false);
      setUnsavedMessageCount(0);

      toast({
        title: "Article switched automatically!",
        description: `Now learning about: ${newArticle.title}`,
      });
    });
  }, [toast]);

  // Track unsaved messages
  useEffect(() => {
    if (messages.length > 0 && currentArticle) {
      const conversation = LocalStorageService.getConversation(
        currentArticle.url
      );
      const savedCount = conversation?.savedResponses.length || 0;
      const botMessages = messages.filter(
        (msg) => msg.role === "assistant"
      ).length;
      const unsavedCount = botMessages - savedCount;
      setUnsavedMessageCount(unsavedCount);
      setHasUnsavedMessages(unsavedCount >= 5);
    } else {
      setUnsavedMessageCount(0);
      setHasUnsavedMessages(false);
    }
  }, [messages, currentArticle]);

  // Load saved response IDs for current article
  useEffect(() => {
    if (currentArticle) {
      const conversation = LocalStorageService.getConversation(
        currentArticle.url
      );
      if (conversation) {
        setSavedResponseIds(
          conversation.savedResponses.map((response) => response.id)
        );
      } else {
        setSavedResponseIds([]);
      }
    }
  }, [currentArticle]);

  const handleNewConversation = useCallback(() => {
    // Clear current state
    setMessages([]);
    setInputValue("");
    setCurrentArticle(null);
    setIsConversationSaved(false);
    setSavedResponseIds([]);
    setHasUnsavedMessages(false);
    setUnsavedMessageCount(0);

    // Clear AI context
    aiService.clearArticleContext();
  }, []);

  const handleArticleLoaded = useCallback(
    (article: { title: string; url: string }) => {
      setCurrentArticle(article);
      // Clear previous messages when loading new article
      setMessages([]);
      setIsConversationSaved(false);
      setHasUnsavedMessages(false);
      setUnsavedMessageCount(0);
    },
    []
  );

  const handleSearchStart = useCallback(() => {
    // This will be called when search starts to clear any existing state
    setMessages([]);
    setIsConversationSaved(false);
    setHasUnsavedMessages(false);
    setUnsavedMessageCount(0);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isChatLoading) return;

    const context = aiService.getCurrentArticleContext();
    if (!context) {
      toast({
        title: "No article loaded",
        description:
          "Please load a Wikipedia article first before asking questions",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsChatLoading(true);

    try {
      const response = await aiService.sendMessage(inputValue.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle automatic article switching
      if (response.newArticleLoaded) {
        // The article has been automatically switched
        // The callback in useEffect will handle the UI updates
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    aiService.clearHistory();
    setIsConversationSaved(false);
    setHasUnsavedMessages(false);
    setUnsavedMessageCount(0);

    if (currentArticle) {
      LocalStorageService.deleteConversation(currentArticle.url);
    }

    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };

  const handleClearContext = () => {
    aiService.clearArticleContext();
    setMessages([]);
    setCurrentArticle(null);
    setIsConversationSaved(false);
    setHasUnsavedMessages(false);
    setUnsavedMessageCount(0);
    toast({
      title: "Article context cleared",
      description: "Load a new Wikipedia article to start a new session.",
    });
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveBotResponse = (
    messageId: string,
    content: string,
    userQuestion?: string
  ) => {
    if (!currentArticle) return;

    const response = {
      id: messageId,
      content,
      timestamp: new Date(),
      articleTitle: currentArticle.title,
      articleUrl: currentArticle.url,
      conversationId: currentArticle.url,
      userQuestion,
    };

    LocalStorageService.saveBotResponse(
      currentArticle.title,
      currentArticle.url,
      response
    );

    setSavedResponseIds((prev) => [...prev, messageId]);

    // Recalculate unsaved message count after saving
    const conversation = LocalStorageService.getConversation(
      currentArticle.url
    );
    const savedCount = conversation?.savedResponses.length || 0;
    const botMessages = messages.filter(
      (msg) => msg.role === "assistant"
    ).length;
    const unsavedCount = botMessages - savedCount;
    setUnsavedMessageCount(unsavedCount);
    setHasUnsavedMessages(unsavedCount >= 5);

    toast({
      title: "Response saved",
      description: "This response has been added to your saved responses.",
    });
  };

  const handleLoadConversation = (conversation: ArticleConversation) => {
    // Load the article context
    aiService.setArticleContext({
      title: conversation.articleTitle,
      content: "", // We'll need to reload the content
      url: conversation.articleUrl,
    });

    setCurrentArticle({
      title: conversation.articleTitle,
      url: conversation.articleUrl,
    });

    // Don't load messages since we only save bot responses
    setIsConversationSaved(true);

    // Note: The article content will need to be reloaded separately
    // This could be done by triggering a search through the SearchInterface
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Show SearchInterface only when no conversation is active */}
      {!currentArticle && (
        <div className="flex-1 flex items-center justify-center p-8">
          <SearchInterface
            onArticleLoaded={handleArticleLoaded}
            onSearchStart={handleSearchStart}
            hasUnsavedMessages={hasUnsavedMessages}
            unsavedMessageCount={unsavedMessageCount}
          />
        </div>
      )}

      {/* Chat Container */}
      {currentArticle && (
        <div className="flex-1">
          <ChatContainer
            currentArticle={currentArticle}
            messages={messages}
            isLoading={isChatLoading}
            copiedMessageId={copiedMessageId}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onClearContext={handleClearContext}
            onClearChat={handleClearChat}
            onCopyMessage={handleCopyMessage}
            onSaveBotResponse={handleSaveBotResponse}
            savedResponseIds={savedResponseIds}
            hasUnsavedMessages={hasUnsavedMessages}
            unsavedMessageCount={unsavedMessageCount}
          />
        </div>
      )}

      {/* Conversation History Modal */}
      <ConversationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadConversation={handleLoadConversation}
      />
    </div>
  );
};
