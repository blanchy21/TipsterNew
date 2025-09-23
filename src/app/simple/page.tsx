'use client';

import { useState, useEffect } from 'react';

export default function SimplePage() {
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Simulate the same logic as App.tsx
        setLoading(false);
        setShowContent(true);
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/70">Loading...</p>
                </div>
            </div>
        );
    }

    if (showContent) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-4xl font-bold mb-4">Landing Page Content</h1>
                <p className="text-lg mb-4">This simulates the landing page content.</p>
                <p className="text-sm text-gray-400">If you can see this, the state management is working!</p>
            </div>
        );
    }

    return <div>Default state</div>;
}
