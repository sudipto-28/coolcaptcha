import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { ApiArticle, ArticleResponse } from "./article-data";
import { Button } from "@/components/ui/button";

interface ArticleDetailProps {
  slug: string;
  onBack: () => void;
}

export const ArticleDetail = ({ slug, onBack }: ArticleDetailProps) => {
  const [article, setArticle] = useState<ApiArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/public/articles/${slug}`);
        const data: ArticleResponse = await response.json();

        if (data.success) {
          setArticle(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch article");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-muted-foreground">{error || "Article not found"}</p>
        <Button variant="outline" onClick={onBack} className="border-white/20 hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 text-muted-foreground hover:text-white hover:bg-white/5"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Articles
      </Button>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
        {article.featuredImage && (
          <div className="w-full aspect-video relative overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            {article.category && (
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
                {article.category.name}
              </span>
            )}
            {article.publishedAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar size={12} />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">{article.title}</h1>

          {article.author && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <span>By {article.author.name}</span>
              {article.sourceName && (
                <>
                  <span>•</span>
                  <span>{article.sourceName}</span>
                </>
              )}
            </div>
          )}

          {article.aiSummary && (
            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold mb-2 text-primary">Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{article.aiSummary}</p>
            </div>
          )}

          {article.summaryPoints && article.summaryPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-primary">Key Points</h3>
              <ul className="space-y-2">
                {article.summaryPoints.map((point, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.sourceUrl && (
            <div className="pt-4 border-t border-white/10">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={14} />
                Read original article
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
