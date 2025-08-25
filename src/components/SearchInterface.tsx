import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, X, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WikipediaService } from "@/lib/wikipedia";
import { aiService } from "@/lib/ai";
import WikiBuddyLogo from "@/assets/Wikibuddy-hori.svg";

interface SearchInterfaceProps {
  onArticleLoaded: (article: { title: string; url: string }) => void;
  onSearchStart: () => void;
  hasUnsavedMessages: boolean;
  unsavedMessageCount: number;
}

export const SearchInterface = ({
  onArticleLoaded,
  onSearchStart,
  hasUnsavedMessages,
  unsavedMessageCount,
}: SearchInterfaceProps) => {
  const [searchUrl, setSearchUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { toast } = useToast();

  // Validate URL when input changes
  useEffect(() => {
    if (searchUrl.trim()) {
      validateUrl(searchUrl);
    } else {
      setUrlError(null);
    }
  }, [searchUrl]);

  const validateUrl = useCallback((url: string) => {
    if (!url.trim()) {
      setUrlError(null);
      return;
    }

    // Check if it's a valid URL format
    try {
      new URL(url);
    } catch {
      setUrlError("Please enter a valid URL");
      return;
    }

    // Check if it's a Wikipedia URL
    if (!WikipediaService.isValidWikipediaUrl(url)) {
      setUrlError("Please enter a valid English Wikipedia article URL");
      return;
    }

    // Check if it's an English Wikipedia URL
    if (!url.includes("en.wikipedia.org")) {
      setUrlError("Only English Wikipedia articles are supported");
      return;
    }

    setUrlError(null);
  }, []);

  const handleSearch = async () => {
    if (!searchUrl.trim()) {
      toast({
        title: "Please enter a Wikipedia URL",
        description: "Enter a valid Wikipedia URL to start learning",
        variant: "destructive",
      });
      return;
    }

    if (urlError) {
      toast({
        title: "Invalid URL",
        description: urlError,
        variant: "destructive",
      });
      return;
    }

    // Check if there are 5 or more unsaved messages
    if (unsavedMessageCount >= 5) {
      const confirmed = window.confirm(
        `You have ${unsavedMessageCount} unsaved bot responses. Starting a new conversation will clear all unsaved messages. Continue?`
      );
      if (!confirmed) {
        return;
      }
    }

    setIsLoading(true);
    onSearchStart();

    try {
      const articleTitle = WikipediaService.extractTitleFromUrl(searchUrl);

      if (!articleTitle) {
        throw new Error("Could not extract article title from URL");
      }

      toast({
        title: "Loading article content...",
        description: "Fetching full article content for better answers",
      });

      const summaryData = await WikipediaService.getPageSummary(articleTitle);
      const fullContent = await WikipediaService.getPageContentText(
        articleTitle
      );

      aiService.setArticleContext({
        title: summaryData.title,
        content: fullContent,
        url: searchUrl,
      });

      onArticleLoaded({
        title: summaryData.title,
        url: searchUrl,
      });

      toast({
        title: "Article loaded successfully!",
        description: `Ready to explore: ${summaryData.title}. You can now ask detailed questions in the chat!`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Failed to load article",
        description:
          error instanceof Error
            ? error.message
            : "Please check the URL and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, []);

  const handleClearInput = useCallback(() => {
    setSearchUrl("");
    setUrlError(null);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
  }, []);

  const isUrlValid = searchUrl.trim() && !urlError;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-6 flex flex-col items-center align-center">
        <img
          src={WikiBuddyLogo}
          alt="WikiBuddy Logo"
          className=" w-32 text-center"
        />
        <div className="flex flex-col items-center gap-4 ">
          <h1 className="text-4xl font-bold text-muted-foreground">
            Learn with Wikipedia
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Paste an English Wikipedia URL to start an interactive learning
            session. Your buddy will help learn more about the subject and you
            will be able to save its answers.
          </p>
        </div>
      </div>

      {/* Search Input Section */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="https://en.wikipedia.org/wiki/..."
                className={`pl-12 h-16 text-lg transition-colors ${
                  urlError
                    ? "border-destructive focus-visible:ring-destructive"
                    : isUrlValid
                    ? "border-green-500 focus-visible:ring-green-500 bg-green-50"
                    : ""
                }`}
                disabled={isLoading}
              />
              {isUrlValid && (
                <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
              )}
              {searchUrl && !isUrlValid && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearInput}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading || !isUrlValid}
              size="lg"
              className="h-16 px-8 text-lg w-full sm:w-auto"
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

          {/* Error Message - now shows immediately */}
          {urlError && (
            <div className="flex items-center space-x-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{urlError}</span>
            </div>
          )}

          {/* Success Message - when URL is valid */}
          {isUrlValid && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>✓ Valid Wikipedia URL detected</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-base text-muted-foreground">
            Try:{" "}
            <span
              className="text-primary cursor-pointer hover:underline font-medium"
              onClick={() =>
                setSearchUrl(
                  "https://en.wikipedia.org/wiki/Artificial_intelligence"
                )
              }
            >
              Artificial Intelligence
            </span>{" "}
            or{" "}
            <span
              className="text-primary cursor-pointer hover:underline font-medium"
              onClick={() =>
                setSearchUrl("https://en.wikipedia.org/wiki/Climate_change")
              }
            >
              Climate Change
            </span>
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 rounded-lg p-6 text-center">
        <p className="text-base text-muted-foreground">
          💡 Your conversations are automatically saved locally and organized by
          article. You can also paste Wikipedia URLs directly in the chat to
          switch articles!
        </p>
      </div>
    </div>
  );
};
