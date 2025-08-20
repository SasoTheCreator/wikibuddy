import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, UserPlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            WikiLearn
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};