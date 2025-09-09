'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Trash2, Users, FileText, Loader2, CheckCircle, XCircle, Clock, AlertCircle, Trophy, Eye, ArrowLeft } from 'lucide-react';
import { populateTestData, clearTestData } from '@/lib/populateTestData';
import { Post, TipStatus } from '@/lib/types';
import { getPosts, updatePost } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'data' | 'tips'>('data');
  const [filterStatus, setFilterStatus] = useState<TipStatus | 'all'>('all');

  // Load posts for tip verification
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const firestorePosts = await getPosts();
        setPosts(firestorePosts as Post[]);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    if (user) {
      loadPosts();
    }
  }, [user]);

  const handleVerifyTip = async (postId: string, status: TipStatus) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updatePost(postId, {
        tipStatus: status,
        verifiedAt: new Date().toISOString(),
        verifiedBy: user.uid,
        isGameFinished: true
      });

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              tipStatus: status, 
              verifiedAt: new Date().toISOString(), 
              verifiedBy: user.uid,
              isGameFinished: true 
            }
          : post
      ));

      setMessage({ type: 'success', text: `Tip marked as ${status}!` });
    } catch (error) {
      console.error('Error verifying tip:', error);
      setMessage({ type: 'error', text: 'Failed to verify tip. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: TipStatus) => {
    const iconConfig = {
      pending: { icon: Clock, className: 'text-yellow-400' },
      win: { icon: CheckCircle, className: 'text-green-400' },
      loss: { icon: XCircle, className: 'text-red-400' },
      void: { icon: AlertCircle, className: 'text-gray-400' },
      place: { icon: Trophy, className: 'text-blue-400' }
    };
    const config = iconConfig[status];
    const Icon = config.icon;
    return <Icon className={`w-4 h-4 ${config.className}`} />;
  };

  const getStatusButtonClass = (status: TipStatus) => {
    const baseClass = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2";
    const statusClasses = {
      pending: "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30",
      win: "bg-green-500/20 text-green-300 hover:bg-green-500/30",
      loss: "bg-red-500/20 text-red-300 hover:bg-red-500/30",
      void: "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30",
      place: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
    };
    return `${baseClass} ${statusClasses[status]}`;
  };

  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'all') return true;
    return post.tipStatus === filterStatus;
  });

  const handlePopulateData = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await populateTestData();
      if (result.success) {
        setMessage({ type: 'success', text: 'Test data populated successfully! Refresh the page to see the changes.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to populate test data. Check console for details.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while populating test data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await clearTestData();
      if (result.success) {
        setMessage({ type: 'success', text: 'Test data cleared successfully! Refresh the page to see the changes.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to clear test data. Check console for details.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while clearing test data.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-neutral-400">Manage test data and verify tips</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSelectedTab('data')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'data'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Data Management
          </button>
          <button
            onClick={() => setSelectedTab('tips')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTab === 'tips'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Tip Verification
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {selectedTab === 'data' && (
          <>
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Populate Data */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Populate Test Data</h2>
            </div>
            <p className="text-neutral-400 mb-6">
              Add sample users, posts, and following relationships to test the application functionality.
            </p>
            <button
              onClick={handlePopulateData}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Users className="w-5 h-5" />
              )}
              {isLoading ? 'Populating...' : 'Populate Data'}
            </button>
          </div>

          {/* Clear Data */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Clear Test Data</h2>
            </div>
            <p className="text-neutral-400 mb-6">
              Remove all test users and posts from the database. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              {isLoading ? 'Clearing...' : 'Clear Data'}
            </button>
          </div>
        </div>

        {/* Test Data Info */}
        <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Test Data Information</h2>
          </div>
          <div className="space-y-3 text-neutral-300">
            <p><strong>Users:</strong> 6 test users with different specializations and verification status</p>
            <p><strong>Posts:</strong> 3 sample posts from different sports</p>
            <p><strong>Following:</strong> Pre-configured following relationships between users</p>
            <p><strong>Features:</strong> All users have complete profiles with bios, social media, and specializations</p>
          </div>
        </div>
          </>
        )}

        {selectedTab === 'tips' && (
          <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Filter Tips</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  All Tips ({posts.length})
                </button>
                {(['pending', 'win', 'loss', 'void', 'place'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      filterStatus === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {getStatusIcon(status)}
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({posts.filter(p => p.tipStatus === status).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Tips List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                  <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Tips Found</h3>
                  <p className="text-slate-400">No tips match the current filter criteria.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-sky-300/90 bg-sky-500/10 ring-1 ring-sky-500/20 px-2 py-1 rounded-md">
                            {post.sport}
                          </span>
                          {post.tipStatus && (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(post.tipStatus)}
                              <span className="text-sm font-medium capitalize">{post.tipStatus}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>By {post.user.name}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.gameDate && (
                            <>
                              <span>•</span>
                              <span>Game: {new Date(post.gameDate).toLocaleDateString()}</span>
                            </>
                          )}
                          {post.odds && (
                            <>
                              <span>•</span>
                              <span>Odds: {post.odds}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex flex-wrap gap-2">
                      {post.tipStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerifyTip(post.id, 'win')}
                            disabled={isLoading}
                            className={getStatusButtonClass('win')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Win
                          </button>
                          <button
                            onClick={() => handleVerifyTip(post.id, 'loss')}
                            disabled={isLoading}
                            className={getStatusButtonClass('loss')}
                          >
                            <XCircle className="w-4 h-4" />
                            Mark as Loss
                          </button>
                          <button
                            onClick={() => handleVerifyTip(post.id, 'void')}
                            disabled={isLoading}
                            className={getStatusButtonClass('void')}
                          >
                            <AlertCircle className="w-4 h-4" />
                            Mark as Void
                          </button>
                          {(post.sport === 'Horse Racing' || post.sport === 'Greyhound Racing' || post.sport === 'Golf') && (
                            <button
                              onClick={() => handleVerifyTip(post.id, 'place')}
                              disabled={isLoading}
                              className={getStatusButtonClass('place')}
                            >
                              <Trophy className="w-4 h-4" />
                              Mark as Place
                            </button>
                          )}
                        </>
                      )}
                      {post.tipStatus && post.tipStatus !== 'pending' && (
                        <div className="text-sm text-slate-400">
                          Verified on {post.verifiedAt ? new Date(post.verifiedAt).toLocaleDateString() : 'Unknown date'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
