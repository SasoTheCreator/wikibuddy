import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, MessageSquare, Search, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";

export const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Learn{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Smarter
                </span>
                <br />
                with Wikipedia
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Transform your Wikipedia reading into interactive learning sessions. 
                Ask questions, take notes, and organize your knowledge like never before.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Paste a Wikipedia URL to get started..."
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button variant="hero" size="lg" className="h-12">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Learning
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Or try: <span className="text-primary cursor-pointer hover:underline">
                  en.wikipedia.org/wiki/Artificial_intelligence
                </span>
              </p>
            </div>
          </div>

          <div className="relative lg:ml-8">
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src={heroImage} 
                alt="Educational learning illustration" 
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-medium animate-bounce">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-3 rounded-full shadow-medium animate-bounce [animation-delay:0.5s]">
              <MessageSquare className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};