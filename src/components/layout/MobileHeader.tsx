'use client';

import React from 'react';
import { Menu, Plus } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import NotificationsIcon from '@/components/features/NotificationsIcon';

interface MobileHeaderProps {
  onOpenPost: () => void;
  onMenu: () => void;
  isLoaded: boolean;
}

export default function MobileHeader({ onOpenPost, onMenu, isLoaded }: MobileHeaderProps) {
  return (
    <header className={[
      "md:hidden sticky top-0 z-30",
      "bg-surface-1/80 backdrop-blur supports-[backdrop-filter]:bg-surface-1/60",
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
          <Menu className="w-5 h-5 text-zinc-300" />
        </button>
        <Logo />
        <div className="flex items-center space-x-2">
          <NotificationsIcon className="text-zinc-300" />
          <button
            onClick={onOpenPost}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary transition ring-1 ring-inset ring-primary/30 hover:ring-primary/40"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Post</span>
          </button>
        </div>
      </div>
    </header>
  );
}
