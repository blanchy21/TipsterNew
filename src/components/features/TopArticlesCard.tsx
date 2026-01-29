'use client';

import React from 'react';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Post } from '@/lib/types';

interface TopArticlesCardProps {
  articles: Post[];
}

export default function TopArticlesCard({ articles }: TopArticlesCardProps) {
  // Filter for pending tips only (including posts without tipStatus field for backward compatibility), then sort by engagement (likes + comments) in descending order and take top 3
  const topArticles = articles
    .filter(article => !article.tipStatus || article.tipStatus === 'pending')
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 3);

  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-60">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-medium text-zinc-300 tracking-tight">Trending Tips</h3>
      </div>
      <div className="divide-y divide-white/[0.04] overflow-y-auto flex-1">
        {topArticles.map((article, index) => (
          <div key={article.id} className="px-4 py-2.5 flex items-start gap-3 hover:bg-white/[0.04] transition-colors duration-150">
            <span className="text-xs font-medium text-zinc-500 mt-0.5 w-4 text-right shrink-0">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-zinc-200 line-clamp-2 mb-1 group-hover:text-white transition-colors">
                {article.title}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span>{article.user.name}</span>
                <span className="text-zinc-600">·</span>
                <Heart className="w-3 h-3" />
                <span>{article.likes.toLocaleString()}</span>
                <span className="text-zinc-600">·</span>
                <MessageCircle className="w-3 h-3" />
                <span>{article.comments.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        {topArticles.length === 0 && (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            No tips available yet
          </div>
        )}
      </div>
    </section>
  );
}
