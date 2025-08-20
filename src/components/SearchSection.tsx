import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SearchSection = () => {
  const [searchUrl, setSearchUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchUrl.trim()) {
      toast({
        title: "Please enter a Wikipedia URL",
        description: "Enter a valid Wikipedia URL to start learning",
        variant: "destructive",
      });
      return;
    }

    // Validate Wikipedia URL
    const wikiUrlPattern = /https?:\/\/[a-z]{2,3}\.wikipedia\.org\/wiki\/.+/i;
    if (!wikiUrlPattern.test(searchUrl)) {
      toast({
        title: "Invalid Wikipedia URL",
        description: "Please enter a valid Wikipedia article URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract article title from URL
      const urlParts = searchUrl.split('/wiki/');
      const articleTitle = decodeURIComponent(urlParts[1]);
      
      // Fetch Wikipedia content
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`
      );
      
      if (!response.ok) {
        throw new Error('Article not found');
      }
      
      const data = await response.json();
      
      toast({
        title: "Article loaded successfully!",
        description: `Ready to explore: ${data.title}`,
      });
      
      // Here you would typically navigate to chat interface
      console.log('Wikipedia article data:', data);
      
    } catch (error) {
      toast({
        title: "Failed to load article",
        description: "Please check the URL and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Learn with <span className="text-primary">Wikipedia</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Paste a Wikipedia URL to start an interactive learning session
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchUrl}
              onChange={(e) => setSearchUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://en.wikipedia.org/wiki/..."
              className="pl-10 h-12 text-base"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            size="lg" 
            className="h-12 px-6"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Try: <span 
              className="text-primary cursor-pointer hover:underline"
              onClick={() => setSearchUrl("https://en.wikipedia.org/wiki/Artificial_intelligence")}
            >
              Artificial Intelligence
            </span> or <span 
              className="text-primary cursor-pointer hover:underline"
              onClick={() => setSearchUrl("https://en.wikipedia.org/wiki/Climate_change")}
            >
              Climate Change
            </span>
          </p>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 For full chat functionality and note-saving features, connect to Supabase by clicking the green button in the top-right corner.
        </p>
      </div>
    </div>
  );
};