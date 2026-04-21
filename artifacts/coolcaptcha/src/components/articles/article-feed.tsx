import React, { useState, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";
import { articles, ApiArticle, ArticlesResponse } from "./article-data";
import { ArticleCard } from "./article-card";

interface ArticleFeedProps {
  onArticleClick?: (article: ApiArticle) => void;
}

export const ArticleFeed = ({ onArticleClick }: ArticleFeedProps) => {
  const [apiArticles, setApiArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/public/articles?limit=6");
        const data: ArticlesResponse = await response.json();

        if (data.success) {
          setApiArticles(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch articles");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Using fallback content.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const displayArticles = apiArticles.length > 0 ? apiArticles : articles;

  return (
    <div className="w-full mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px bg-white/10 flex-1" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          <Zap size={12} className="text-primary" />
          Curated for your industry via RSS
        </div>
        <div className="h-px bg-white/10 flex-1" />
      </div>
      <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
        Webmasters choose what content appears below the CAPTCHA — tech, finance, sports, and more — keeping users engaged while verification runs.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayArticles.map((article, i) => (
            <ArticleCard
              key={"id" in article ? (article as ApiArticle).id : i}
              article={article}
              index={i}
              onClick={onArticleClick}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-center text-xs text-muted-foreground mt-4">{error}</p>
      )}
    </div>
  );
};
