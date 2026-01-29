'use client';

import React from 'react';
import { ExternalLink, Trophy } from 'lucide-react';

export default function FixturesCard() {
  const sportsLinks = [
    {
      name: 'Football',
      url: 'https://www.livescore.com/en/football/',
      source: 'LiveScore',
    },
    {
      name: 'Tennis',
      url: 'https://www.atptour.com/en/scores/current',
      source: 'ATP Tour',
    },
    {
      name: 'Golf',
      url: 'https://www.pgatour.com/leaderboard.html',
      source: 'PGA Tour',
    },
    {
      name: 'Basketball',
      url: 'https://www.nba.com/scores',
      source: 'NBA',
    },
    {
      name: 'Baseball',
      url: 'https://www.mlb.com/scores',
      source: 'MLB',
    },
    {
      name: 'Hockey',
      url: 'https://www.nhl.com/scores',
      source: 'NHL',
    },
  ];

  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-medium text-zinc-300 tracking-tight">Live Scores</h3>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {sportsLinks.map((sport) => (
          <a
            key={sport.name}
            href={sport.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.04] transition-colors duration-150"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                {sport.name}
              </span>
              <span className="text-xs text-zinc-500">
                {sport.source}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </section>
  );
}
