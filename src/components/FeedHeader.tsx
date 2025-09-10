'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FeedHeaderProps {
  isLoaded: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  selected?: string;
}

export default function FeedHeader({ isLoaded, query, onQueryChange, selected }: FeedHeaderProps) {
  return (
    <div className={[
      "flex items-center justify-between px-4 md:px-6 py-4 md:py-6",
      "border-b border-white/5 sticky top-0 z-20",
      "bg-[#0B1426]/80 backdrop-blur"
    ].join(' ')}
    >
      <div className={[
        "flex items-center gap-3",
        "transition duration-700",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      ].join(' ')}
      >
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-slate-100">
          {selected === 'top-articles' ? 'Trending Tips' : 'Tip Feed'}
        </h1>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {selected === 'top-articles'
            ? 'Most viewed tips on the platform'
            : 'Share your sports tips and analysis'
          }
        </span>
      </div>
      <div className={[
        "hidden md:flex items-center gap-2",
        "transition duration-700 delay-150",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      ].join(' ')}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search sports discussions..."
            aria-label="Search sports discussions"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
            className="w-64 bg-white/5 border border-white/10 focus:border-sky-500/40 outline-none rounded-lg px-9 py-2 text-sm placeholder:text-slate-500 focus:ring-4 focus:ring-sky-500/10 transition"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 transition ring-1 ring-white/10">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>
      </div>
    </div>
  );
}
