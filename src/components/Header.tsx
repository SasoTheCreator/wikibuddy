import { Button } from "@/components/ui/button";
import { BookOpen, LogIn } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            WikiLearn
          </h1>
        </div>

        <Button variant="ghost" size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </div>
    </header>
  );
};