'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import {
  getFollowingUsers,
  getFollowers,
  getFollowSuggestions,
  searchUsers,
  followUser,
  unfollowUser,
  checkIfFollowing
} from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface FollowingContextType {
  following: User[];
  followers: User[];
  suggestions: User[];
  loading: boolean;
  error: string | null;
  refreshFollowing: () => Promise<void>;
  refreshFollowers: () => Promise<void>;
  refreshSuggestions: () => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  isFollowing: (userId: string) => Promise<boolean>;
}

const FollowingContext = createContext<FollowingContextType | undefined>(undefined);

export const useFollowing = () => {
  const context = useContext(FollowingContext);
  if (context === undefined) {
    throw new Error('useFollowing must be used within a FollowingProvider');
  }
  return context;
};

interface FollowingProviderProps {
  children: ReactNode;
}

export const FollowingProvider: React.FC<FollowingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFollowing = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    try {
      const followingUsers = await getFollowingUsers(user.uid);
      setFollowing(followingUsers);
    } catch (err) {
      setError('Failed to load following users');
      // Console statement removed for production
    } finally {
      setLoading(false);
    }
  };

  const loadFollowers = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    try {
      const followersList = await getFollowers(user.uid);
      setFollowers(followersList);
    } catch (err) {
      setError('Failed to load followers');
      // Console statement removed for production
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    try {

      const suggestionsList = await getFollowSuggestions(user.uid, 10);

      setSuggestions(suggestionsList);
    } catch (err) {
      setError('Failed to load suggestions');
      // Console statement removed for production
    } finally {
      setLoading(false);
    }
  };

  const refreshFollowing = async () => {
    await loadFollowing();
  };

  const refreshFollowers = async () => {
    await loadFollowers();
  };

  const refreshSuggestions = async () => {
    await loadSuggestions();
  };

  const searchUsersQuery = async (query: string): Promise<User[]> => {
    if (!user?.uid) return [];

    try {
      const results = await searchUsers(query, 20);
      return results;
    } catch (err) {
      // Console statement removed for production
      return [];
    }
  };

  const followUserAction = async (userId: string): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      await followUser(user.uid, userId);
      // Refresh following list
      await loadFollowing();
      // Remove from suggestions if it was there
      setSuggestions(prev => prev.filter(user => user.id !== userId));
      return true;
    } catch (err) {
      // Console statement removed for production
      return false;
    }
  };

  const unfollowUserAction = async (userId: string): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      await unfollowUser(user.uid, userId);
      // Refresh following list
      await loadFollowing();
      return true;
    } catch (err) {
      // Console statement removed for production
      return false;
    }
  };

  const isFollowingUser = async (userId: string): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      return await checkIfFollowing(user.uid, userId);
    } catch (err) {
      // Console statement removed for production
      return false;
    }
  };

  // Real-time following listener
  useEffect(() => {
    if (!user?.uid || !db) {
      setFollowing([]);
      setFollowers([]);
      setSuggestions([]);
      return;
    }

    // Real-time following listener
    const followingUnsubscribe = (async () => {
      try {
        const followingUsers = await getFollowingUsers(user.uid);
        setFollowing(followingUsers);
      } catch (error) {
        // Console statement removed for production
      }
    })();

    // Real-time followers listener
    const followersUnsubscribe = (async () => {
      try {
        const followersList = await getFollowers(user.uid);
        setFollowers(followersList);
      } catch (error) {
        // Console statement removed for production
      }
    })();

    // Load suggestions (not real-time as it's based on all users)
    loadSuggestions();

    return () => {

    };
  }, [user?.uid]);

  // Real-time user profile updates listener
  useEffect(() => {
    if (!user?.uid || !db) {
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();

        // Update following and followers counts in real-time
        if (userData.following) {
          // Refresh following list when user's following array changes
          getFollowingUsers(user.uid).then(setFollowing).catch(() => { });
        }
        if (userData.followers) {
          // Refresh followers list when user's followers array changes
          getFollowers(user.uid).then(setFollowers).catch(() => { });
        }
      }
    }, (error) => {
      // Console statement removed for production
    });

    return () => {

      unsubscribe();
    };
  }, [user?.uid]);

  const value: FollowingContextType = {
    following,
    followers,
    suggestions,
    loading,
    error,
    refreshFollowing,
    refreshFollowers,
    refreshSuggestions,
    searchUsers: searchUsersQuery,
    followUser: followUserAction,
    unfollowUser: unfollowUserAction,
    isFollowing: isFollowingUser
  };

  return (
    <FollowingContext.Provider value={value}>
      {children}
    </FollowingContext.Provider>
  );
};
