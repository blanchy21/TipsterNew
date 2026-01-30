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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
    <div className="border-b border-white/[0.04] sticky top-0 z-20 bg-surface-0/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        <div className={[
          "flex items-baseline gap-3",
          "transition duration-700",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        ].join(' ')}
        >
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            {selected === 'top-articles' ? 'Trending Tips' : 'Tip Feed'}
          </h1>
          <span className="text-xs text-zinc-500 hidden sm:inline">
            {selected === 'top-articles'
              ? 'Most viewed tips on the platform'
              : 'Share your sports tips and analysis'
            }
          </span>
        </div>

        {/* Mobile action buttons */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`p-2 rounded-lg transition-colors ${showMobileSearch || query ? 'text-primary bg-primary/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'}`}
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowFilterModal(true)}
            className={`p-2 rounded-lg transition-colors ${hasActiveFilters
              ? 'text-primary bg-primary/10'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop search and filters */}
        <div className={[
          "hidden md:flex items-center gap-2",
          "transition duration-700 delay-150",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        ].join(' ')}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions..."
              aria-label="Search sports discussions"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
              className="w-52 bg-white/[0.04] border border-white/[0.06] focus:border-white/15 outline-none rounded-lg px-8 py-1.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:ring-0 transition-colors"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-[7px] text-zinc-500" />
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="absolute right-2.5 top-[7px] text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${hasActiveFilters
              ? 'text-primary bg-primary/10 hover:bg-primary/15'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-medium">
              Filters{hasActiveFilters ? ` (${Object.values(activeFilters).filter(v => Array.isArray(v) ? v.length > 0 : v !== 'all').length})` : ''}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search bar (expandable) */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions..."
              aria-label="Search sports discussions"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQueryChange(e.target.value)}
              autoFocus
              className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-white/15 outline-none rounded-lg px-8 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:ring-0 transition-colors"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-[9px] text-zinc-500" />
            {query && (
              <button
                onClick={() => onQueryChange('')}
                className="absolute right-2.5 top-[9px] text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

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
