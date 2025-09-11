'use client';

import React from 'react';
import { Fixture, Post } from '@/lib/types';
import FixturesCard from './FixturesCard';
import FollowingCard from './FollowingCard';
import TopArticlesCard from './TopArticlesCard';
import { useFollowing } from '@/lib/contexts/FollowingContext';

interface RightSidebarProps {
  posts: Post[];
  isLoaded: boolean;
  onNavigateToProfile?: (userId: string) => void;
}

export default function RightSidebar({
  posts,
  isLoaded,
  onNavigateToProfile
}: RightSidebarProps) {
  const { following, suggestions, unfollowUser, loading } = useFollowing();

  const handleToggleFollow = async (userId: string) => {
    await unfollowUser(userId);
  };

  return (
    <aside className={[
      "hidden lg:flex lg:flex-col shrink-0",
      "px-4 py-4",
      "border-l border-white/5",
      "gap-6",
      "h-screen overflow-y-auto",
      "transition duration-700",
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    ].join(' ')}
      style={{ width: '340px' }}
    >
      <FixturesCard />
      <FollowingCard
        list={following}
        onToggle={handleToggleFollow}
        onNavigateToProfile={onNavigateToProfile}
        loading={loading}
      />
      <TopArticlesCard articles={posts} />
    </aside>
  );
}
