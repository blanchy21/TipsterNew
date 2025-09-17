'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Crown, Medal, Award } from 'lucide-react';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { LeaderboardEntry, getAllUsersWithStats, getLeaderboardStats } from '@/lib/leaderboardUtils';
import { db } from '@/lib/firebase/firebase';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';

interface TopTipstersDataProps {
    onTipstersUpdate: (tipsters: LeaderboardEntry[]) => void;
    onStatsUpdate: (stats: any) => void;
    onNavigateToProfile?: (userId: string) => void;
}

const TopTipstersData: React.FC<TopTipstersDataProps> = ({
    onTipstersUpdate,
    onStatsUpdate,
    onNavigateToProfile
}) => {
    const [tipsters, setTipsters] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

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
                onTipstersUpdate(tipstersData);
                onStatsUpdate(statsData);
            } catch (error) {
                // Console statement removed for production
            } finally {
                setLoading(false);
            }
        };

        loadTipsters();
    }, [onTipstersUpdate, onStatsUpdate]);

    // Real-time listener for verification updates
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const setupRealtimeListener = async () => {
            try {
                if (!db) return;

                unsubscribe = onSnapshot(
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
                                onTipstersUpdate(tipstersData);
                                onStatsUpdate(statsData);
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
            } catch (error) {
                // Console statement removed for production
            }
        };

        setupRealtimeListener();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [onTipstersUpdate, onStatsUpdate]);

    if (loading) {
        return (
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
        );
    }

    return (
        <div className="space-y-4">
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
                    >
                        <div className="flex items-center gap-6">
                            {/* Position */}
                            <div className="flex-shrink-0">
                                {tipster.position === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                                {tipster.position === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                                {tipster.position === 3 && <Award className="w-6 h-6 text-amber-600" />}
                                {tipster.position > 3 && <span className="text-2xl font-bold text-neutral-400">#{tipster.position}</span>}
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
    );
};

export default TopTipstersData;
