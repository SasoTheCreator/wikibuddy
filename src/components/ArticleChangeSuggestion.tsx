import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ArticleChangeSuggestionProps {
  detectedUrl?: string;
  onLoadNewArticle: () => void;
}

export const ArticleChangeSuggestion = ({
  detectedUrl,
  onLoadNewArticle,
}: ArticleChangeSuggestionProps) => {
  if (!detectedUrl) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900">
            New Wikipedia URL detected
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            I noticed you mentioned a different Wikipedia article. To properly load
            and analyze the new article, please use the search interface above.
          </p>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadNewArticle}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load New Article
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
