'use client';

import React from 'react';
import {
    Trophy,
    Award,
    TrendingUp,
    Target,
    CheckCircle,
    Clock
} from 'lucide-react';

interface ProfileStatsProps {
    stats: {
        totalTips: number;
        totalWins: number;
        winRate: number;
        averageOdds: number;
        verifiedTips: number;
        pendingTips: number;
        followers: number;
        following: number;
        leaderboardPosition: number;
    };
    loading: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-surface-2/40 rounded-xl p-5 animate-pulse border border-white/[0.04]">
                            <div className="h-3 bg-surface-3/60 rounded w-2/3 mb-3" />
                            <div className="h-8 bg-surface-3/60 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Tips',
            value: stats.totalTips.toString(),
            icon: Target,
            accent: 'text-accent',
            glow: 'bg-accent/[0.08]',
            border: 'border-accent/[0.12]',
        },
        {
            label: 'Win Rate',
            value: `${stats.winRate.toFixed(1)}%`,
            icon: TrendingUp,
            accent: 'text-emerald-400',
            glow: 'bg-emerald-500/[0.08]',
            border: 'border-emerald-500/[0.12]',
        },
        {
            label: 'Total Wins',
            value: stats.totalWins.toString(),
            icon: Trophy,
            accent: 'text-amber-400',
            glow: 'bg-amber-500/[0.08]',
            border: 'border-amber-500/[0.12]',
        },
        {
            label: 'Avg Odds',
            value: stats.averageOdds.toFixed(2),
            icon: Award,
            accent: 'text-violet-400',
            glow: 'bg-violet-500/[0.08]',
            border: 'border-violet-500/[0.12]',
        },
    ];

    const secondaryStats = [
        { label: 'Verified', value: stats.verifiedTips, icon: CheckCircle, color: 'text-emerald-400' },
        { label: 'Pending', value: stats.pendingTips, icon: Clock, color: 'text-orange-400' },
    ];

    return (
        <div className="mb-8 space-y-4">
            {/* Primary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className={`${stat.glow} ${stat.border} border rounded-xl p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className={`w-4 h-4 ${stat.accent} opacity-70`} />
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                            <div className={`text-3xl font-display italic ${stat.accent}`}>
                                {stat.value}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Secondary stats row */}
            <div className="flex items-center gap-4">
                {secondaryStats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="flex items-center gap-2 text-sm">
                            <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                            <span className="text-zinc-400">
                                <span className="text-white font-medium">{stat.value}</span> {stat.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Leaderboard position */}
            {stats.leaderboardPosition > 0 && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-accent/[0.06] border border-accent/[0.12] rounded-xl">
                    <Trophy className="w-4.5 h-4.5 text-accent" />
                    <span className="text-sm">
                        <span className="text-accent font-semibold">#{stats.leaderboardPosition}</span>
                        <span className="text-zinc-400 ml-1.5">on the leaderboard</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProfileStats;
