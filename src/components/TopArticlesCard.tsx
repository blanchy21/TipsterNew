'use client';

import React from 'react';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { Post } from '@/lib/types';

interface TopArticlesCardProps {
  articles: Post[];
}

export default function TopArticlesCard({ articles }: TopArticlesCardProps) {
  // Sort articles by engagement (likes + comments) in descending order and take top 3
  const topArticles = articles
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 3);

  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-60">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <TrendingUp className="w-4 h-4 text-slate-300" />
        <h3 className="text-slate-100 font-semibold tracking-tight">Trending Tips</h3>
      </div>
      <div className="divide-y divide-white/5 overflow-y-auto flex-1">
        {topArticles.map((article, index) => (
          <div key={article.id} className="px-4 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 font-medium line-clamp-2 mb-1">
                {article.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{article.likes.toLocaleString()}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{article.comments.toLocaleString()}</span>
                </div>
                <span>•</span>
                <span>{article.sport}</span>
                <span>•</span>
                <span>{article.user.name}</span>
              </div>
            </div>
          </div>
        ))}
        {topArticles.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No tips available yet
          </div>
        )}
      </div>
    </section>
  );
}
