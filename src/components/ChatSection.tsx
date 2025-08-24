import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/lib/ai";
import { LocalStorageService } from "@/lib/storage";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<{
    title: string;
    url: string;
  } | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for current article context and load existing conversation
  useEffect(() => {
    const checkArticleContext = () => {
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
          setMessages(savedConversation.messages);
        }
      } else {
        setCurrentArticle(null);
        setMessages([]);
      }
    };

    checkArticleContext();
    // Set up an interval to check for context changes
    const interval = setInterval(checkArticleContext, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (currentArticle && messages.length > 0) {
      LocalStorageService.saveConversation(
        currentArticle.title,
        currentArticle.url,
        messages
      );
    }
  }, [messages, currentArticle]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check if we have article context
    const context = aiService.getCurrentArticleContext();
    if (!context) {
      toast({
        title: "No article loaded",
        description:
          "Please load a Wikipedia article first before asking questions",
        variant: "destructive",
        className: "pb-2",
      });
      return;
    }

    // Check if user is trying to change the article (new URL detected)
    const isChangingArticle = aiService.isUserChangingArticle(
      inputValue.trim()
    );
    const detectedUrl = aiService.detectWikipediaUrl(inputValue.trim());

    if (isChangingArticle && detectedUrl && messages.length > 0) {
      const confirmed = window.confirm(
        "Warning: Unsaved messages and the current conversation will be lost. Are you sure you want to start a new conversation with the new article?"
      );

      if (!confirmed) {
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Use AI service to generate response with RAG context
      const response = await aiService.sendMessage(inputValue.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    aiService.clearHistory();

    // Clear from localStorage
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
    toast({
      title: "Article context cleared",
      description: "Load a new Wikipedia article to start a new session.",
    });
  };

  const handleCopyMessage = (messageId: string, content: string) => {
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[500px] flex flex-col bg-background border rounded-lg shadow-sm">
      <ChatHeader
        currentArticle={currentArticle}
        onClearContext={handleClearContext}
        onClearChat={handleClearChat}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        copiedMessageId={copiedMessageId}
        onCopyMessage={handleCopyMessage}
      />

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        hasArticle={!!currentArticle}
      />
    </div>
  );
};
