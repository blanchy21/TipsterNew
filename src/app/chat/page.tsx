'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { useAuth } from '@/lib/hooks/useAuth';

function ChatPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Chat</h1>
                        <p className="text-slate-400">Connect with other tipsters</p>
                    </div>

                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-white mb-2">Chat Feature Coming Soon</h2>
                        <p className="text-slate-400 mb-6">Real-time chat functionality is being developed</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ChatPageRoute() {
    return (
        <AuthProvider>
            <ChatPageContent />
        </AuthProvider>
    );
}
