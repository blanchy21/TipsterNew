'use client';

import React from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export default function FollowingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen">
                {children}
            </div>
        </AuthProvider>
    );
}
