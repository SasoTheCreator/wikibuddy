import { Button } from "@/components/ui/button";
import { BookOpen, History, Plus, BookmarkCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { aiService } from "@/lib/ai";
import { LocalStorageService } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import WikiBuddyLogo from "@/assets/Wikibuddy-hori.svg";

interface HeaderProps {
  onOpenHistory: () => void;
  onResetConversation?: () => void;
  onNewConversation?: () => void;
}

export const Header = ({ onOpenHistory, onNewConversation }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const startNewConversation = () => {
    // Clear current conversation
    aiService.clearArticleContext();

    // Clear from localStorage
    const context = aiService.getCurrentArticleContext();
    if (context) {
      LocalStorageService.deleteConversation(context.url);
    }

    // Navigate to home
    navigate("/");

    // Trigger new conversation reset
    if (onNewConversation) {
      onNewConversation();
    }

    // Show toast
    toast({
      title: "New conversation started",
      description: "Ready to start a new learning session.",
    });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Warning: Unsaved messages and the current conversation will be lost. Are you sure you want to start a new conversation?"
    );

    if (confirmed) {
      startNewConversation();
    }
  };

  const handleNewConversation = () => {
    const confirmed = window.confirm(
      "Warning: Unsaved messages and the current conversation will be lost. Are you sure you want to start a new conversation?"
    );

    if (confirmed) {
      startNewConversation();
    }
  };

  return (
    <header className="border-b backdrop-blur-sm sticky top-0 z-50">
      <div className="px-6 py-2 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img src={WikiBuddyLogo} alt="WikiBuddy Logo" className=" w-36" />
        </Link>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewConversation}
            title="Start new conversation"
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">New conversation</span>
            <span className="sm:hidden">New +</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHistory}
            title="View conversation history"
            className="px-2 sm:px-3"
          >
            <BookmarkCheck className="h-4 w-4 fill-primary text-primary" />
          </Button>
        </div>
      </div>
    </header>
  );
};
