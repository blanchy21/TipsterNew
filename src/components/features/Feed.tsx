'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import FeedHeader from '@/components/layout/FeedHeader';
import AsyncErrorBoundary from '@/components/ui/AsyncErrorBoundary';
import { FeedLoadingState } from '@/components/ui/LoadingState';

interface FilterOptions {
  timeRange: string;
  tipStatus: string;
  engagement: string;
  userType: string;
  oddsRange: string;
  selectedTags: string[];
}

interface FeedProps {
  posts: Post[];
  isLoaded: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  selectedSport?: string;
  selected?: string;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
  onNavigateToProfile?: (userId: string) => void;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (postId: string, updatedPost: Post) => void;
  onFiltersChange?: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export default function Feed({ posts, isLoaded, query, onQueryChange, selectedSport, selected, onLikeChange, onNavigateToProfile, onPostDeleted, onPostUpdated, onFiltersChange, currentFilters }: FeedProps) {

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <FeedHeader
        isLoaded={isLoaded}
        query={query}
        onQueryChange={onQueryChange}
        selected={selected}
        onFiltersChange={onFiltersChange}
        currentFilters={currentFilters}
      />
      {query.trim() && (
        <div className="px-4 md:px-6 py-2 border-b border-white/10">
          <p className="text-sm text-slate-400">
            {posts.length === 0 ? 'No results found' : `${posts.length} result${posts.length === 1 ? '' : 's'} found`} for &quot;{query}&quot;
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 md:space-y-5">
        {!isLoaded ? (
          <FeedLoadingState />
        ) : (
          <AsyncErrorBoundary
            fallback={
              <div className="h-64 grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-red-500/20 ring-1 ring-red-500/30 grid place-items-center mb-3">
                    <Inbox className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-red-300 font-medium">Failed to load posts</p>
                  <p className="text-red-500 text-sm">Please try again or refresh the page.</p>
                </div>
              </div>
            }
          >
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className={[
                  "transition duration-700",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                  `delay-[${Math.min(idx * 60, 400)}ms]`
                ].join(' ')}
              >
                <PostCard
                  post={post}
                  onLikeChange={onLikeChange}
                  onNavigateToProfile={onNavigateToProfile}
                  onPostDeleted={onPostDeleted}
                  onPostUpdated={onPostUpdated}
                />
              </div>
            ))}
            {posts.length === 0 && (
              <div className="h-64 grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white/5 ring-1 ring-white/10 grid place-items-center mb-3">
                    <Inbox className="w-5 h-5 text-slate-400" />
                  </div>
                  {query.trim() ? (
                    <>
                      <p className="text-slate-300 font-medium">No results found for &quot;{query}&quot;</p>
                      <p className="text-slate-500 text-sm">Try different keywords or check your spelling.</p>
                    </>
                  ) : selectedSport && selectedSport !== 'All Sports' ? (
                    <>
                      <p className="text-slate-300 font-medium">No {selectedSport} tips found</p>
                      <p className="text-slate-500 text-sm">Try selecting a different sport or be the first to share a {selectedSport} tip.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-300 font-medium">No tips yet</p>
                      <p className="text-slate-500 text-sm">Be the first to share a tip.</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </AsyncErrorBoundary>
        )}
      </div>
    </main>
  );
}
