'use client';

import React, { useState } from 'react';
import { Plus, MessageCircle, Heart, Eye } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPost } from '@/lib/firebase/firebaseUtils';
import { Post } from '@/lib/types';

export default function RealtimeTest() {
    const { user } = useAuth();
    const [isCreating, setIsCreating] = useState(false);

    const createTestPost = async () => {
        if (!user) return;

        setIsCreating(true);
        try {
            const testPost: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'> = {
                sport: 'Football',
                title: `Real-time Test Post ${Date.now()}`,
                content: 'This is a test post to demonstrate real-time functionality. Watch it appear instantly!',
                tags: ['test', 'realtime', 'demo'],
                odds: '2/1',
                gameDate: new Date().toISOString(),
                tipStatus: 'pending',
                isGameFinished: false
            };

            await createPost({
                ...testPost,
                user: {
                    id: user.uid,
                    name: user.displayName || 'Test User',
                    handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'testuser'}`,
                    avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
                }
            });

            console.log('✅ Test post created successfully');
        } catch (error) {
            console.error('❌ Error creating test post:', error);
        } finally {
            setIsCreating(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-slate-800/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Real-time Test
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                    Test the real-time functionality by creating a post and watching it appear instantly.
                </p>
                <button
                    onClick={createTestPost}
                    disabled={isCreating}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {isCreating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Create Test Post
                        </>
                    )}
                </button>
                <div className="mt-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1 mb-1">
                        <Heart className="w-3 h-3" />
                        <span>Likes update in real-time</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Comments sync instantly</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>View counts update live</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
