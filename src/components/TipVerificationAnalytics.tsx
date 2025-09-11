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
    RefreshCw,
    PieChart
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
        totalWins: 0,
        totalLosses: 0,
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
                            <span className="text-slate-300">Total Wins</span>
                            <span className="text-green-400 font-medium">
                                {stats.totalWins}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-300">Total Losses</span>
                            <span className="text-red-400 font-medium">
                                {stats.totalLosses || 0}
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

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sports Distribution Pie Chart */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500 group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <PieChart className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Tips by Sport</h3>
                    </div>
                    <div className="h-64">
                        {stats.topSports.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={stats.topSports.map((sport, index) => ({
                                            name: sport.sport,
                                            value: sport.count,
                                            color: [
                                                '#F59E0B', // amber-500 - more vibrant
                                                '#F97316', // orange-500 - bright orange
                                                '#EF4444', // red-500 - bold red
                                                '#8B5CF6', // violet-500 - purple
                                                '#06B6D4', // cyan-500 - bright cyan
                                                '#10B981', // emerald-500 - green
                                                '#3B82F6', // blue-500 - blue
                                                '#EC4899'  // pink-500 - bright pink
                                            ][index % 8]
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        className="hover:scale-105 transition-transform duration-300"
                                        animationBegin={0}
                                        animationDuration={1000}
                                    >
                                        {stats.topSports.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={[
                                                    '#F59E0B', '#F97316', '#EF4444', '#8B5CF6',
                                                    '#06B6D4', '#10B981', '#3B82F6', '#EC4899'
                                                ][index % 8]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            padding: '8px 12px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        }}
                                        formatter={(value: any, name: string, props: any) => [
                                            `${value} tips`,
                                            props.payload.sport
                                        ]}
                                        labelFormatter={() => ''}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-400">No sports data available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Win Rate by Sport Bar Chart */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500 group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Win Rate by Sport</h3>
                    </div>
                    <div className="h-64">
                        {stats.topSports.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.topSports.map((sport, index) => ({
                                    sport: sport.sport,
                                    winRate: sport.winRate,
                                    tips: sport.count,
                                    color: [
                                        '#F59E0B', '#F97316', '#EF4444', '#8B5CF6',
                                        '#06B6D4', '#10B981', '#3B82F6', '#EC4899'
                                    ][index % 8]
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                    <XAxis
                                        dataKey="sport"
                                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                                        label={{ value: 'Win Rate %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94A3B8' } }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            padding: '8px 12px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                        }}
                                        formatter={(value: any, name: string, props: any) => [
                                            `${value}%`,
                                            'Win Rate'
                                        ]}
                                        labelFormatter={(label) => `${label}`}
                                    />
                                    <Bar
                                        dataKey="winRate"
                                        radius={[4, 4, 0, 0]}
                                        className="hover:opacity-80 transition-opacity duration-300"
                                        animationBegin={0}
                                        animationDuration={1000}
                                    >
                                        {stats.topSports.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={[
                                                    '#F59E0B', '#F97316', '#EF4444', '#8B5CF6',
                                                    '#06B6D4', '#10B981', '#3B82F6', '#EC4899'
                                                ][index % 8]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <p className="text-slate-400">No sports data available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-500/20 rounded-xl">
                        <Trophy className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Performance Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400 mb-2">{stats.winRate}%</div>
                        <div className="text-sm text-slate-300">Overall Win Rate</div>
                        <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                            <div
                                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(stats.winRate, 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{stats.totalWins}</div>
                        <div className="text-sm text-slate-300">Total Wins</div>
                        <div className="text-xs text-slate-400 mt-1">
                            {stats.verifiedTips > 0 ? `${Math.round((stats.totalWins / stats.verifiedTips) * 100)}% of verified` : 'No verified tips'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-red-400 mb-2">{stats.totalLosses || 0}</div>
                        <div className="text-sm text-slate-300">Total Losses</div>
                        <div className="text-xs text-slate-400 mt-1">
                            {stats.verifiedTips > 0 ? `${Math.round(((stats.totalLosses || 0) / stats.verifiedTips) * 100)}% of verified` : 'No verified tips'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-orange-400 mb-2">{stats.topSports.length}</div>
                        <div className="text-sm text-slate-300">Sports Covered</div>
                        <div className="text-xs text-slate-400 mt-1">
                            {stats.topSports.map(s => s.sport).join(', ')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
