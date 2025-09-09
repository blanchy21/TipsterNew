'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { User } from '@/lib/types';
import { followUser, unfollowUser, checkIfFollowing } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

interface FollowButtonProps {
  targetUser: User;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: 'default' | 'compact' | 'minimal';
  className?: string;
}

export default function FollowButton({ 
  targetUser, 
  onFollowChange, 
  variant = 'default',
  className = ''
}: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !targetUser.id) return;
      
      try {
        setIsChecking(true);
        const following = await checkIfFollowing(user.uid, targetUser.id);
        setIsFollowing(following);
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFollowStatus();
  }, [user, targetUser.id]);

  // Don't show follow button if user is trying to follow themselves
  if (!user || user.uid === targetUser.id) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (!user || !targetUser.id || isLoading) return;

    try {
      setIsLoading(true);
      
      if (isFollowing) {
        await unfollowUser(user.uid, targetUser.id);
        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        await followUser(user.uid, targetUser.id);
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      </div>
    );
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="ml-2">Loading...</span>
        </>
      );
    }

    if (isFollowing) {
      return (
        <>
          <UserMinus className="w-4 h-4" />
          {variant !== 'minimal' && <span className="ml-2">Unfollow</span>}
        </>
      );
    }

    return (
      <>
        <UserPlus className="w-4 h-4" />
        {variant !== 'minimal' && <span className="ml-2">Follow</span>}
      </>
    );
  };

  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 group";
    
    if (variant === 'compact') {
      return `${baseClasses} px-3 py-1.5 text-sm rounded-lg ${
        isFollowing 
          ? 'bg-slate-600/50 text-slate-300 hover:bg-slate-600/70 hover:text-slate-200 border border-slate-500/30' 
          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 border border-blue-500/30'
      }`;
    }
    
    if (variant === 'minimal') {
      return `${baseClasses} p-2 rounded-lg ${
        isFollowing 
          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-600/30' 
          : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'
      }`;
    }
    
    // Default variant
    return `${baseClasses} px-4 py-2 rounded-xl ${
      isFollowing 
        ? 'bg-slate-600/50 text-slate-300 hover:bg-slate-600/70 hover:text-slate-200 border border-slate-500/30 hover:scale-105' 
        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
    }`;
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`${getButtonClasses()} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {getButtonContent()}
    </button>
  );
}
