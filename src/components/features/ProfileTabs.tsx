'use client';

import React from 'react';
import { MessageCircle, Heart, Users, Trophy, BarChart3 } from 'lucide-react';

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
            icon: Heart,
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
        <div className="border-b border-slate-700/50 mb-6">
            <nav className="flex space-x-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${isActive
                                ? 'border-amber-500 text-amber-400'
                                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`px-2 py-1 rounded-full text-xs ${isActive
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-slate-700 text-slate-400'
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
