'use client';

import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { useFollowing } from '@/lib/contexts/FollowingContext';
import { normalizeImageUrl, getDefaultAvatar } from '@/lib/imageUtils';
import ProfileHeader from '@/components/features/ProfileHeader';
import ProfileStats from '@/components/features/ProfileStats';
import ProfileTabs from '@/components/features/ProfileTabs';
import TipVerificationAnalytics from '@/components/features/TipVerificationAnalytics';
import ProfileEditModal from '@/components/modals/ProfileEditModal';
import { useProfileData } from '@/lib/hooks/useProfileData';
import { PageLoadingState } from '@/components/ui/LoadingState';
import PostCard from '@/components/features/PostCard';
import AvatarWithFallback from '@/components/ui/AvatarWithFallback';
import { Post } from '@/lib/types';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { MessageCircle, Users } from 'lucide-react';
import { getUserFollowers, getUserFollowing } from '@/lib/firebase/follow-utils';
import { User } from '@/lib/types';

interface ProfilePageProps {
  userId?: string;
  onNavigateToProfile?: (userId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onNavigateToProfile }) => {
  const { user: currentUser } = useAuth();
  const { profile, loadUserProfile } = useProfile();
  const { followers: ownFollowers, following: ownFollowing } = useFollowing();
  const [activeTab, setActiveTab] = useState('tips');
  const [showEditModal, setShowEditModal] = useState(false);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [profileFollowers, setProfileFollowers] = useState<User[]>([]);
  const [profileFollowing, setProfileFollowing] = useState<User[]>([]);

  const profileUser = useMemo(() => {
    return profile || (currentUser ? {
      id: currentUser.uid,
      name: currentUser.displayName || 'User',
      handle: `@${currentUser.email?.split('@')[0] || 'user'}`,
      avatar: normalizeImageUrl(currentUser.photoURL || getDefaultAvatar()),
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0
    } : null);
  }, [profile, currentUser]);

  const isOwnProfile = !userId || userId === currentUser?.uid;
  const followers = isOwnProfile ? ownFollowers : profileFollowers;
  const following = isOwnProfile ? ownFollowing : profileFollowing;

  useEffect(() => {
    if (userId && userId !== currentUser?.uid) {
      loadUserProfile(userId);
    }
  }, [userId, currentUser?.uid, loadUserProfile]);

  useEffect(() => {
    if (!userId || userId === currentUser?.uid) return;

    let cancelled = false;
    const fetchProfileFollows = async () => {
      try {
        const [fetchedFollowers, fetchedFollowing] = await Promise.all([
          getUserFollowers(userId),
          getUserFollowing(userId)
        ]);
        if (!cancelled) {
          setProfileFollowers(fetchedFollowers);
          setProfileFollowing(fetchedFollowing);
        }
      } catch {
        // Failed to load followers/following for this profile
      }
    };
    fetchProfileFollows();
    return () => { cancelled = true; };
  }, [userId, currentUser?.uid]);

  const { userStats, statsLoading } = useProfileData({
    userId: profileUser?.id,
    followers,
    following
  });

  useEffect(() => {
    if (!profileUser?.id) return;

    setPostsLoading(true);
    const postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', profileUser.id),
      limit(50)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];

      const sortedPosts = posts.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });

      setUserPosts(sortedPosts);
      setPostsLoading(false);
    }, () => {
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [profileUser?.id]);

  const handleEditProfile = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  if (!profileUser) {
    return <PageLoadingState />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tips':
        return (
          <div>
            {postsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-surface-2/30 rounded-xl p-5 animate-pulse border border-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-surface-3/50 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2.5">
                        <div className="h-3.5 bg-surface-3/50 rounded w-1/4" />
                        <div className="h-3.5 bg-surface-3/50 rounded w-2/3" />
                        <div className="h-16 bg-surface-3/50 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-surface-2/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                  <MessageCircle className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">No tips yet</p>
                <p className="text-zinc-600 text-sm">
                  {isOwnProfile ? 'Share your first prediction to get started' : 'This user hasn\'t posted any tips yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeChange={() => { }}
                    onNavigateToProfile={onNavigateToProfile}
                    onPostDeleted={() => {
                      setUserPosts(prev => prev.filter(p => p.id !== post.id));
                    }}
                    onPostUpdated={(postId, updatedPost) => {
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
          <div>
            {followers.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-surface-2/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                  <Users className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">No followers yet</p>
                <p className="text-zinc-600 text-sm">
                  {isOwnProfile ? 'Share great tips to gain followers' : 'This user doesn\'t have followers yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {followers.map((follower) => (
                  <button
                    key={follower.id}
                    onClick={() => onNavigateToProfile?.(follower.id)}
                    className="flex items-center gap-3 w-full p-3.5 bg-surface-2/30 hover:bg-surface-2/50 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all text-left"
                  >
                    <AvatarWithFallback
                      src={follower.avatar}
                      alt={follower.name}
                      name={follower.name}
                      size={40}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{follower.name}</h4>
                      <p className="text-zinc-500 text-xs truncate">{follower.handle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'following':
        return (
          <div>
            {following.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-surface-2/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                  <Users className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-400 font-medium mb-1">Not following anyone</p>
                <p className="text-zinc-600 text-sm">
                  {isOwnProfile ? 'Discover great tipsters to follow' : 'This user isn\'t following anyone yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {following.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onNavigateToProfile?.(user.id)}
                    className="flex items-center gap-3 w-full p-3.5 bg-surface-2/30 hover:bg-surface-2/50 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all text-left"
                  >
                    <AvatarWithFallback
                      src={user.avatar}
                      alt={user.name}
                      name={user.name}
                      size={40}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{user.name}</h4>
                      <p className="text-zinc-500 text-xs truncate">{user.handle}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-surface-3/50 text-zinc-400 rounded-lg text-xs font-medium">
                      Following
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      case 'analytics':
        return (
          <TipVerificationAnalytics userId={profileUser.id} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full text-gray-100 font-body bg-surface-0 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ProfileHeader
          user={profileUser}
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
          onNavigateToProfile={onNavigateToProfile}
        />

        <div className="px-4 md:px-6 space-y-0">
          <ProfileStats stats={userStats} loading={statsLoading} />

          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={{
              totalTips: userStats.totalTips,
              followers: userStats.followers,
              following: userStats.following
            }}
          />

          <div className="pb-8">
            {renderTabContent()}
          </div>
        </div>
      </div>

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
