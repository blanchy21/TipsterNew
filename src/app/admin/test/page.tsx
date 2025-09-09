'use client';

import React from 'react';

export default function AdminTest() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#2c1376]/70 flex items-center justify-center">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Admin Test Page</h1>
                <p className="text-xl">This is a test page to verify the admin route is working.</p>
                <div className="mt-8">
                    <a
                        href="/admin"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Go to Admin Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
