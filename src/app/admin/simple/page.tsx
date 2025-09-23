'use client';

import React, { useState } from 'react';
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

const SimpleAdminPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'data'>('overview');

    const handlePopulateData = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            console.log('🔄 Starting to populate test data...');
            const result = await populateTestData();
            console.log('📊 Populate result:', result);

            if (result.success) {
                setMessage({ type: 'success', text: 'Test data populated successfully! Refresh the page to see the changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to populate test data. Check console for details.' });
            }
        } catch (error) {
            console.error('❌ Error populating data:', error);
            setMessage({ type: 'error', text: 'An error occurred while populating test data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            console.log('🔄 Starting to clear test data...');
            const result = await clearTestData();
            console.log('📊 Clear result:', result);

            if (result.success) {
                setMessage({ type: 'success', text: 'Test data cleared successfully! Refresh the page to see the changes.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to clear test data. Check console for details.' });
            }
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            setMessage({ type: 'error', text: 'An error occurred while clearing test data.' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
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
                                <h1 className="text-3xl font-bold text-white">Admin Dashboard (Simple)</h1>
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
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-4">Welcome to Admin Dashboard</h3>
                            <p className="text-slate-300 mb-4">
                                This is a simplified admin dashboard for testing purposes. You can use the Data Management tab to populate or clear test data.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Status</p>
                                            <p className="text-2xl font-bold text-green-400">Online</p>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Firebase</p>
                                            <p className="text-2xl font-bold text-blue-400">Connected</p>
                                        </div>
                                        <Database className="w-8 h-8 text-blue-400" />
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Admin Panel</p>
                                            <p className="text-2xl font-bold text-purple-400">Ready</p>
                                        </div>
                                        <Shield className="w-8 h-8 text-purple-400" />
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-400 text-sm">Version</p>
                                            <p className="text-2xl font-bold text-yellow-400">1.0</p>
                                        </div>
                                        <Award className="w-8 h-8 text-yellow-400" />
                                    </div>
                                </div>
                            </div>
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

                        {/* Quick Links */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-xl">
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Quick Links</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <a
                                    href="/"
                                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    <h3 className="text-white font-medium mb-2">Main App</h3>
                                    <p className="text-slate-400 text-sm">Go to the main Tipster Arena application</p>
                                </a>
                                <a
                                    href="/admin"
                                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    <h3 className="text-white font-medium mb-2">Full Admin Panel</h3>
                                    <p className="text-slate-400 text-sm">Access the complete admin dashboard (requires login)</p>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleAdminPage;
