'use client';

import React from 'react';
import { MessageCircle, UserCheck, Users, BarChart3 } from 'lucide-react';

interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    stats: {
        totalTips: number;
        followers: number;
        following: number;
    };
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, stats }) => {
    const tabs = [
        {
            id: 'tips',
            label: 'Tips',
            icon: MessageCircle,
            count: stats.totalTips
        },
        {
            id: 'followers',
            label: 'Followers',
            icon: Users,
            count: stats.followers
        },
        {
            id: 'following',
            label: 'Following',
            icon: UserCheck,
            count: stats.following
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            count: null
        }
    ];

    return (
        <div className="mb-6">
            <nav className="flex gap-1 p-1 bg-surface-2/30 rounded-xl border border-white/[0.04]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-surface-3/70 text-white shadow-sm border border-white/[0.06]'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-surface-3/30'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {tab.count !== null && (
                                <span className={`px-1.5 py-0.5 rounded-md text-xs tabular-nums ${isActive
                                    ? 'bg-accent/15 text-accent'
                                    : 'bg-surface-3/50 text-zinc-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default ProfileTabs;
