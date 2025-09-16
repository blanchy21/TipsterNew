'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
    Trophy,
    Award,
    Crown,
    Medal,
    Check,
    RefreshCw
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { LeaderboardEntry, sortLeaderboard } from '@/lib/leaderboardUtils';

interface TopTipstersProps {
    onNavigateToProfile?: (userId: string) => void;
}

// Lazy load the Firebase-dependent components
const LazyLeaderboardData = React.lazy(() =>
    import('@/components/features/TopTipstersData').catch((error) => {
        console.error('Failed to load TopTipstersData:', error);
        return {
            default: () => <div className="text-center py-12 text-red-400">Error loading leaderboard data</div>
        };
    })
);

const TopTipsters: React.FC<TopTipstersProps> = ({ onNavigateToProfile }) => {
    const [tipsters, setTipsters] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'winRate' | 'totalTips' | 'averageOdds' | 'totalWins' | 'totalLosses' | 'pendingTips'>('winRate');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTips: 0,
        totalWins: 0,
        totalLosses: 0,
        totalPending: 0,
        averageWinRate: 0,
        averageOdds: 0
    });

    const getPositionIcon = (position: number) => {
        if (position === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (position === 3) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="text-2xl font-bold text-neutral-400">#{position}</span>;
    };

    const sortTipsters = (newSortBy: 'winRate' | 'totalTips' | 'averageOdds' | 'totalWins' | 'totalLosses' | 'pendingTips') => {
        setSortBy(newSortBy);
        const sorted = sortLeaderboard(tipsters, newSortBy);
        setTipsters(sorted);
    };

    const refreshData = async () => {
        setLoading(true);
        // This will be handled by the lazy component
        setTimeout(() => setLoading(false), 1000);
    };

    if (loading) {
        return (
            <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-neutral-400">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-full">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl shadow-2xl">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Top Tipsters</h1>
                        <button
                            onClick={refreshData}
                            disabled={loading}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-6">
                        Discover the best tipsters on Tipster Arena. Ranked by performance, consistency, and expertise.
                    </p>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                            <div className="text-sm text-neutral-400">Active Tipsters</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-white">{stats.totalTips.toLocaleString()}</div>
                            <div className="text-sm text-neutral-400">Total Tips</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-green-400">{stats.totalWins.toLocaleString()}</div>
                            <div className="text-sm text-neutral-400">Total Wins</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-red-400">{stats.totalLosses.toLocaleString()}</div>
                            <div className="text-sm text-neutral-400">Total Losses</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-yellow-400">{stats.totalPending.toLocaleString()}</div>
                            <div className="text-sm text-neutral-400">Pending Tips</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-2xl font-bold text-white">{stats.averageWinRate}%</div>
                            <div className="text-sm text-neutral-400">Avg Win Rate</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => sortTipsters('winRate')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'winRate'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Win Rate
                        </button>
                        <button
                            onClick={() => sortTipsters('totalTips')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'totalTips'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Total Tips
                        </button>
                        <button
                            onClick={() => sortTipsters('totalWins')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'totalWins'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Total Wins
                        </button>
                        <button
                            onClick={() => sortTipsters('averageOdds')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'averageOdds'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Avg Odds
                        </button>
                        <button
                            onClick={() => sortTipsters('totalLosses')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'totalLosses'
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Total Losses
                        </button>
                        <button
                            onClick={() => sortTipsters('pendingTips')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'pendingTips'
                                ? 'bg-yellow-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Pending Tips
                        </button>
                    </div>
                </div>

                {/* Lazy loaded leaderboard data */}
                <Suspense fallback={
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 animate-pulse">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-6 bg-white/10 rounded mb-2"></div>
                                        <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        {[...Array(6)].map((_, j) => (
                                            <div key={j} className="text-center">
                                                <div className="h-6 bg-white/10 rounded mb-1"></div>
                                                <div className="h-3 bg-white/10 rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }>
                    <LazyLeaderboardData
                        onTipstersUpdate={setTipsters}
                        onStatsUpdate={setStats}
                        onNavigateToProfile={onNavigateToProfile}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default TopTipsters;
