import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, AlertTriangle } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  hasArticle: boolean;
  isPreview?: boolean;
  onFirstQuestion?: () => void;
  hasUnsavedMessages?: boolean;
  unsavedMessageCount?: number;
}

export const ChatInput = ({
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading,
  hasArticle,
  isPreview = false,
  onFirstQuestion,
  hasUnsavedMessages = false,
  unsavedMessageCount = 0,
}: ChatInputProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isPreview && onFirstQuestion) {
        onFirstQuestion();
      } else {
        onSendMessage();
      }
    }
  };

  const handleSendClick = () => {
    if (isPreview && onFirstQuestion) {
      onFirstQuestion();
    } else {
      onSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const placeholder = hasArticle
    ? "Ask a question about the Wikipedia article..."
    : "Load a Wikipedia article first to start asking questions";

  if (isPreview) {
    return (
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] max-h-[150px]"
              rows={4}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
          <Button
            onClick={handleSendClick}
            disabled={!inputValue.trim()}
            size="lg"
            className="h-[80px] px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t p-4">
      {/* Warning for unsaved messages - only show when user starts typing and has 5+ unsaved messages */}
      {unsavedMessageCount >= 5 && isInputFocused && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">
              You have {unsavedMessageCount} unsaved bot responses
            </span>
          </div>
          <p className="text-xs text-amber-700 mt-1">
            Remember to click the bookmark icon on responses you want to keep
            before starting a new conversation.
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] max-h-[150px]"
            rows={4}
            disabled={isLoading || !hasArticle}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
        <Button
          onClick={onSendMessage}
          disabled={isLoading || !inputValue.trim() || !hasArticle}
          size="lg"
          className="h-[80px] px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
