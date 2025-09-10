'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SportsSubmenuProps {
  isOpen: boolean;
  selectedSport: string;
  onSportSelect: (sport: string) => void;
  onClose: () => void;
}

const sports = [
  'All Sports',
  'American Football',
  'Badminton',
  'Baseball',
  'Basketball',
  'Boxing',
  'Cricket',
  'Cycling',
  'Darts',
  'Esports',
  'Football',
  'Formula 1',
  'Golf',
  'Greyhound Racing',
  'Hockey',
  'Horse Racing',
  'MLB',
  'MMA',
  'MotoGP',
  'NBA',
  'NHL',
  'Rugby',
  'Snooker',
  'Table Tennis',
  'Tennis',
  'Volleyball'
];

export default function SportsSubmenu({ isOpen, selectedSport, onSportSelect, onClose }: SportsSubmenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 top-full mt-1 w-64 border border-white/40 rounded-lg shadow-2xl"
      style={{
        backgroundColor: '#000000',
        background: '#000000',
        opacity: 1,
        backdropFilter: 'none',
        position: 'absolute',
        isolation: 'isolate',
        zIndex: 99999,
        transform: 'translateZ(0)',
        willChange: 'transform',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}
    >
      <div
        className="p-3 rounded-lg"
        style={{
          backgroundColor: '#000000',
          background: '#000000',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/30 mb-2">
          <h3 className="text-sm font-semibold text-slate-100">Select Sport</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/20 transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div
          className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          style={{
            backgroundColor: '#000000',
            background: '#000000',
            position: 'relative',
            zIndex: 1
          }}
        >
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => {
                onSportSelect(sport);
                onClose();
              }}
              className={[
                "w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors",
                "hover:bg-white/20",
                selectedSport === sport
                  ? "bg-sky-500/50 text-sky-100 ring-1 ring-sky-500/60 font-medium"
                  : "text-slate-300 hover:text-slate-100"
              ].join(' ')}
              style={{
                backgroundColor: selectedSport === sport ? 'rgba(14, 165, 233, 0.8)' : '#000000',
                background: selectedSport === sport ? 'rgba(14, 165, 233, 0.8)' : '#000000'
              }}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
