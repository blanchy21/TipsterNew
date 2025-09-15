'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Trophy,
    Award,
    Crown,
    Medal,
    Check,
    RefreshCw
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { LeaderboardEntry, getAllUsersWithStats, sortLeaderboard, getLeaderboardStats } from '@/lib/leaderboardUtils';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface TopTipstersProps {
    onNavigateToProfile?: (userId: string) => void;
}

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

    // Load real tipster data
    useEffect(() => {
        const loadTipsters = async () => {
            try {
                setLoading(true);
                const [tipstersData, statsData] = await Promise.all([
                    getAllUsersWithStats(),
                    getLeaderboardStats()
                ]);
                setTipsters(tipstersData);
                setStats(statsData);
            } catch (error) {
                // Console statement removed for production
            } finally {
                setLoading(false);
            }
        };

        loadTipsters();
    }, []);

    // Real-time listener for verification updates
    useEffect(() => {

        const unsubscribe = onSnapshot(
            query(collection(db, 'tipVerifications')),
            (snapshot) => {

                // Reload leaderboard when verifications change
                const loadTipsters = async () => {
                    try {
                        const [tipstersData, statsData] = await Promise.all([
                            getAllUsersWithStats(),
                            getLeaderboardStats()
                        ]);
                        setTipsters(tipstersData);
                        setStats(statsData);
                    } catch (error) {
                        // Console statement removed for production
                    }
                };
                loadTipsters();
            },
            (error) => {
                // Console statement removed for production
            }
        );

        return () => {

            unsubscribe();
        };
    }, []);

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
        try {
            setLoading(true);
            const [tipstersData, statsData] = await Promise.all([
                getAllUsersWithStats(),
                getLeaderboardStats()
            ]);
            setTipsters(tipstersData);
            setStats(statsData);
        } catch (error) {
            // Console statement removed for production
        } finally {
            setLoading(false);
        }
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
                <div className="text-center mb-12 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1.2s ease-out 0.3s forwards' }}>
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
                <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1s ease-out 0.6s forwards' }}>
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

                {/* Leaderboard */}
                <div className="space-y-4 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1s ease-out 0.9s forwards' }}>
                    {tipsters.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-slate-400 text-lg mb-2">No tipsters found</div>
                            <div className="text-slate-500 text-sm">Be the first to share a tip and appear on the leaderboard!</div>
                        </div>
                    ) : (
                        tipsters.map((tipster, index) => (
                            <div
                                key={tipster.id}
                                className={`p-6 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500 cursor-pointer group ${tipster.position <= 3 ? 'shadow-2xl' : 'shadow-xl'
                                    }`}
                                onClick={() => onNavigateToProfile?.(tipster.id)}
                                style={{ animation: `fadeInSlideUp 0.6s ease-out ${1.2 + index * 0.1}s forwards` }}
                            >
                                <div className="flex items-center gap-6">
                                    {/* Position */}
                                    <div className="flex-shrink-0">
                                        {getPositionIcon(tipster.position)}
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative">
                                        <Image
                                            src={normalizeImageUrl(tipster.avatar)}
                                            alt={tipster.name}
                                            width={64}
                                            height={64}
                                            className="rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"
                                        />
                                        {tipster.isVerified && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" style={{ strokeWidth: 3 }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-white truncate">{tipster.name}</h3>
                                            {tipster.isVerified && (
                                                <div className="p-1 bg-emerald-500/20 rounded-full">
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-neutral-400 text-sm mb-2">{tipster.handle}</p>

                                        {/* Specializations */}
                                        {tipster.specializations.length > 0 && (
                                            <div className="flex gap-2 mb-3">
                                                {tipster.specializations.slice(0, 2).map((spec, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30"
                                                    >
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-white">{tipster.winRate}%</div>
                                            <div className="text-xs text-neutral-400">Win Rate</div>
                                        </div>
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-white">{tipster.totalTips}</div>
                                            <div className="text-xs text-neutral-400">Total Tips</div>
                                        </div>
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-green-400">{tipster.totalWins}</div>
                                            <div className="text-xs text-neutral-400">Wins</div>
                                        </div>
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-red-400">{tipster.totalLosses}</div>
                                            <div className="text-xs text-neutral-400">Losses</div>
                                        </div>
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-yellow-400">{tipster.pendingTips}</div>
                                            <div className="text-xs text-neutral-400">Pending</div>
                                        </div>
                                        <div className="group-hover:scale-110 transition-transform duration-300">
                                            <div className="text-2xl font-bold text-white">{tipster.averageOdds.toFixed(2)}</div>
                                            <div className="text-xs text-neutral-400">Avg Odds</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default TopTipsters;
