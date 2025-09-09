'use client';

import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    Calendar,
    Trophy,
    Activity,
    RefreshCw
} from 'lucide-react';
import { getUserVerificationStats, VerificationStats } from '@/lib/firebase/tipVerification';
import { useAuth } from '@/lib/hooks/useAuth';

interface TipVerificationAnalyticsProps {
    userId?: string;
    className?: string;
}

export default function TipVerificationAnalytics({
    userId,
    className = ''
}: TipVerificationAnalyticsProps) {
    const { user } = useAuth();
    const [stats, setStats] = useState<VerificationStats>({
        totalTips: 0,
        verifiedTips: 0,
        pendingTips: 0,
        winRate: 0,
        totalProfit: 0,
        avgOdds: 0,
        topSports: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            const targetUserId = userId || user?.uid;
            if (!targetUserId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const verificationStats = await getUserVerificationStats(targetUserId);
                setStats(verificationStats);
            } catch (error) {
                console.error('Error loading verification stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [userId, user?.uid]);

    if (loading) {
        return (
            <div className={`bg-white/5 rounded-xl p-6 border border-white/10 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                        <p className="text-slate-300">Loading analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Tips</p>
                            <p className="text-2xl font-bold text-white">{stats.totalTips}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Verified Tips</p>
                            <p className="text-2xl font-bold text-green-400">{stats.verifiedTips}</p>
                        </div>
                        <Award className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Win Rate</p>
                            <p className="text-2xl font-bold text-emerald-400">{stats.winRate}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Avg Odds</p>
                            <p className="text-2xl font-bold text-purple-400">{stats.avgOdds}</p>
                        </div>
                        <Target className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Sports Performance */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-white">Top Sports Performance</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.topSports.length > 0 ? (
                            stats.topSports.map((sport, index) => (
                                <div key={sport.sport} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-slate-300">{sport.sport}</span>
                                        <span className="text-xs text-slate-500">({sport.count} tips)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${sport.winRate >= 60 ? 'text-green-400' :
                                            sport.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {sport.winRate}%
                                        </span>
                                        <div className="w-16 bg-slate-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${sport.winRate >= 60 ? 'bg-green-400' :
                                                    sport.winRate >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                                                    }`}
                                                style={{ width: `${Math.min(sport.winRate, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm">No sports data available</p>
                        )}
                    </div>
                </div>

                {/* Verification Summary */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Verification Summary</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Pending Verification</span>
                            <span className="text-yellow-400 font-medium">{stats.pendingTips}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Total Profit</span>
                            <span className={`font-medium ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {stats.totalProfit >= 0 ? '+' : ''}${stats.totalProfit.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Verification Rate</span>
                            <span className="text-blue-400 font-medium">
                                {stats.totalTips > 0 ? Math.round((stats.verifiedTips / stats.totalTips) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Success Rate</span>
                            <span className={`font-medium ${stats.winRate >= 60 ? 'text-green-400' :
                                stats.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {stats.winRate}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Performance Over Time</h3>
                </div>
                <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400">Performance chart coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
