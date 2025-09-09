'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { getPosts, createPost } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DebugPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const loadPosts = async () => {
    setLoading(true);
    try {
      const firestorePosts = await getPosts();
      setPosts(firestorePosts as Post[]);
      setTestResult(`✅ Loaded ${firestorePosts.length} posts successfully`);
    } catch (error) {
      console.error('Error loading posts:', error);
      setTestResult(`❌ Error loading posts: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestTip = async () => {
    if (!user) {
      setTestResult('❌ User not authenticated');
      return;
    }

    try {
      const testTipData = {
        sport: 'Football',
        title: `Test Tip - ${new Date().toLocaleTimeString()}`,
        content: 'This is a test tip to verify the posting functionality works correctly. The tip should appear in the center feed immediately after posting.',
        tags: ['test', 'football', 'debug'],
        odds: '2/1',
        gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        tipStatus: 'pending' as const,
        isGameFinished: false
      };

      const newPost = await createPost(testTipData);
      setTestResult(`✅ Test tip created successfully with ID: ${newPost.id}`);

      // Reload posts to see the new tip
      await loadPosts();
    } catch (error) {
      console.error('Error creating test tip:', error);
      setTestResult(`❌ Error creating test tip: ${error}`);
    }
  };

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tip Feed Debug Page</h1>

        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-4">
              <button
                onClick={loadPosts}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
              >
                {loading ? 'Loading...' : 'Load Posts'}
              </button>

              <button
                onClick={createTestTip}
                disabled={!user}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg ml-4"
              >
                Create Test Tip
              </button>
            </div>

            {testResult && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <p className="font-mono text-sm">{testResult}</p>
              </div>
            )}
          </div>

          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Current Posts ({posts.length})</h2>

            {posts.length === 0 ? (
              <p className="text-slate-400">No posts found</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <div key={post.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <span className="text-sm text-slate-400">#{index + 1}</span>
                    </div>
                    <p className="text-slate-300 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>Sport: {post.sport}</span>
                      <span>Odds: {post.odds || 'N/A'}</span>
                      <span>Status: {post.tipStatus || 'N/A'}</span>
                      <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-sky-500/20 text-sky-300 px-2 py-1 rounded">
                        {post.user.name}
                      </span>
                      <span className="text-xs text-slate-500">{post.user.handle}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}