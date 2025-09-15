'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Crown, Medal, Award, TrendingUp, Target, Check } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/leaderboardUtils';
import { getTopTipsters } from '@/lib/leaderboardUtils';

interface TrendingCardProps {
  limit?: number;
  onNavigateToProfile?: (userId: string) => void;
}

export default function TrendingCard({ limit = 5, onNavigateToProfile }: TrendingCardProps) {
  const [tipsters, setTipsters] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopTipsters = async () => {
      try {
        setLoading(true);
        const topTipsters = await getTopTipsters(limit);
        setTipsters(topTipsters);
      } catch (error) {
        // Console statement removed for production
      } finally {
        setLoading(false);
      }
    };

    loadTopTipsters();
  }, [limit]);

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (position === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (position === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <span className="text-sm font-bold text-neutral-400">#{position}</span>;
  };

  if (loading) {
    return (
      <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-slate-300" />
          <h3 className="text-slate-100 font-semibold tracking-tight">Top Tipsters</h3>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-700 rounded"></div>
                <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-slate-300" />
        <h3 className="text-slate-100 font-semibold tracking-tight">Top Tipsters</h3>
      </div>
      <div className="divide-y divide-white/5">
        {tipsters.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <div className="text-slate-400 text-sm">No tipsters found</div>
          </div>
        ) : (
          tipsters.map((tipster) => (
            <div
              key={tipster.id}
              className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition cursor-pointer group"
              onClick={() => onNavigateToProfile?.(tipster.id)}
            >
              {/* Position */}
              <div className="flex-shrink-0">
                {getPositionIcon(tipster.position)}
              </div>

              {/* Avatar */}
              <div className="relative">
                <Image
                  src={tipster.avatar}
                  alt={tipster.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-white/20 group-hover:border-white/40 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/default-avatar.png';
                  }}
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
                {tipster.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border border-slate-900 flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" style={{ strokeWidth: 3 }} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <div className="text-sm text-slate-200 truncate font-medium">{tipster.name}</div>
                  {tipster.isVerified && (
                    <div className="p-0.5 bg-emerald-500/20 rounded-full">
                      <Check className="w-2 h-2 text-emerald-400" />
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 truncate">{tipster.handle}</div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-right">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">{tipster.winRate}%</div>
                  <div className="text-xs text-slate-500">Win Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">{tipster.averageOdds.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">Avg Odds</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200">{tipster.totalTips}</div>
                  <div className="text-xs text-slate-500">Tips</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {tipsters.length > 0 && (
        <div className="px-4 py-3 border-t border-white/5">
          <button
            className="w-full text-xs text-slate-400 hover:text-slate-300 transition-colors"
            onClick={() => onNavigateToProfile?.('leaderboard')}
          >
            View Full Leaderboard →
          </button>
        </div>
      )}
    </section>
  );
}
