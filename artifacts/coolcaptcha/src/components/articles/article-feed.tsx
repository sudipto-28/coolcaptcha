import React from "react";
import { Zap } from "lucide-react";
import { articles } from "./article-data";
import { ArticleCard } from "./article-card";

export const ArticleFeed = () => (
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

    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {articles.map((article, i) => (
        <ArticleCard key={i} article={article} index={i} />
      ))}
    </div>
  </div>
);
