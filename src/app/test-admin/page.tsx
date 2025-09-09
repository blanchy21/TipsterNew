'use client';

import React, { useState } from 'react';
import {
    Target,
    BarChart3,
    Database,
    ArrowLeft,
    Home
} from 'lucide-react';
import TipVerificationPanel from '@/components/TipVerificationPanel';

export default function TestAdmin() {
    const [activeTab, setActiveTab] = useState<'overview' | 'tips'>('overview');

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
                            <div>
                                <h1 className="text-3xl font-bold text-white">Test Admin Panel</h1>
                                <p className="text-neutral-400">Simple admin interface with tip verification</p>
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

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'tips', label: 'Tip Verification', icon: Target }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
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

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Test Admin Working!</h2>
                            <p className="text-xl mb-8 text-neutral-300">
                                This admin page works without any authentication or layout issues.
                            </p>
                            <div className="space-y-4 max-w-2xl mx-auto">
                                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                                    <p className="text-green-400">✅ No authentication required</p>
                                </div>
                                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-blue-400">✅ No layout conflicts</p>
                                </div>
                                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                                    <p className="text-purple-400">✅ Immediate loading</p>
                                </div>
                                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                                    <p className="text-yellow-400">✅ Tip verification available</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tips' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-500/20 rounded-xl">
                                    <Target className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white">Tip Verification Panel</h2>
                            </div>
                            <p className="text-neutral-400 mb-6">
                                Manage and verify tips from users. Mark tips as win, loss, void, or place.
                            </p>
                        </div>
                        <TipVerificationPanel />
                    </div>
                )}
            </div>
        </div>
    );
}
