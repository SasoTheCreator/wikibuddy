import { Button } from "@/components/ui/button";
import { Bot, BookOpen, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  currentArticle: {
    title: string;
    url: string;
  } | null;
  onClearContext: () => void;
  onClearChat: () => void;
}

export const ChatHeader = ({
  currentArticle,
  onClearContext,
  onClearChat,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-center p-4 border-b bg-muted/30">
      {currentArticle && (
        <span className="text-sm text-muted-foreground font-bold">
          {currentArticle.title}
        </span>
      )}
    </div>
  );
};
