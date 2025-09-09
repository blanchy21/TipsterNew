'use client';

import React from 'react';
import { Flame } from 'lucide-react';
import { TrendingItem } from '@/lib/types';

interface TrendingCardProps {
  items: TrendingItem[];
}

export default function TrendingCard({ items }: TrendingCardProps) {
  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Flame className="w-4 h-4 text-slate-300" />
        <h3 className="text-slate-100 font-semibold tracking-tight">Trending Events</h3>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 truncate font-medium">{item.label}</div>
              <div className="text-xs text-slate-500">{item.volume.toLocaleString()} discussions</div>
            </div>
            <span className="text-xs text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-2 py-1 rounded-md">
              {item.delta}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
