'use client';

import { useMemo } from 'react';
import { Post } from '@/lib/types';

interface Filters {
  timeRange: string;
  tipStatus: string;
  engagement: string;
  userType: string;
  oddsRange: string;
  selectedTags: string[];
}

export function useFilteredPosts(
  posts: Post[],
  selected: string,
  selectedSport: string,
  debouncedQuery: string,
  filters: Filters
) {
  return useMemo(() => {
    let filtered = posts;

    if (selected === 'top') {
      filtered = filtered.filter(post => post.likes >= 20);
    } else if (selected === 'top-articles') {
      // Only show pending (unplayed) tips — verified results disappear
      filtered = filtered.filter(post => !post.tipStatus || post.tipStatus === 'pending');
      filtered = filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
    }

    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter((post: Post) => post.sport === selectedSport);
    }

    if (debouncedQuery.trim()) {
      const searchQuery = debouncedQuery.toLowerCase();
      filtered = filtered.filter((post: Post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery) ||
        post.sport.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        post.user.name.toLowerCase().includes(searchQuery) ||
        post.user.handle.toLowerCase().includes(searchQuery)
      );
    }

    if (filters.timeRange !== 'all') {
      const now = new Date();
      const postDate = (post: Post) => new Date(post.createdAt);

      switch (filters.timeRange) {
        case 'today':
          filtered = filtered.filter(post => postDate(post).toDateString() === now.toDateString());
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(post => postDate(post) >= weekAgo);
          break;
        case 'month':
        case '30days':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(post => postDate(post) >= monthAgo);
          break;
      }
    }

    if (filters.tipStatus !== 'all') {
      filtered = filtered.filter(post => {
        if (filters.tipStatus === 'verified') {
          return post.tipStatus && post.tipStatus !== 'pending';
        }
        return post.tipStatus === filters.tipStatus;
      });
    }

    if (filters.userType !== 'all') {
      filtered = filtered.filter(post => {
        switch (filters.userType) {
          case 'verified':
            return post.user.isVerified === true;
          case 'following':
            return true;
          case 'highWinRate':
            return true;
          case 'new':
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return post.user.memberSince && new Date(post.user.memberSince) >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    if (filters.oddsRange !== 'all') {
      filtered = filtered.filter(post => {
        if (!post.odds) return false;
        const oddsValue = parseFloat(post.odds);
        if (isNaN(oddsValue)) return false;

        switch (filters.oddsRange) {
          case 'low':
            return oddsValue >= 1.1 && oddsValue <= 2.0;
          case 'medium':
            return oddsValue > 2.0 && oddsValue <= 5.0;
          case 'high':
            return oddsValue > 5.0;
          default:
            return true;
        }
      });
    }

    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        filters.selectedTags.some(tag =>
          post.tags.some(postTag =>
            postTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    if (filters.engagement !== 'all') {
      switch (filters.engagement) {
        case 'likes':
          filtered = filtered.sort((a, b) => b.likes - a.likes);
          break;
        case 'comments':
          filtered = filtered.sort((a, b) => b.comments - a.comments);
          break;
        case 'views':
          filtered = filtered.sort((a, b) => b.views - a.views);
          break;
        case 'trending':
          filtered = filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
          break;
      }
    }

    return filtered;
  }, [posts, selected, selectedSport, debouncedQuery, filters]);
}
