'use client';

import React from 'react';
import { ExternalLink, Trophy, Target, Zap, Globe } from 'lucide-react';

interface FixturesCardProps {
  // Remove all the old props since we're not using API data anymore
}

export default function FixturesCard({}: FixturesCardProps) {
  const sportsLinks = [
    {
      name: 'Football',
      icon: '⚽',
      url: 'https://www.livescore.com/en/football/',
      description: 'Live scores & fixtures',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Tennis',
      icon: '🎾',
      url: 'https://www.atptour.com/en/scores/current',
      description: 'ATP & WTA scores',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Golf',
      icon: '⛳',
      url: 'https://www.pgatour.com/leaderboard.html',
      description: 'PGA Tour leaderboard',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      url: 'https://www.nba.com/scores',
      description: 'NBA live scores',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Baseball',
      icon: '⚾',
      url: 'https://www.mlb.com/scores',
      description: 'MLB scores & standings',
      color: 'from-red-500 to-pink-600'
    },
    {
      name: 'Hockey',
      icon: '🏒',
      url: 'https://www.nhl.com/scores',
      description: 'NHL live scores',
      color: 'from-slate-500 to-gray-600'
    }
  ];

  const handleSportClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-xl bg-white/[0.03] ring-1 ring-white/5 overflow-hidden flex flex-col max-h-80">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-slate-300" />
          <h3 className="text-slate-100 font-semibold tracking-tight">Live Sports</h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto flex-1">
        <p className="text-sm text-slate-300 mb-4">
          Get live scores, fixtures, and results from official sports websites
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {sportsLinks.map((sport) => (
            <button
              key={sport.name}
              onClick={() => handleSportClick(sport.url)}
              className="group relative p-3 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{sport.icon}</div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-bold text-white">
                    {sport.name}
                  </div>
                  <div className="text-xs text-slate-100">
                    {sport.description}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white flex-shrink-0" />
              </div>
              
              {/* Sport color indicator - visible by default */}
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${sport.color} opacity-5 group-hover:opacity-15 transition-opacity duration-200`}></div>
              
              {/* Colored left border accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${sport.color} opacity-60`}></div>
              
              {/* Enhanced hover effect */}
              <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          ))}
        </div>
        
        <div className="pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-3 h-3" />
            <span>Powered by official sports websites</span>
          </div>
        </div>
      </div>
    </section>
  );
}
