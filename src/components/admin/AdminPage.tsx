'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Trash2, Users, FileText, Loader2, CheckCircle, XCircle, Clock, AlertCircle, Trophy, Eye, ArrowLeft, BarChart3, TrendingUp, Activity, Shield } from 'lucide-react';
import { populateTestData, clearTestData } from '@/lib/populateTestData';
import { Post, TipStatus } from '@/lib/types';
import { getPosts, updatePost } from '@/lib/firebase/firebaseUtils';
import { createTipVerification } from '@/lib/firebase/tipVerification';
import { useAuth } from '@/lib/hooks/useAuth';
import { createNotification } from '@/lib/firebase/firebaseUtils';
import UserManagement from './UserManagement';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'data' | 'tips' | 'users'>('overview');
  const [filterStatus, setFilterStatus] = useState<TipStatus | 'all'>('all');

  // Load posts for tip verification
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const firestorePosts = await getPosts();
        setPosts(firestorePosts as Post[]);
      } catch (error) {
        // Console statement removed for production
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
      // Update the post status
      const updateResult = await updatePost(postId, {
        tipStatus: status,
        verifiedAt: new Date().toISOString(),
        verifiedBy: user.uid,
        isGameFinished: true
      });


      // Create verification record for leaderboard tracking
      const post = posts.find(p => p.id === postId);

      if (post) {

        const verificationResult = await createTipVerification({
          postId: postId,
          tipsterId: post.user.id,
          adminId: user.uid,
          status: status,
          notes: `Verified by admin as ${status}`,
          originalOdds: post.odds,
          finalOdds: post.odds
        });

      } else {
      }

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
      // Console statement removed for production
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

  const handleTestNotification = async () => {
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await createNotification({
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test notification to verify the notification system is working correctly.',
        recipientId: user.uid,
        actionUrl: '/notifications'
      });
      setMessage({ type: 'success', text: 'Test notification sent! Check your notifications page.' });
    } catch (error) {
      // Console statement removed for production
      setMessage({ type: 'error', text: 'Failed to create test notification' });
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
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'overview'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('data')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'data'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Data Management
          </button>
          <button
            onClick={() => setSelectedTab('tips')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'tips'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
          >
            <CheckCircle className="w-4 h-4 inline mr-2" />
            Tip Verification
          </button>
          <button
            onClick={() => setSelectedTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTab === 'users'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            User Management
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
            {message.text}
          </div>
        )}

        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white">{posts.length > 0 ? 'Loading...' : '0'}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Tips</p>
                    <p className="text-3xl font-bold text-white">{posts.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending Verification</p>
                    <p className="text-3xl font-bold text-yellow-400">{posts.filter(p => p.tipStatus === 'pending').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Verified Tips</p>
                    <p className="text-3xl font-bold text-green-400">{posts.filter(p => p.tipStatus && p.tipStatus !== 'pending').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Tip Status Breakdown</h3>
                  <Activity className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Wins</span>
                    <span className="text-green-400 font-medium">{posts.filter(p => p.tipStatus === 'win').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Losses</span>
                    <span className="text-red-400 font-medium">{posts.filter(p => p.tipStatus === 'loss').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Void</span>
                    <span className="text-gray-400 font-medium">{posts.filter(p => p.tipStatus === 'void').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Place</span>
                    <span className="text-blue-400 font-medium">{posts.filter(p => p.tipStatus === 'place').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Sports Activity</h3>
                  <Trophy className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-2">
                  {(() => {
                    const sportCounts: { [key: string]: number } = {};
                    posts.forEach((p: Post) => {
                      sportCounts[p.sport] = (sportCounts[p.sport] || 0) + 1;
                    });
                    const topSports = Object.entries(sportCounts)
                      .map(([sport, count]) => ({ sport, count }))
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5);

                    return topSports.map((sport, index) => (
                      <div key={sport.sport} className="flex items-center justify-between">
                        <span className="text-slate-300">{sport.sport}</span>
                        <span className="text-blue-400 font-medium">{sport.count} tips</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                  <Shield className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedTab('users')}
                    className="w-full text-left px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    View All Users
                  </button>
                  <button
                    onClick={() => setSelectedTab('tips')}
                    className="w-full text-left px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    Verify Pending Tips
                  </button>
                  <button
                    onClick={() => setSelectedTab('data')}
                    className="w-full text-left px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Manage Test Data
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Tips</h3>
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{post.title}</p>
                      <p className="text-slate-400 text-sm">By {post.user.name} • {post.sport}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.tipStatus === 'pending' && (
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-md">
                          Pending
                        </span>
                      )}
                      {post.tipStatus === 'win' && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md">
                          Win
                        </span>
                      )}
                      {post.tipStatus === 'loss' && (
                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md">
                          Loss
                        </span>
                      )}
                      <span className="text-slate-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p className="text-slate-400 text-center py-4">No tips available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'data' && (
          <>
            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Test Notification */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Test Notification</h2>
                </div>
                <p className="text-neutral-400 mb-6">
                  Send a test notification to verify the notification system is working correctly.
                </p>
                <button
                  onClick={handleTestNotification}
                  disabled={isLoading}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  {isLoading ? 'Sending...' : 'Test Notification'}
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
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
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${filterStatus === status
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
                        <div
                          className="text-slate-300 text-sm mb-3 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>By {post.user.name}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.gameDate && (
                            <>
                              <span>•</span>
                              <span>Event: {new Date(post.gameDate).toLocaleDateString()}</span>
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

        {selectedTab === 'users' && (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
