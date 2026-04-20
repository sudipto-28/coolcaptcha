import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { Article } from "./article-data";

interface ArticleCardProps {
  article: Article;
  index: number;
}

export const ArticleCard = ({ article, index }: ArticleCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    className="group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-primary/40 transition-all cursor-pointer"
  >
    <div className={`w-full aspect-video bg-gradient-to-br ${article.color} flex items-center justify-center relative overflow-hidden`}>
      <div className="absolute top-3 left-3">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-black/40 backdrop-blur text-white/80">
          <span className={`w-1.5 h-1.5 rounded-full ${article.dot}`} />
          {article.category}
        </span>
      </div>
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <ExternalLink className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Clock size={10} />
        {article.readTime}
      </div>
    </div>
  </motion.div>
);
