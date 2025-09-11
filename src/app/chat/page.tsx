'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useAuth } from '@/lib/hooks/useAuth';
import ChatPage from '@/components/ChatPage';

function ChatPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log('ChatPageContent - user:', user, 'loading:', loading);
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
                    <p className="text-slate-400 mb-6">You need to be signed in to access the chat</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    return <ChatPage />;
}

export default function ChatPageRoute() {
    return (
        <AuthProvider>
            <ChatPageContent />
        </AuthProvider>
    );
}
