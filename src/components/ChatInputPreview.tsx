import { Button } from "@/components/ui/button";
import { Send, Lock } from "lucide-react";

interface ChatInputPreviewProps {
  onFirstQuestion: () => void;
}

export const ChatInputPreview = ({
  onFirstQuestion,
}: ChatInputPreviewProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-muted/20 rounded-lg p-6 border border-dashed border-muted-foreground/30">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Lock className="h-5 w-5" />
            <div className="text-sm font-medium"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Load the URL of an{" "}
            <span className="font-bold">English Wikipedia article </span>
            and WikiBuddy will help you learn more about it.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex space-x-2 opacity-50 pointer-events-none">
            <div className="flex-1 relative">
              <textarea
                placeholder="Ask a question about the Wikipedia article..."
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] max-h-[150px]"
                rows={4}
                disabled
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
            <Button size="lg" className="h-[80px] px-4" disabled>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
