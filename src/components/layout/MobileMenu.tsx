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
    Target,
    X
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import SidebarItem from '@/components/layout/SidebarItem';
import SportsSubmenu from '@/components/features/SportsSubmenu';
import { SidebarItem as SidebarItemType } from '@/lib/types';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import { useAuth } from '@/lib/hooks/useAuth';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    selected: string;
    onSelect: (key: string) => void;
    onOpenPost: () => void;
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

export default function MobileMenu({
    isOpen,
    onClose,
    selected,
    onSelect,
    onOpenPost,
    selectedSport,
    onSportSelect,
    onShowLandingPage,
    onShowAuthModal
}: MobileMenuProps) {
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

    // Close mobile menu when selecting an item
    const handleItemSelect = (key: string) => {
        if (key === 'sports') {
            setShowSportsSubmenu(!showSportsSubmenu);
        } else {
            onSelect(key);
            onClose();
        }
    };

    // Close mobile menu when opening post
    const handleOpenPost = () => {
        onOpenPost();
        onClose();
    };

    // Close mobile menu when showing landing page
    const handleShowLandingPage = () => {
        if (onShowLandingPage) {
            onShowLandingPage();
            onClose();
        }
    };

    // Close mobile menu when showing auth modal
    const handleShowAuthModal = (mode: 'login' | 'signup') => {
        if (onShowAuthModal) {
            onShowAuthModal(mode);
            onClose();
        }
    };

    // Close mobile menu when signing out
    const handleSignOut = () => {
        signOut();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={onClose}
            />

            {/* Mobile Menu */}
            <div className="fixed inset-y-0 left-0 w-80 max-w-[90vw] sm:max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
                        <Logo />
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 flex flex-col gap-1 p-3 sm:p-4 overflow-y-auto">
                        {items.map((item, idx) => (
                            <div
                                key={item.key}
                                className="transition duration-300"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <SidebarItem
                                    icon={item.icon}
                                    label={item.key === 'sports' && selectedSport !== 'All Sports' ? `${item.label} (${selectedSport})` : item.label}
                                    active={selected === item.key}
                                    badge={item.key === 'notifications' ? unreadCount : undefined}
                                    onClick={() => handleItemSelect(item.key)}
                                />
                                {item.key === 'sports' && (
                                    <div ref={submenuRef} className="relative" style={{ position: 'relative', zIndex: 9999 }}>
                                        <SportsSubmenu
                                            isOpen={showSportsSubmenu}
                                            selectedSport={selectedSport}
                                            onSportSelect={(sport) => {
                                                onSportSelect(sport);
                                                onClose();
                                            }}
                                            onClose={() => setShowSportsSubmenu(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
                        <button
                            onClick={handleOpenPost}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 hover:text-sky-200 transition ring-1 ring-inset ring-sky-500/30 hover:ring-sky-500/40"
                            title="Share a Tip"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span className="font-medium">Share a Tip</span>
                        </button>

                        {onShowLandingPage && (
                            <button
                                onClick={handleShowLandingPage}
                                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 hover:from-emerald-500/30 hover:to-blue-500/30 hover:text-emerald-200 transition ring-1 ring-inset ring-emerald-500/30 hover:ring-emerald-500/40"
                                title="View Landing Page"
                            >
                                <ExternalLink className="w-5 h-5" />
                                <span className="font-medium">About Tipster Arena</span>
                            </button>
                        )}

                        <button
                            onClick={handleSignOut}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 transition ring-1 ring-inset ring-red-500/30 hover:ring-red-500/40"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
