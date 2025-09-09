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
      console.error('Error loading following:', err);
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
      console.error('Error loading followers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError(null);
    try {
      console.log(`Loading suggestions for user: ${user.uid}`);
      const suggestionsList = await getFollowSuggestions(user.uid, 10);
      console.log(`Loaded ${suggestionsList.length} suggestions:`, suggestionsList);
      setSuggestions(suggestionsList);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error('Error loading suggestions:', err);
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
      console.error('Error searching users:', err);
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
      console.error('Error following user:', err);
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
      console.error('Error unfollowing user:', err);
      return false;
    }
  };

  const isFollowingUser = async (userId: string): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      return await checkIfFollowing(user.uid, userId);
    } catch (err) {
      console.error('Error checking follow status:', err);
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

    console.log('🔄 Setting up real-time following listeners for user:', user.uid);

    // Real-time following listener
    const followingUnsubscribe = (async () => {
      try {
        const followingUsers = await getFollowingUsers(user.uid);
        setFollowing(followingUsers);
      } catch (error) {
        console.error('Error loading following users:', error);
      }
    })();

    // Real-time followers listener
    const followersUnsubscribe = (async () => {
      try {
        const followersList = await getFollowers(user.uid);
        setFollowers(followersList);
      } catch (error) {
        console.error('Error loading followers:', error);
      }
    })();

    // Load suggestions (not real-time as it's based on all users)
    loadSuggestions();

    return () => {
      console.log('🧹 Cleaning up following listeners');
    };
  }, [user?.uid]);

  // Real-time user profile updates listener
  useEffect(() => {
    if (!user?.uid || !db) {
      return;
    }

    console.log('🔄 Setting up real-time user profile listener for user:', user.uid);

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        console.log('📡 Real-time user profile update received');

        // Update following and followers counts in real-time
        if (userData.following) {
          // Refresh following list when user's following array changes
          getFollowingUsers(user.uid).then(setFollowing).catch(console.error);
        }
        if (userData.followers) {
          // Refresh followers list when user's followers array changes
          getFollowers(user.uid).then(setFollowers).catch(console.error);
        }
      }
    }, (error) => {
      console.error('Real-time user profile listener error:', error);
    });

    return () => {
      console.log('🧹 Cleaning up user profile listener');
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
