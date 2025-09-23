'use client';

import React, { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { getPosts, createPost, testFirebaseConnection, inspectFirebaseData } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DebugPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const [firebaseTestResult, setFirebaseTestResult] = useState<string>('');
  const [inspectionResult, setInspectionResult] = useState<string>('');

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

  const testFirebase = async () => {
    setLoading(true);
    try {
      const result = await testFirebaseConnection();
      if (result.success) {
        setFirebaseTestResult(`✅ Firebase connection test successful! Document ID: ${result.docId}`);
      } else {
        setFirebaseTestResult(`❌ Firebase connection test failed: ${result.error} (Code: ${result.code})`);
      }
    } catch (error) {
      console.error('Error testing Firebase:', error);
      setFirebaseTestResult(`❌ Error testing Firebase: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const inspectFirebase = async () => {
    setLoading(true);
    try {
      const result = await inspectFirebaseData();
      if (result.success) {
        setInspectionResult(`✅ Firebase data inspection successful! Found ${result.postsCount} posts and ${result.usersCount} users. Check console for detailed data.`);
      } else {
        setInspectionResult(`❌ Firebase data inspection failed: ${result.error} (Code: ${result.code})`);
      }
    } catch (error) {
      console.error('Error inspecting Firebase:', error);
      setInspectionResult(`❌ Error inspecting Firebase: ${error}`);
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
        isGameFinished: false,
        user: {
          id: user.uid,
          name: user.displayName || 'Test User',
          handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'testuser'}`,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
        }
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
              <div className="flex gap-4">
                <button
                  onClick={loadPosts}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
                >
                  {loading ? 'Loading...' : 'Load Posts'}
                </button>

                <button
                  onClick={testFirebase}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg"
                >
                  Test Firebase
                </button>

                <button
                  onClick={inspectFirebase}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg"
                >
                  Inspect Data
                </button>

                <button
                  onClick={createTestTip}
                  disabled={!user || loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg"
                >
                  Create Test Tip
                </button>
              </div>
            </div>

            {testResult && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <p className="font-mono text-sm">{testResult}</p>
              </div>
            )}

            {firebaseTestResult && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <p className="font-mono text-sm">{firebaseTestResult}</p>
              </div>
            )}

            {inspectionResult && (
              <div className="mt-4 p-4 bg-slate-700 rounded-lg">
                <p className="font-mono text-sm">{inspectionResult}</p>
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