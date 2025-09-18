'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="text-center max-w-md mx-auto">
                <div className="mb-8">
                    <WifiOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-100 mb-2">
                        You&apos;re Offline
                    </h1>
                    <p className="text-slate-400 mb-6">
                        It looks like you&apos;re not connected to the internet. Check your connection and try again.
                    </p>
                </div>

                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500/20 text-sky-300 rounded-lg hover:bg-sky-500/30 transition-colors ring-1 ring-sky-500/30"
                >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
