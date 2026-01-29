'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Trophy,
    Check,
    RefreshCw,
    ChevronUp,
    ChevronDown,
    Minus,
    TrendingUp,
    Target,
    Flame
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { LeaderboardEntry, getAllUsersWithStats, sortLeaderboard, getLeaderboardStats } from '@/lib/leaderboardUtils';
import { db } from '@/lib/firebase/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

interface TopTipstersProps {
    onNavigateToProfile?: (userId: string) => void;
}

type SortKey = 'winRate' | 'totalTips' | 'averageOdds' | 'totalWins' | 'totalLosses' | 'pendingTips';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'winRate', label: 'Win Rate' },
    { key: 'totalTips', label: 'Tips' },
    { key: 'totalWins', label: 'Wins' },
    { key: 'averageOdds', label: 'Avg Odds' },
];

const TopTipsters: React.FC<TopTipstersProps> = ({ onNavigateToProfile }) => {
    const [tipsters, setTipsters] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortKey>('winRate');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTips: 0,
        totalWins: 0,
        totalLosses: 0,
        totalPending: 0,
        averageWinRate: 0,
        averageOdds: 0
    });

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
                // silenced
            } finally {
                setLoading(false);
            }
        };
        loadTipsters();
    }, []);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        const setup = async () => {
            try {
                if (!db) return;
                unsubscribe = onSnapshot(
                    query(collection(db, 'tipVerifications')),
                    async () => {
                        try {
                            const [tipstersData, statsData] = await Promise.all([
                                getAllUsersWithStats(),
                                getLeaderboardStats()
                            ]);
                            setTipsters(tipstersData);
                            setStats(statsData);
                        } catch { }
                    },
                    () => { }
                );
            } catch { }
        };
        setup();
        return () => { unsubscribe?.(); };
    }, []);

    const handleSort = (key: SortKey) => {
        setSortBy(key);
        setTipsters(sortLeaderboard(tipsters, key));
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
        } catch { } finally {
            setLoading(false);
        }
    };

    // --- Skeleton loader ---
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-surface-0">
                <div className="max-w-3xl mx-auto px-4 py-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-surface-3 animate-pulse" />
                        <div className="h-7 w-40 rounded-lg bg-surface-3 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-1 border border-white/[0.04] animate-pulse">
                                <div className="w-5 h-5 rounded bg-surface-3" />
                                <div className="w-10 h-10 rounded-full bg-surface-3" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-28 rounded bg-surface-3" />
                                    <div className="h-3 w-20 rounded bg-surface-3" />
                                </div>
                                <div className="h-5 w-14 rounded-full bg-surface-3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const top3 = tipsters.slice(0, 3);
    const rest = tipsters.slice(3);
    // Reorder for podium: [2nd, 1st, 3rd]
    const podiumOrder = top3.length === 3 ? [top3[1], top3[0], top3[2]] : top3;

    return (
        <div className="w-full min-h-full bg-surface-0">
            <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-xl">
                            <Trophy className="w-5 h-5 text-accent" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Leaderboard</h1>
                    </div>
                    <button
                        onClick={refreshData}
                        disabled={loading}
                        className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors disabled:opacity-40"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Subtitle stats */}
                <p className="text-sm text-neutral-500 mb-8">
                    {stats.totalUsers} tipsters &middot; {stats.totalTips.toLocaleString()} tips &middot; {stats.averageWinRate}% avg win rate
                </p>

                {/* --- Podium: Top 3 --- */}
                {top3.length >= 3 && sortBy === 'winRate' && (
                    <div className="flex items-end justify-center gap-3 mb-10">
                        {podiumOrder.map((tipster, i) => {
                            const isFirst = i === 1; // center = #1
                            const rank = tipster.position;
                            const podiumHeight = isFirst ? 'pb-0' : 'pb-0';
                            const ringColor = rank === 1
                                ? 'ring-accent/60 ring-2'
                                : rank === 2
                                    ? 'ring-neutral-400/40 ring-2'
                                    : 'ring-amber-700/40 ring-2';
                            const avatarSize = isFirst ? 72 : 56;
                            const rankBg = rank === 1
                                ? 'bg-accent text-surface-0'
                                : rank === 2
                                    ? 'bg-neutral-400 text-surface-0'
                                    : 'bg-amber-700 text-white';

                            return (
                                <button
                                    key={tipster.id}
                                    onClick={() => onNavigateToProfile?.(tipster.id)}
                                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-105 ${isFirst ? 'order-2 -mt-4' : i === 0 ? 'order-1' : 'order-3'}`}
                                >
                                    <div className="relative">
                                        <Image
                                            src={normalizeImageUrl(tipster.avatar)}
                                            alt={tipster.name}
                                            width={avatarSize}
                                            height={avatarSize}
                                            className={`rounded-full ${ringColor} object-cover`}
                                            style={{ width: avatarSize, height: avatarSize }}
                                        />
                                        {/* Rank badge */}
                                        <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${rankBg}`}>
                                            {rank}
                                        </span>
                                        {tipster.isVerified && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-surface-0 flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-white" style={{ strokeWidth: 3 }} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-semibold text-white truncate max-w-[90px] ${isFirst ? 'text-sm' : 'text-xs'}`}>
                                            {tipster.name}
                                        </p>
                                        <p className={`font-bold text-accent ${isFirst ? 'text-lg' : 'text-sm'}`}>
                                            {tipster.winRate}%
                                        </p>
                                        <p className="text-[10px] text-neutral-500">
                                            {tipster.totalWins}W&ndash;{tipster.totalLosses}L
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Sort tabs */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-thin">
                    {SORT_OPTIONS.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => handleSort(opt.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${sortBy === opt.key
                                ? 'bg-accent/15 text-accent'
                                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* --- Leaderboard list --- */}
                {tipsters.length === 0 ? (
                    <div className="text-center py-16">
                        <Target className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                        <p className="text-neutral-400 text-sm mb-1">No tipsters yet</p>
                        <p className="text-neutral-600 text-xs">Be the first to post a tip and claim the top spot.</p>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {(sortBy === 'winRate' ? rest : tipsters).map((tipster) => (
                            <button
                                key={tipster.id}
                                onClick={() => onNavigateToProfile?.(tipster.id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-1/60 border border-white/[0.04] hover:bg-surface-2/60 hover:border-white/[0.08] transition-all group text-left"
                            >
                                {/* Rank */}
                                <span className="w-6 text-center text-xs font-semibold text-neutral-500 shrink-0">
                                    {tipster.position}
                                </span>

                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <Image
                                        src={normalizeImageUrl(tipster.avatar)}
                                        alt={tipster.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full border border-white/10 group-hover:border-white/20 transition-colors object-cover"
                                    />
                                    {tipster.isVerified && (
                                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[1.5px] border-surface-1 flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-white" style={{ strokeWidth: 3 }} />
                                        </span>
                                    )}
                                </div>

                                {/* Name & handle */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate leading-tight">
                                        {tipster.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 truncate">
                                        {tipster.handle}
                                    </p>
                                </div>

                                {/* Stats cluster */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Win/Loss record */}
                                    <span className="text-xs text-neutral-400 tabular-nums hidden sm:block">
                                        <span className="text-emerald-400">{tipster.totalWins}W</span>
                                        <span className="text-neutral-600 mx-0.5">/</span>
                                        <span className="text-red-400">{tipster.totalLosses}L</span>
                                    </span>

                                    {/* Primary stat badge */}
                                    <span className={`text-sm font-bold tabular-nums ${tipster.winRate >= 60
                                        ? 'text-accent'
                                        : tipster.winRate >= 45
                                            ? 'text-white'
                                            : 'text-neutral-400'
                                        }`}>
                                        {sortBy === 'averageOdds'
                                            ? tipster.averageOdds.toFixed(2)
                                            : sortBy === 'totalTips'
                                                ? tipster.totalTips
                                                : sortBy === 'totalWins'
                                                    ? tipster.totalWins
                                                    : `${tipster.winRate}%`
                                        }
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopTipsters;
