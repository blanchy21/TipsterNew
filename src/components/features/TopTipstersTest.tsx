'use client';

import React from 'react';

interface TopTipstersTestProps {
    onNavigateToProfile?: (userId: string) => void;
}

const TopTipstersTest: React.FC<TopTipstersTestProps> = ({ onNavigateToProfile }) => {
    return (
        <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-full">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Top Tipsters Test</h1>
                <p className="text-center text-gray-400">This is a test component to verify the loading issue is fixed.</p>
            </div>
        </div>
    );
};

export default TopTipstersTest;
