import { db } from "./firebase";
import {
  doc,
  getDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { User } from "@/lib/types";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { getDocuments } from "./firestore-helpers";
import { getUserProfile, ensureUserProfileExists } from "./profile-utils";
import { createNotification } from "./notification-utils";

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face';

const buildUserFromDoc = (docId: string, data: any): User => ({
  id: docId,
  name: data.displayName || data.name || 'Anonymous User',
  handle: data.handle || `@user${docId.slice(0, 8)}`,
  avatar: normalizeImageUrl(data.photoURL || data.avatar || DEFAULT_AVATAR),
  followers: data.followers || [],
  following: data.following || [],
  followersCount: data.followersCount || 0,
  followingCount: data.followingCount || 0,
  bio: data.bio || '',
  location: data.location || '',
  website: data.website || '',
  socialMedia: data.socialMedia || {},
  profilePhotos: data.profilePhotos || [],
  coverPhoto: data.coverPhoto || '',
  specializations: data.specializations || [],
  memberSince: data.memberSince || new Date().toISOString(),
  isVerified: data.isVerified || false,
  privacy: data.privacy || {
    showEmail: false,
    showPhone: false,
    showLocation: false,
    showSocialMedia: false
  },
  preferences: data.preferences || {
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      system: true
    },
    theme: 'dark',
    language: 'en'
  }
});

export const followUser = async (followerId: string, followingId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    await ensureUserProfileExists(followerId);
    await ensureUserProfileExists(followingId);

    const followerProfile = await getUserProfile(followerId);

    const batch = writeBatch(db);

    const followerRef = doc(db, "users", followerId);
    batch.update(followerRef, {
      following: arrayUnion(followingId),
      followingCount: 1
    });

    const followingRef = doc(db, "users", followingId);
    batch.update(followingRef, {
      followers: arrayUnion(followerId),
      followersCount: 1
    });

    await batch.commit();

    if (followerProfile) {
      await createNotification({
        type: 'follow',
        title: 'New Follower',
        message: `${followerProfile.name} started following you`,
        user: followerProfile,
        recipientId: followingId,
        actionUrl: `/profile/${followerId}`
      });
    }

    return Promise.resolve();
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    await ensureUserProfileExists(followerId);
    await ensureUserProfileExists(followingId);

    const batch = writeBatch(db);

    const followerRef = doc(db, "users", followerId);
    batch.update(followerRef, {
      following: arrayRemove(followingId),
      followingCount: -1
    });

    const followingRef = doc(db, "users", followingId);
    batch.update(followingRef, {
      followers: arrayRemove(followerId),
      followersCount: -1
    });

    return batch.commit();
  } catch (error) {
    throw error;
  }
};

export const checkIfFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  if (!db) {
    return false;
  }

  const userRef = doc(db, "users", followerId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return false;
  }

  const userData = userDoc.data();
  return userData.following?.includes(followingId) || false;
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  if (!db) {
    return [];
  }

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const followerIds = userData.followers || [];

  if (followerIds.length === 0) {
    return [];
  }

  const followers = await Promise.all(
    followerIds.map(async (followerId: string) => {
      const followerRef = doc(db, "users", followerId);
      const followerDoc = await getDoc(followerRef);
      if (followerDoc.exists()) {
        return buildUserFromDoc(followerDoc.id, followerDoc.data());
      }
      return null;
    })
  );

  return followers.filter(Boolean) as User[];
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  if (!db) {
    return [];
  }

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const followingIds = userData.following || [];

  if (followingIds.length === 0) {
    return [];
  }

  const following = await Promise.all(
    followingIds.map(async (followingId: string) => {
      const followingRef = doc(db, "users", followingId);
      const followingDoc = await getDoc(followingRef);
      if (followingDoc.exists()) {
        return buildUserFromDoc(followingDoc.id, followingDoc.data());
      }
      return null;
    })
  );

  return following.filter(Boolean) as User[];
};

export const getFollowingUsers = async (userId: string): Promise<User[]> => {
  if (!db) {
    return [];
  }

  try {
    return await getUserFollowing(userId);
  } catch (error) {
    return [];
  }
};

export const getFollowers = async (userId: string): Promise<User[]> => {
  if (!db) {
    return [];
  }

  try {
    return await getUserFollowers(userId);
  } catch (error) {
    return [];
  }
};

export const getFollowSuggestions = async (userId: string, limit: number = 10): Promise<User[]> => {
  if (!db) {
    return [];
  }

  try {
    const allUsers = await getDocuments('users');
    const currentUser = await getUserProfile(userId);
    const followingIds = currentUser?.following || [];

    const suggestions = allUsers
      .filter((user: any) => {
        if (user.id === userId) return false;
        if (followingIds.includes(user.id)) return false;
        if (user.deleted) return false;
        return true;
      })
      .slice(0, limit)
      .map((user: any) => ({
        id: user.id,
        name: user.displayName || user.name || 'Anonymous',
        handle: user.handle || `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        avatar: normalizeImageUrl(user.photoURL || user.avatar || DEFAULT_AVATAR),
        bio: user.bio || '',
        specializations: user.specializations || [],
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        isVerified: user.isVerified || false
      }));

    return suggestions;
  } catch (error) {
    return [];
  }
};

export const searchUsers = async (searchQuery: string, limit: number = 20): Promise<User[]> => {
  if (!db) {
    return [];
  }

  try {
    const allUsers = await getDocuments('users');
    const lowerQuery = searchQuery.toLowerCase();

    const results = allUsers
      .filter((user: any) => {
        const name = (user.displayName || user.name || '').toLowerCase();
        const handle = (user.handle || '').toLowerCase();
        const bio = (user.bio || '').toLowerCase();

        return name.includes(lowerQuery) ||
          handle.includes(lowerQuery) ||
          bio.includes(lowerQuery);
      })
      .slice(0, limit)
      .map((user: any) => ({
        id: user.id,
        name: user.displayName || user.name || 'Anonymous',
        handle: user.handle || `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        avatar: normalizeImageUrl(user.photoURL || user.avatar || DEFAULT_AVATAR),
        bio: user.bio || '',
        specializations: user.specializations || [],
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        isVerified: user.isVerified || false
      }));

    return results;
  } catch (error) {
    return [];
  }
};
