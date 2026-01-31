'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query as firestoreQuery, orderBy as firestoreOrderBy, onSnapshot, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post, User } from '@/lib/types';
import { User as FirebaseUser } from 'firebase/auth';
import { normalizeImageUrl, getDefaultAvatar } from '@/lib/imageUtils';

// Cache user profiles to avoid repeated fetches
const userProfileCache = new Map<string, { user: User; fetchedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchUserProfile(userId: string): Promise<User | null> {
  if (!db || !userId) return null;

  const cached = userProfileCache.get(userId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.user;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const user: User = {
        id: userDoc.id,
        name: data.displayName || data.name || 'Anonymous User',
        handle: data.handle || `@user${userDoc.id.slice(0, 8)}`,
        avatar: normalizeImageUrl(data.avatar || data.photoURL || getDefaultAvatar()),
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
        privacy: data.privacy || { showEmail: false, showPhone: false, showLocation: false, showSocialMedia: false },
        preferences: data.preferences || { notifications: { likes: true, comments: true, follows: true, mentions: true, system: true }, theme: 'dark', language: 'en' },
      };
      userProfileCache.set(userId, { user, fetchedAt: Date.now() });
      return user;
    }
  } catch {
    // Fall through to return null
  }
  return null;
}

export function invalidateUserProfileCache(userId?: string) {
  if (userId) {
    userProfileCache.delete(userId);
  } else {
    userProfileCache.clear();
  }
}

export function useRealtimePosts(user: FirebaseUser | null, loading: boolean) {
  const [posts, setPosts] = useState<Post[]>([]);
  const enrichingRef = useRef(false);

  useEffect(() => {
    if (!db) {
      setPosts([]);
      return;
    }

    const postsRef = collection(db, 'posts');
    const q = firestoreQuery(
      postsRef,
      firestoreOrderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q,
      async (snapshot) => {
        const postsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
          } as Post;
        });

        const sortedPosts = postsData.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        // Set posts immediately with embedded data
        setPosts(sortedPosts);

        // Then enrich with fresh user profiles in the background
        if (enrichingRef.current) return;
        enrichingRef.current = true;

        try {
          // Collect unique user IDs
          const userIds = new Set<string>();
          for (const post of sortedPosts) {
            const userId = post.user?.id || (post as any).userId;
            if (userId) userIds.add(userId);
          }

          // Fetch all unique user profiles in parallel
          const profileEntries = await Promise.all(
            Array.from(userIds).map(async (id) => {
              const profile = await fetchUserProfile(id);
              return [id, profile] as const;
            })
          );

          const profileMap = new Map<string, User>();
          for (const [id, profile] of profileEntries) {
            if (profile) profileMap.set(id, profile);
          }

          // Only update if we actually found profiles
          if (profileMap.size > 0) {
            setPosts(current =>
              current.map(post => {
                const userId = post.user?.id || (post as any).userId;
                const freshProfile = userId ? profileMap.get(userId) : null;
                if (freshProfile) {
                  return {
                    ...post,
                    user: {
                      ...post.user,
                      name: freshProfile.name,
                      handle: freshProfile.handle,
                      avatar: freshProfile.avatar,
                    }
                  };
                }
                return post;
              })
            );
          }
        } finally {
          enrichingRef.current = false;
        }
      },
      () => {
        setPosts([]);
      }
    );

    return () => unsubscribe();
  }, [user, loading]);

  return { posts, setPosts };
}
