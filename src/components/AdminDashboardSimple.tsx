'use client';

import React, { useState, useEffect } from 'react';
import {
    Database,
    Trash2,
    Users,
    FileText,
    Loader2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Trophy,
    Eye,
    ArrowLeft,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Target,
    Award,
    Calendar,
    User as UserIcon,
    Activity,
    Shield,
    Settings,
    RefreshCw
} from 'lucide-react';
import { populateTestData, clearTestData } from '@/lib/populateTestData';
import { Post, TipStatus, User } from '@/lib/types';
import { getPosts, updatePost, getDocuments } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import TipVerificationPanel from './TipVerificationPanel';
import { db } from '@/lib/firebase/firebase';

const AdminDashboardSimple: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'tips' | 'users' | 'data'>('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalNotifications: 0,
        pendingTips: 0,
        verifiedTips: 0,
        winRate: 0,
        avgOdds: 0,
        topSports: [],
        recentActivity: []
    });

    // Load admin statistics
    useEffect(() => {
        const loadStats = async () => {
            if (!user || !db) return;

            try {
                console.log('🔄 Loading admin stats...');

                // Load all data in parallel
                const [posts, users, comments, notifications] = await Promise.all([
                    getDocuments('posts'),
                    getDocuments('users'),
                    getDocuments('comments'),
                    getDocuments('notifications')
                ]);

                console.log('📊 Loaded data:', { posts: posts.length, users: users.length, comments: comments.length, notifications: notifications.length });

                // Calculate statistics
                const totalUsers = users.length;
                const totalPosts = posts.length;
                const totalComments = comments.length;
                const totalNotifications = notifications.length;

                const pendingTips = posts.filter((p: any) => p.tipStatus === 'pending').length;
                const verifiedTips = posts.filter((p: any) => p.tipStatus && p.tipStatus !== 'pending').length;
                const wins = posts.filter((p: any) => p.tipStatus === 'win').length;
                const winRate = verifiedTips > 0 ? Math.round((wins / verifiedTips) * 100) : 0;

                // Calculate average odds
                const oddsValues = posts
                    .filter((p: any) => p.odds)
                    .map((p: any) => {
                        const odds = p.odds || '0';
                        if (odds.includes('/')) {
                            const [numerator, denominator] = odds.split('/').map(Number);
                            return (numerator / denominator) + 1;
                        }
                        return parseFloat(odds) || 0;
                    });

                const avgOdds = oddsValues.length > 0
                    ? Math.round(oddsValues.reduce((sum, odds) => sum + odds, 0) / oddsValues.length * 100) / 100
                    : 0;

                // Calculate top sports
                const sportCounts: { [key: string]: number } = {};
                posts.forEach((p: any) => {
                    sportCounts[p.sport] = (sportCounts[p.sport] || 0) + 1;
                });
                const topSports = Object.entries(sportCounts)
                    .map(([sport, count]) => ({ sport, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                // Generate recent activity
                const recentActivity = [
                    ...posts.slice(0, 3).map((p: any) => ({
                        type: 'post',
                        description: `New tip posted: "${p.title}"`,
                        timestamp: p.createdAt
                    })),
                    ...comments.slice(0, 2).map((c: any) => ({
                        type: 'comment',
                        description: `New comment on tip`,
                        timestamp: c.createdAt
                    }))
                ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 5);

                setStats({
                    totalUsers,
                    totalPosts,
                    totalComments,
                    totalNotifications,
                    pendingTips,
                    verifiedTips,
                    winRate,
                    avgOdds,
                    topSports,
                    recentActivity
                });

                console.log('✅ Admin stats loaded successfully');
            } catch (error) {
                console.error('❌ Error loading admin stats:', error);
            }
        };

        loadStats();
    }, [user]);

    const handlePopulateData = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await populateTestData();
            if (result.success) {
                setMessage({ type: 'success', text: 'Test data populated successfully! Refresh the page to see the changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to populate test data. Check console for details.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while populating test data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            const result = await clearTestData();
            if (result.success) {
                setMessage({ type: 'success', text: 'Test data cleared successfully! Refresh the page to see the changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to clear test data. Check console for details.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while clearing test data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'tips', label: 'Tip Verification', icon: CheckCircle },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'data', label: 'Data Management', icon: Database }
    ];

    return (
        <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-xl">
                                <Shield className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                                <p className="text-neutral-400">Manage your Tipster Arena platform</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${selectedTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Overview Tab */}
                {selectedTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Users</p>
                                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Tips</p>
                                        <p className="text-3xl font-bold text-white">{stats.totalPosts}</p>
                                    </div>
                                    <FileText className="w-8 h-8 text-green-400" />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Pending Verification</p>
                                        <p className="text-3xl font-bold text-yellow-400">{stats.pendingTips}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-400" />
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Win Rate</p>
                                        <p className="text-3xl font-bold text-green-400">{stats.winRate}%</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Top Sports</h3>
                                    <Activity className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    {stats.topSports.map((sport, index) => (
                                        <div key={sport.sport} className="flex items-center justify-between">
                                            <span className="text-slate-300">{sport.sport}</span>
                                            <span className="text-blue-400 font-medium">{sport.count} tips</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Platform Stats</h3>
                                    <BarChart3 className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Comments</span>
                                        <span className="text-purple-400 font-medium">{stats.totalComments}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Notifications</span>
                                        <span className="text-purple-400 font-medium">{stats.totalNotifications}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-300">Avg Odds</span>
                                        <span className="text-purple-400 font-medium">{stats.avgOdds}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                                    <Clock className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="text-slate-300">{activity.description}</p>
                                            <p className="text-slate-500 text-xs">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tip Verification Tab */}
                {selectedTab === 'tips' && (
                    <TipVerificationPanel />
                )}

                {/* Users Tab */}
                {selectedTab === 'users' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4">User Management</h3>
                            <p className="text-slate-400">User management features coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Data Management Tab */}
                {selectedTab === 'data' && (
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Populate Data */}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-xl">
                                        <Database className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Populate Test Data</h2>
                                </div>
                                <p className="text-neutral-400 mb-6">
                                    Add sample users, posts, and following relationships to test the application functionality.
                                </p>
                                <button
                                    onClick={handlePopulateData}
                                    disabled={isLoading}
                                    className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Users className="w-5 h-5" />
                                    )}
                                    {isLoading ? 'Populating...' : 'Populate Data'}
                                </button>
                            </div>

                            {/* Clear Data */}
                            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-500/20 rounded-xl">
                                        <Trash2 className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Clear Test Data</h2>
                                </div>
                                <p className="text-neutral-400 mb-6">
                                    Remove all test users and posts from the database. This action cannot be undone.
                                </p>
                                <button
                                    onClick={handleClearData}
                                    disabled={isLoading}
                                    className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-5 h-5" />
                                    )}
                                    {isLoading ? 'Clearing...' : 'Clear Data'}
                                </button>
                            </div>
                        </div>

                        {/* Test Data Info */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-500/20 rounded-xl">
                                    <FileText className="w-6 h-6 text-green-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Test Data Information</h2>
                            </div>
                            <div className="space-y-3 text-neutral-300">
                                <p><strong>Users:</strong> 6 test users with different specializations and verification status</p>
                                <p><strong>Posts:</strong> 3 sample posts from different sports</p>
                                <p><strong>Following:</strong> Pre-configured following relationships between users</p>
                                <p><strong>Features:</strong> All users have complete profiles with bios, social media, and specializations</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardSimple;
