'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Bell,
  Trophy,
  MessageCircle,
  Mail,
  User,
  Star,
  PlusCircle,
  ExternalLink,
  LogOut,
  Users,
  Target
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SidebarItem from '@/components/layout/SidebarItem';
import SportsSubmenu from '@/components/features/SportsSubmenu';
import { SidebarItem as SidebarItemType } from '@/lib/types';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import { useAuth } from '@/lib/hooks/useAuth';

interface SidebarProps {
  selected: string;
  onSelect: (key: string) => void;
  onOpenPost: () => void;
  isLoaded: boolean;
  selectedSport: string;
  onSportSelect: (sport: string) => void;
  onShowLandingPage?: () => void;
  onShowAuthModal?: (mode: 'login' | 'signup') => void;
}

const items: SidebarItemType[] = [
  { icon: Home, label: 'Home', key: 'home' },
  { icon: Bell, label: 'Notifications', key: 'notifications' },
  { icon: Star, label: 'Trending Tips', key: 'top-articles' },
  { icon: Trophy, label: 'Top Tipsters', key: 'top-tipsters' },
  { icon: Users, label: 'People', key: 'following' },
  { icon: MessageCircle, label: 'Chat', key: 'chat' },
  { icon: Mail, label: 'Messages', key: 'messages' },
  { icon: User, label: 'Profile', key: 'profile' },
  { icon: Target, label: 'Sports', key: 'sports' },
];

export default function Sidebar({ selected, onSelect, onOpenPost, isLoaded, selectedSport, onSportSelect, onShowLandingPage, onShowAuthModal }: SidebarProps) {
  const [showSportsSubmenu, setShowSportsSubmenu] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setShowSportsSubmenu(false);
      }
    };

    if (showSportsSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSportsSubmenu]);

  return (
    <aside className={[
      "hidden md:flex md:flex-col shrink-0",
      "border-r border-white/[0.04]",
      "bg-surface-1/50 backdrop-blur-sm",
      "px-3 py-4",
      "h-screen overflow-y-auto scrollbar-thin",
      "transition-all duration-700",
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    ].join(' ')}
      style={{ width: '240px' }}
    >
      <div className="px-2 mb-6">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-col gap-px">
        {items.map((item, idx) => (
          <div
            key={item.key}
            className={[
              "transition duration-700",
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
              `delay-[${idx * 40}ms]`,
              item.key === 'sports' ? 'relative' : ''
            ].join(' ')}
          >
            <SidebarItem
              icon={item.icon}
              label={item.key === 'sports' && selectedSport !== 'All Sports' ? `${item.label} (${selectedSport})` : item.label}
              active={selected === item.key}
              badge={item.key === 'notifications' ? unreadCount : undefined}
              onClick={() => {
                if (item.key === 'sports') {
                  setShowSportsSubmenu(!showSportsSubmenu);
                } else {
                  onSelect(item.key);
                }
              }}
            />
            {item.key === 'sports' && (
              <div ref={submenuRef} className="relative" style={{ position: 'relative', zIndex: 9999 }}>
                <SportsSubmenu
                  isOpen={showSportsSubmenu}
                  selectedSport={selectedSport}
                  onSportSelect={onSportSelect}
                  onClose={() => setShowSportsSubmenu(false)}
                />
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col gap-2">
        <button
          onClick={onOpenPost}
          className="w-full btn-primary-glow inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm"
          title="Share a Tip"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="font-semibold">Share a Tip</span>
        </button>

        <div className="flex items-center gap-1">
          {onShowLandingPage && (
            <button
              onClick={onShowLandingPage}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              title="View Landing Page"
            >
              <ExternalLink className="w-3 h-3" />
              <span>About</span>
            </button>
          )}

          <button
            onClick={signOut}
            className={`${onShowLandingPage ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors`}
            title="Sign Out"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
