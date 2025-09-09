'use client';

import React, { useState } from 'react';
import {
    Database,
    Trash2,
    Users,
    FileText,
    Loader2,
    CheckCircle,
    ArrowLeft,
    Shield,
    Home
} from 'lucide-react';
import { populateTestData, clearTestData } from '@/lib/populateTestData';

export default function DemoAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#2c1376]/70">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
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
                                    <h1 className="text-3xl font-bold text-white">Demo Admin Panel</h1>
                                    <p className="text-neutral-400">No authentication required - perfect for testing</p>
                                </div>
                            </div>
                        </div>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Main App
                        </a>
                    </div>
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

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Status</p>
                                <p className="text-2xl font-bold text-green-400">Online</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Firebase</p>
                                <p className="text-2xl font-bold text-blue-400">Connected</p>
                            </div>
                            <Database className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Admin Panel</p>
                                <p className="text-2xl font-bold text-purple-400">Ready</p>
                            </div>
                            <Shield className="w-8 h-8 text-purple-400" />
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Auth</p>
                                <p className="text-2xl font-bold text-yellow-400">Demo</p>
                            </div>
                            <Users className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Data Management</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Populate Data */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-xl">
                                    <Database className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Populate Test Data</h3>
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
                                <h3 className="text-xl font-semibold text-white">Clear Test Data</h3>
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
                            <h3 className="text-xl font-semibold text-white">Test Data Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300">
                            <div>
                                <p><strong>Users:</strong> 6 test users with different specializations</p>
                                <p><strong>Posts:</strong> 3 sample posts from different sports</p>
                            </div>
                            <div>
                                <p><strong>Following:</strong> Pre-configured relationships</p>
                                <p><strong>Features:</strong> Complete profiles with bios and stats</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="/"
                                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                            >
                                <h4 className="text-white font-medium mb-2">Main App</h4>
                                <p className="text-slate-400 text-sm">Go to the main Tipster Arena application</p>
                            </a>
                            <a
                                href="/admin/working"
                                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                            >
                                <h4 className="text-white font-medium mb-2">Working Admin</h4>
                                <p className="text-slate-400 text-sm">Access the working admin page</p>
                            </a>
                            <a
                                href="/admin/minimal"
                                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                            >
                                <h4 className="text-white font-medium mb-2">Minimal Admin</h4>
                                <p className="text-slate-400 text-sm">Access the minimal admin interface</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
