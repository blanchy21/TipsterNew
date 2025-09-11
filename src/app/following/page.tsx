'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Following() {
    const { user, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            setError('Please sign in to view following users');
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-white">Loading following...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Following Access Required</h1>
                    <p className="text-slate-400 mb-6">{error || 'Please sign in to view following users'}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Following</h1>
                        <p className="text-slate-400">Users you're following</p>
                    </div>

                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No Users Followed Yet</h2>
                        <p className="text-slate-400 mb-6">Start following other tipsters to see their content here</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
                        >
                            Discover Tipsters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}