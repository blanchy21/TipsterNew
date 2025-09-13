'use client';

import React from 'react';
import {
    Trophy,
    Award,
    TrendingUp,
    Users,
    Target,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
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
        winningStreak: number;
        leaderboardPosition: number;
    };
    loading: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Tips',
            value: stats.totalTips,
            icon: Target,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            label: 'Win Rate',
            value: `${stats.winRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20'
        },
        {
            label: 'Total Wins',
            value: stats.totalWins,
            icon: Trophy,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20'
        },
        {
            label: 'Avg Odds',
            value: stats.averageOdds.toFixed(2),
            icon: Award,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20'
        },
        {
            label: 'Verified Tips',
            value: stats.verifiedTips,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            label: 'Pending Tips',
            value: stats.pendingTips,
            icon: Clock,
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20'
        },
        {
            label: 'Followers',
            value: stats.followers,
            icon: Users,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/20'
        },
        {
            label: 'Winning Streak',
            value: stats.winningStreak,
            icon: TrendingUp,
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20'
        }
    ];

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 hover:scale-105 transition-transform`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                                <span className={`text-xs font-medium ${stat.color}`}>
                                    {stat.label}
                                </span>
                            </div>
                            <div className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leaderboard Position */}
            {stats.leaderboardPosition > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">
                            Ranked #{stats.leaderboardPosition} on the leaderboard
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileStats;
