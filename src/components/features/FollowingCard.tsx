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
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col h-80">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
        <Users className="w-4 h-4 text-slate-300" />
        <h3 className="text-slate-100 font-semibold tracking-tight">Following</h3>
      </div>
      <div className="divide-y divide-white/5 overflow-y-auto flex-1 min-h-0">
        {loading ? (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            Loading following...
          </div>
        ) : list.length > 0 ? (
          list.slice(0, 8).map((user) => (
            <div key={user.id} className="px-4 py-3 flex items-center gap-3">
              <AvatarWithFallback
                src={user.avatar}
                alt={user.name || user.handle || 'User'}
                name={user.name || user.handle || 'User'}
                size={36}
                className="ring-1 ring-white/10 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {onNavigateToProfile ? (
                    <UserProfileLink
                      user={user}
                      onNavigateToProfile={onNavigateToProfile}
                      className="text-sm text-slate-200 truncate hover:text-blue-400"
                    >
                      {user.name || user.handle || 'Anonymous User'}
                    </UserProfileLink>
                  ) : (
                    <span className="text-sm text-slate-200 truncate">
                      {user.name || user.handle || 'Anonymous User'}
                    </span>
                  )}
                  {user.handle && user.name !== user.handle && (
                    <span className="text-xs text-slate-500 truncate">{user.handle}</span>
                  )}
                </div>
                <div className="text-xs text-emerald-300/90">{user.followersCount || 0} followers</div>
              </div>
              <button
                onClick={() => onToggle(user.id)}
                className="text-xs rounded-md px-2.5 py-1.5 transition ring-1 flex-shrink-0 bg-red-500/20 text-red-300 ring-red-500/30 hover:bg-red-500/30 hover:text-red-200"
                title="Unfollow user"
              >
                Unfollow
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            No users to follow yet
          </div>
        )}
        {list.length > 8 && (
          <div className="px-4 py-3 text-center text-slate-400 text-xs border-t border-white/5">
            +{list.length - 8} more
          </div>
        )}
      </div>
    </section>
  );
}