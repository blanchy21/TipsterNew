'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import FilterModal from '@/components/modals/FilterModal';

interface FilterOptions {
  timeRange: string;
  tipStatus: string;
  engagement: string;
  userType: string;
  oddsRange: string;
  selectedTags: string[];
}

interface FeedHeaderProps {
  isLoaded: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  selected?: string;
  onFiltersChange?: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export default function FeedHeader({ isLoaded, query, onQueryChange, selected, onFiltersChange, currentFilters }: FeedHeaderProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const defaultFilters: FilterOptions = {
    timeRange: 'all',
    tipStatus: 'all',
    engagement: 'all',
    userType: 'all',
    oddsRange: 'all',
    selectedTags: []
  };

  const activeFilters = currentFilters || defaultFilters;
  const hasActiveFilters = Object.values(activeFilters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== 'all'
  );
  return (
    <div className={[
      "flex items-center justify-between px-4 md:px-6 py-4 md:py-6",
      "border-b border-white/5 sticky top-0 z-20",
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900/80 backdrop-blur"
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
            className="w-64 bg-white/5 border border-white/10 focus:border-sky-500/40 outline-none rounded-lg px-9 py-2 pr-9 text-sm placeholder:text-slate-500 focus:ring-4 focus:ring-sky-500/10 transition"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="w-4 h-4 absolute right-3 top-2.5 text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 transition ring-1 ${hasActiveFilters
            ? 'bg-sky-500/20 text-sky-300 ring-sky-500/40 hover:bg-sky-500/30'
            : 'bg-white/5 hover:bg-white/10 ring-white/10'
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">
            Filters {hasActiveFilters && `(${Object.values(activeFilters).filter(v => Array.isArray(v) ? v.length > 0 : v !== 'all').length})`}
          </span>
        </button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={(filters) => {
          onFiltersChange?.(filters);
          setShowFilterModal(false);
        }}
        currentFilters={activeFilters}
      />
    </div>
  );
}
