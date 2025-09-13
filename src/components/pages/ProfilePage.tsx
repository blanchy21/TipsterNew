'use client';

import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { useFollowing } from '@/lib/contexts/FollowingContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import ProfileHeader from '@/components/features/ProfileHeader';
import ProfileStats from '@/components/features/ProfileStats';
import ProfileTabs from '@/components/features/ProfileTabs';
import TipVerificationAnalytics from '@/components/features/TipVerificationAnalytics';
import ProfileEditModal from '@/components/modals/ProfileEditModal';
import { useProfileData } from '@/lib/hooks/useProfileData';
import { PageLoadingState } from '@/components/ui/LoadingState';
import PostCard from '@/components/features/PostCard';
import { Post } from '@/lib/types';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface ProfilePageProps {
  userId?: string;
  onNavigateToProfile?: (userId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onNavigateToProfile }) => {
  const { user: currentUser } = useAuth();
  const { profile, loadUserProfile } = useProfile();
  const { followers, following } = useFollowing();
  const [activeTab, setActiveTab] = useState('tips');
  const [showEditModal, setShowEditModal] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Use real user data or fallback to current user - memoized for performance
  const profileUser = useMemo(() => {
    return profile || (currentUser ? {
      id: currentUser.uid,
      name: currentUser.displayName || 'User',
      handle: `@${currentUser.email?.split('@')[0] || 'user'}`,
      avatar: normalizeImageUrl(currentUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'),
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0
    } : null);
  }, [profile, currentUser]);

  // Load user profile when userId changes
  useEffect(() => {
    if (userId && userId !== currentUser?.uid) {
      loadUserProfile(userId);
    }
  }, [userId, currentUser?.uid, loadUserProfile]);

  // Use custom hook for profile data
  const { userStats, statsLoading } = useProfileData({
    userId: profileUser?.id,
    followers,
    following
  });

  // Fetch user posts
  useEffect(() => {
    if (!profileUser?.id) return;

    setPostsLoading(true);
    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', profileUser.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setUserPosts(posts);
      setPostsLoading(false);
    }, (error) => {
      console.error('Error fetching user posts:', error);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [profileUser?.id]);

  if (!profileUser) {
    return <PageLoadingState />;
  }

  const isOwnProfile = !userId || userId === currentUser?.uid;

  const handleEditProfile = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tips':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Tips ({userPosts.length})
            </h3>
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/4" />
                        <div className="h-4 bg-slate-700 rounded w-1/2" />
                        <div className="h-20 bg-slate-700 rounded" />
                        <div className="flex space-x-4">
                          <div className="h-4 bg-slate-700 rounded w-16" />
                          <div className="h-4 bg-slate-700 rounded w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-slate-400">No tips yet</p>
                <p className="text-slate-500 text-sm">Start sharing your predictions!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeChange={() => { }} // Handle like changes if needed
                    onNavigateToProfile={onNavigateToProfile}
                    onPostDeleted={() => {
                      // Remove post from local state
                      setUserPosts(prev => prev.filter(p => p.id !== post.id));
                    }}
                    onPostUpdated={(postId, updatedPost) => {
                      // Update post in local state
                      setUserPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'followers':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Followers ({followers.length})</h3>
            {followers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-slate-400">No followers yet</p>
                <p className="text-slate-500 text-sm">Share great tips to gain followers!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {followers.map((follower) => (
                  <div key={follower.id} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                    <Image
                      src={normalizeImageUrl(follower.avatar)}
                      alt={follower.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{follower.name}</h4>
                      <p className="text-slate-400 text-sm">{follower.handle}</p>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'following':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Following ({following.length})</h3>
            {following.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-slate-400">Not following anyone yet</p>
                <p className="text-slate-500 text-sm">Discover great tipsters to follow!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {following.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                    <Image
                      src={normalizeImageUrl(user.avatar)}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{user.name}</h4>
                      <p className="text-slate-400 text-sm">{user.handle}</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Following
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Analytics</h3>
            <TipVerificationAnalytics userId={profileUser.id} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
          onNavigateToProfile={onNavigateToProfile}
        />

        {/* Profile Stats */}
        <div className="px-6">
          <ProfileStats stats={userStats} loading={statsLoading} />
        </div>

        {/* Profile Tabs */}
        <div className="px-6">
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={{
              totalTips: userStats.totalTips,
              followers: userStats.followers,
              following: userStats.following
            }}
          />
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          user={profileUser}
        />
      )}
    </div>
  );
};

export default memo(ProfilePage);
