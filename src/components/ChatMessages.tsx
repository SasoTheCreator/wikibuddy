import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Copy, Check, Bookmark, BookmarkCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageService } from "@/lib/storage";
import WikiBuddyLogo from "@/assets/WikiBuddy.svg";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  copiedMessageId: string | null;
  currentArticle: {
    title: string;
    url: string;
  } | null;
  onCopyMessage: (messageId: string, content: string) => void;
  onSaveBotResponse: (
    messageId: string,
    content: string
  ) => void;
  savedResponseIds: string[];
}

export const ChatMessages = ({
  messages,
  isLoading,
  copiedMessageId,
  currentArticle,
  onCopyMessage,
  onSaveBotResponse,
  savedResponseIds,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessageContent = (content: string) => {
    // Convert ### title to bold (h3)
    let formatted = content.replace(
      /^### (.*$)/gm,
      "<h3 class='font-bold text-lg mb-2 mt-3'>$1</h3>"
    );

    // Convert ## title to bold (h2)
    formatted = formatted.replace(
      /^## (.*$)/gm,
      "<h2 class='font-bold text-xl mb-2 mt-4'>$1</h2>"
    );

    // Convert # title to bold (h1)
    formatted = formatted.replace(
      /^# (.*$)/gm,
      "<h1 class='font-bold text-2xl mb-3 mt-4'>$1</h1>"
    );

    // Convert ***text*** to bold
    formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, "<strong>$1</strong>");

    // Convert **text** to bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert *text* to italic
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Convert line breaks to proper paragraphs
    const paragraphs = formatted
      .split("\n\n")
      .map((paragraph, index) => {
        if (paragraph.trim()) {
          return `<p key="${index}" class="mb-2">${paragraph}</p>`;
        }
        return "";
      })
      .join("");

    return paragraphs;
  };

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      onCopyMessage(messageId, content);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSaveBotResponse = (messageId: string, content: string) => {
    onSaveBotResponse(messageId, content);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <img
            src={WikiBuddyLogo}
            alt="WikiBuddy"
            className="h-12 w-12 mx-auto mb-4 opacity-50"
          />
          <p className="text-lg font-medium mb-2">Start a conversation</p>
          <p className="text-sm">
            {currentArticle
              ? "Ask questions about the loaded Wikipedia article to get started"
              : "Load a Wikipedia article first, then ask questions about it"}
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <img
                    src={WikiBuddyLogo}
                    alt="WikiBuddy"
                    className="h-12 w-12"
                  />
                )}
              </div>
              <div
                className={`rounded-lg px-4 py-3 relative group ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div
                  className="text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html:
                      message.role === "assistant"
                        ? formatMessageContent(message.content)
                        : message.content,
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Find the user question that corresponds to this assistant response
                          handleSaveBotResponse(
                            message.id,
                            message.content
                          );
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        title={
                          savedResponseIds.includes(message.id)
                            ? "Response saved"
                            : "Save response"
                        }
                      >
                        {savedResponseIds.includes(message.id) ? (
                          <BookmarkCheck className="h-3 w-3 text-primary" />
                        ) : (
                          <Bookmark className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopyMessage(message.id, message.content)
                        }
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2 max-w-[85%]">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <img src={WikiBuddyLogo} alt="WikiBuddy" className="h-12 w-12" />
            </div>
            <div className="bg-muted text-foreground rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">
                  Analyzing article content...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
