'use client';

import React from 'react';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { User } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';
import AvatarWithFallback from '@/components/ui/AvatarWithFallback';
import UserProfileLink from '@/components/ui/UserProfileLink';

interface FollowingCardProps {
  list: User[];
  onToggle: (id: string) => void;
  onNavigateToProfile?: (userId: string) => void;
  loading?: boolean;
}

export default function FollowingCard({ list, onToggle, onNavigateToProfile, loading = false }: FollowingCardProps) {
  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-80">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <Users className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-medium text-zinc-300 tracking-tight">Following</h3>
        {list.length > 0 && (
          <span className="text-xs text-zinc-500">{list.length}</span>
        )}
      </div>
      <div className="divide-y divide-white/[0.04] overflow-y-auto flex-1 min-h-0">
        {loading ? (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            Loading...
          </div>
        ) : list.length > 0 ? (
          list.slice(0, 8).map((user) => (
            <div key={user.id} className="group px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.04] transition-colors duration-150">
              <AvatarWithFallback
                src={user.avatar}
                alt={user.name || user.handle || 'User'}
                name={user.name || user.handle || 'User'}
                size={32}
                className="ring-1 ring-white/10 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                {onNavigateToProfile ? (
                  <UserProfileLink
                    user={user}
                    onNavigateToProfile={onNavigateToProfile}
                    className="text-sm text-zinc-200 truncate block hover:text-white transition-colors"
                  >
                    {user.name || user.handle || 'Anonymous User'}
                  </UserProfileLink>
                ) : (
                  <span className="text-sm text-zinc-200 truncate block">
                    {user.name || user.handle || 'Anonymous User'}
                  </span>
                )}
                <span className="text-xs text-zinc-500">
                  {user.handle && user.name !== user.handle ? `${user.handle} · ` : ''}{user.followersCount || 0} followers
                </span>
              </div>
              <button
                onClick={() => onToggle(user.id)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Unfollow user"
              >
                Unfollow
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-zinc-500 text-sm">
            Not following anyone yet
          </div>
        )}
        {list.length > 8 && (
          <div className="px-4 py-2.5 text-center text-zinc-500 text-xs">
            +{list.length - 8} more
          </div>
        )}
      </div>
    </section>
  );
}