import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Trash2,
  BookOpen,
  MessageSquare,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  History,
  Bookmark,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LocalStorageService, ArticleConversation } from "@/lib/storage";

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConversation: (conversation: ArticleConversation) => void;
}

export const ConversationHistory = ({
  isOpen,
  onClose,
  onLoadConversation,
}: ConversationHistoryProps) => {
  const [conversations, setConversations] = useState<ArticleConversation[]>([]);
  const { toast } = useToast();

  const formatResponseContent = (content: string) => {
    // Convert ### title to bold (h3)
    let formatted = content.replace(
      /^### (.*$)/gm,
      "<h3 class='font-bold text-sm mb-1 mt-2'>$1</h3>"
    );

    // Convert ## title to bold (h2)
    formatted = formatted.replace(
      /^## (.*$)/gm,
      "<h2 class='font-bold text-base mb-1 mt-2'>$1</h2>"
    );

    // Convert # title to bold (h1)
    formatted = formatted.replace(
      /^# (.*$)/gm,
      "<h1 class='font-bold text-lg mb-2 mt-2'>$1</h1>"
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
          return `<p key="${index}" class="mb-1">${paragraph}</p>`;
        }
        return "";
      })
      .join("");

    return paragraphs;
  };

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = () => {
    const savedConversations = LocalStorageService.getAllConversations();
    setConversations(savedConversations);
  };

  const handleDeleteConversation = (articleUrl: string) => {
    LocalStorageService.deleteConversation(articleUrl);
    loadConversations();
    toast({
      title: "Conversation deleted",
      description: "The conversation has been removed from your history.",
    });
  };

  const handleLoadConversation = (conversation: ArticleConversation) => {
    onLoadConversation(conversation);
    onClose();
    toast({
      title: "Conversation loaded",
      description: `Loaded conversation about: ${conversation.articleTitle}`,
    });
  };

  const handleCopyResponse = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Response content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy response to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Saved Responses</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                No saved responses yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the bookmark icon on bot responses to save them here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Article Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <div>
                        <h3 className="font-medium text-sm">
                          {conversation.articleTitle || "Untitled Article"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {conversation.responseCount} saved responses •{" "}
                          {formatDate(conversation.lastUpdated)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteConversation(conversation.articleUrl)
                        }
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Saved Responses */}
                  <div className="space-y-3">
                    {conversation.savedResponses.map((response) => (
                      <div
                        key={response.id}
                        className="bg-muted/50 rounded-lg p-3 group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Bookmark className="h-3 w-3 text-primary" />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(response.timestamp)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyResponse(response.content)}
                            className="h-6 w-6 p-0"
                            title="Copy response"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* User Question (if available) */}
                        {response.userQuestion && (
                          <div className="mb-2 p-2 bg-background rounded text-xs text-muted-foreground">
                            <strong>Q:</strong> {response.userQuestion}
                          </div>
                        )}

                        {/* Bot Response */}
                        <div className="text-sm">
                          <div
                            className="line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: formatResponseContent(response.content),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
