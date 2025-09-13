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
      "border-r border-white/5",
      "backdrop-blur",
      "px-3 py-4",
      "h-screen overflow-y-auto",
      "transition-all duration-700",
      isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
    ].join(' ')}
      style={{ width: '260px' }}
    >
      <div className="px-1 mb-4">
        <Logo />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
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

      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
        <button
          onClick={onOpenPost}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 transition ring-1 ring-inset ring-sky-500/30 hover:ring-sky-500/40"
          title="Share a Tip"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Share a Tip</span>
        </button>

        {onShowLandingPage && (
          <button
            onClick={onShowLandingPage}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 hover:from-emerald-500/30 hover:to-blue-500/30 hover:text-emerald-200 transition ring-1 ring-inset ring-emerald-500/30 hover:ring-emerald-500/40"
            title="View Landing Page"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="font-medium">About Tipster Arena</span>
          </button>
        )}

        <button
          onClick={signOut}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition ring-1 ring-inset ring-red-500/30 hover:ring-red-500/40"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
