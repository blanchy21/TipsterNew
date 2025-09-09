'use client';

import React from 'react';
import { Menu, Plus } from 'lucide-react';
import Logo from './Logo';
import NotificationsIcon from './NotificationsIcon';

interface MobileHeaderProps {
  onOpenPost: () => void;
  onMenu: () => void;
  isLoaded: boolean;
}

export default function MobileHeader({ onOpenPost, onMenu, isLoaded }: MobileHeaderProps) {
  return (
    <header className={[
        "md:hidden sticky top-0 z-30",
        "bg-[#0B0F14]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0B0F14]/60",
        "border-b border-white/5"
      ].join(' ')}
    >
      <div className={[
          "flex items-center justify-between px-3 py-3",
          "transition duration-700",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        ].join(' ')}
      >
        <button 
          onClick={onMenu} 
          className="p-2 rounded-lg hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
        >
          <Menu className="w-5 h-5 text-slate-300" />
        </button>
        <Logo collapsed />
        <div className="flex items-center space-x-2">
          <NotificationsIcon className="text-slate-300" />
          <button
            onClick={onOpenPost}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 transition ring-1 ring-inset ring-sky-500/30 hover:ring-sky-500/40"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Post</span>
          </button>
        </div>
      </div>
    </header>
  );
}
