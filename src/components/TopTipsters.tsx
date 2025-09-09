'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Trophy,
    Award,
    TrendingUp,
    Star,
    Crown,
    Medal,
    Target,
    Zap,
    Check,
    ArrowUp,
    ArrowDown,
    Minus
} from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface Tipster {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    totalTips: number;
    totalWins: number;
    winRate: number;
    averageOdds: number;
    winningStreak: number;
    followers: number;
    position: number;
    previousPosition: number;
    isVerified: boolean;
    specializations: string[];
}

interface TopTipstersProps {
    onNavigateToProfile?: (userId: string) => void;
}

const TopTipsters: React.FC<TopTipstersProps> = ({ onNavigateToProfile }) => {
    const [tipsters, setTipsters] = useState<Tipster[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'winRate' | 'totalTips' | 'winningStreak' | 'averageOdds'>('winRate');
    const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

    // Generate sample tipster data
    useEffect(() => {
        const generateTipsters = () => {
            const sampleTipsters: Tipster[] = [];
            const names = [
                'Alex Thompson', 'Sarah Mitchell', 'James Rodriguez', 'Emma Wilson',
                'Michael Chen', 'Lisa Anderson', 'David Brown', 'Jessica Taylor',
                'Robert Garcia', 'Amanda Martinez', 'Christopher Lee', 'Jennifer White',
                'Daniel Johnson', 'Michelle Davis', 'Andrew Miller', 'Stephanie Wilson',
                'Kevin Moore', 'Rachel Jackson', 'Brian Taylor', 'Nicole Anderson'
            ];

            for (let i = 0; i < 20; i++) {
                const totalTips = Math.floor(Math.random() * 200) + 50;
                const totalWins = Math.floor(totalTips * (Math.random() * 0.4 + 0.5)); // 50-90% win rate
                const winRate = totalTips > 0 ? Math.round((totalWins / totalTips) * 100) : 0;
                const averageOdds = Math.round((Math.random() * 2 + 1.5) * 100) / 100; // 1.5-3.5 odds
                const winningStreak = Math.floor(Math.random() * 15) + 1;
                const followers = Math.floor(Math.random() * 5000) + 100;
                const previousPosition = i + Math.floor(Math.random() * 6) - 3; // Random previous position

                sampleTipsters.push({
                    id: `tipster-${i + 1}`,
                    name: names[i] || `Tipster ${i + 1}`,
                    handle: `@${names[i]?.toLowerCase().replace(' ', '') || `tipster${i + 1}`}`,
                    avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=96&h=96&fit=crop&crop=face`,
                    totalTips,
                    totalWins,
                    winRate,
                    averageOdds,
                    winningStreak,
                    followers,
                    position: i + 1,
                    previousPosition: Math.max(1, previousPosition),
                    isVerified: i < 5, // Top 5 are verified
                    specializations: ['Football', 'Basketball', 'Tennis'].slice(0, Math.floor(Math.random() * 3) + 1)
                });
            }

            // Sort by win rate initially
            sampleTipsters.sort((a, b) => b.winRate - a.winRate);

            // Update positions after sorting
            sampleTipsters.forEach((tipster, index) => {
                tipster.position = index + 1;
            });

            setTipsters(sampleTipsters);
            setLoading(false);
        };

        generateTipsters();
    }, []);

    const getPositionIcon = (position: number) => {
        if (position === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
        if (position === 3) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="text-2xl font-bold text-neutral-400">#{position}</span>;
    };

    const getPositionChange = (current: number, previous: number) => {
        const change = previous - current;
        if (change > 0) return <ArrowUp className="w-4 h-4 text-emerald-400" />;
        if (change < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
        return <Minus className="w-4 h-4 text-neutral-400" />;
    };

    const getPositionChangeText = (current: number, previous: number) => {
        const change = previous - current;
        if (change > 0) return `+${change}`;
        if (change < 0) return `${change}`;
        return '0';
    };

    const getPositionChangeColor = (current: number, previous: number) => {
        const change = previous - current;
        if (change > 0) return 'text-emerald-400';
        if (change < 0) return 'text-red-400';
        return 'text-neutral-400';
    };

    const sortTipsters = (sortBy: 'winRate' | 'totalTips' | 'winningStreak' | 'averageOdds') => {
        const sorted = [...tipsters].sort((a, b) => {
            if (sortBy === 'winRate') return b.winRate - a.winRate;
            if (sortBy === 'totalTips') return b.totalTips - a.totalTips;
            if (sortBy === 'winningStreak') return b.winningStreak - a.winningStreak;
            if (sortBy === 'averageOdds') return b.averageOdds - a.averageOdds;
            return 0;
        });

        // Update positions after sorting
        sorted.forEach((tipster, index) => {
            tipster.position = index + 1;
        });

        setTipsters(sorted);
    };

    if (loading) {
        return (
            <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-neutral-400">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-full">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1.2s ease-out 0.3s forwards' }}>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl shadow-2xl">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Top Tipsters</h1>
                    </div>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        Discover the best tipsters on Tipster Arena. Ranked by performance, consistency, and expertise.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1s ease-out 0.6s forwards' }}>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('winRate')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'winRate'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Win Rate
                        </button>
                        <button
                            onClick={() => setSortBy('totalTips')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'totalTips'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Total Tips
                        </button>
                        <button
                            onClick={() => setSortBy('winningStreak')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'winningStreak'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Streak
                        </button>
                        <button
                            onClick={() => setSortBy('averageOdds')}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${sortBy === 'averageOdds'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                                }`}
                        >
                            Avg Odds
                        </button>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="space-y-4 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1s ease-out 0.9s forwards' }}>
                    {tipsters.map((tipster, index) => (
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
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-bold text-white">{tipster.winRate}%</div>
                                        <div className="text-xs text-neutral-400">Win Rate</div>
                                    </div>
                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-bold text-white">{tipster.totalTips}</div>
                                        <div className="text-xs text-neutral-400">Total Tips</div>
                                    </div>
                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-bold text-white">{tipster.winningStreak}</div>
                                        <div className="text-xs text-neutral-400">Streak</div>
                                    </div>
                                    <div className="group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-2xl font-bold text-white">{tipster.averageOdds.toFixed(2)}</div>
                                        <div className="text-xs text-neutral-400">Avg Odds</div>
                                    </div>
                                </div>

                                {/* Position Change */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1">
                                        {getPositionChange(tipster.position, tipster.previousPosition)}
                                        <span className={`text-sm font-semibold ${getPositionChangeColor(tipster.position, tipster.previousPosition)}`}>
                                            {getPositionChangeText(tipster.position, tipster.previousPosition)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-neutral-500">vs last week</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12 opacity-0 translate-y-8 blur-sm" style={{ animation: 'fadeInSlideUp 1s ease-out 3.5s forwards' }}>
                    <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                        Load More Tipsters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopTipsters;
