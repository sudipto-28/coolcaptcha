import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import { ApiArticle, Article } from "./article-data";

interface ArticleCardProps {
  article: ApiArticle | Article;
  index: number;
  onClick?: (article: ApiArticle) => void;
}

// Helper function to get category color based on category name
function getCategoryColor(categoryName?: string): { color: string; dot: string } {
  const colors: Record<string, { color: string; dot: string }> = {
    "Technology": { color: "from-blue-500/20 to-cyan-500/10", dot: "bg-blue-400" },
    "Finance": { color: "from-emerald-500/20 to-green-500/10", dot: "bg-emerald-400" },
    "Security": { color: "from-violet-500/20 to-purple-500/10", dot: "bg-violet-400" },
    "Engineering": { color: "from-orange-500/20 to-amber-500/10", dot: "bg-orange-400" },
    "Sports": { color: "from-rose-500/20 to-red-500/10", dot: "bg-rose-400" },
    "Business": { color: "from-sky-500/20 to-blue-500/10", dot: "bg-sky-400" },
  };
  return colors[categoryName || ""] || { color: "from-gray-500/20 to-slate-500/10", dot: "bg-gray-400" };
}

// Helper function to check if article is from API
function isApiArticle(article: ApiArticle | Article): article is ApiArticle {
  return "slug" in article;
}

export const ArticleCard = ({ article, index, onClick }: ArticleCardProps) => {
  const isApi = isApiArticle(article);
  const category = isApi ? article.category?.name : article.category;
  const title = article.title;
  const excerpt = isApi ? article.aiSummary || article.summaryPoints?.join(". ") : article.excerpt;
  const { color, dot } = getCategoryColor(category);
  const publishedAt = isApi && article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : null;
  const readTime = isApi ? undefined : article.readTime;

  const handleClick = () => {
    if (isApi && onClick) {
      onClick(article);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all cursor-pointer"
      onClick={handleClick}
    >
      <div className={`w-full aspect-video bg-gradient-to-br ${color} flex items-center justify-center relative overflow-hidden`}>
        {isApi && article.featuredImage ? (
          <img src={article.featuredImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-black/40 backdrop-blur text-white/80">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {category}
              </span>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {excerpt}
        </p>
        <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
          {publishedAt ? (
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              {publishedAt}
            </div>
          ) : readTime ? (
            <div className="flex items-center gap-1">
              <Clock size={10} />
              {readTime}
            </div>
          ) : null}
          {isApi && article.sourceName && (
            <span className="text-muted-foreground/60">{article.sourceName}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
