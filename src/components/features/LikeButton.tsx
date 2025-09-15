'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Post } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { togglePostLike } from '@/lib/firebase/firebaseUtils';

interface LikeButtonProps {
  post: Post;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
}

export default function LikeButton({ post, onLikeChange }: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);

  const userId = user?.uid || 'demo-user';
  const isLiked = post.likedBy?.includes(userId) || false;
  const likeCount = post.likes || 0;

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);

    try {
      // For demo mode, use a temporary user ID if no user is logged in
      const userId = user?.uid || 'demo-user';

      // Update UI optimistically first
      if (isLiked) {
        const newLikedBy = post.likedBy?.filter(id => id !== userId) || [];
        onLikeChange(post.id, Math.max(0, likeCount - 1), newLikedBy);
      } else {
        const newLikedBy = [...(post.likedBy || []), userId];
        onLikeChange(post.id, likeCount + 1, newLikedBy);
      }

      // Then update the backend (only if user is authenticated)
      if (user) {
        await togglePostLike(post.id, user.uid, !isLiked);
      } else {
        // Demo mode: Like button clicked (not saved to backend)
      }
    } catch (error) {
      // Console statement removed for production
      // Revert the optimistic update on error
      if (isLiked) {
        const userId = user?.uid || 'demo-user';
        const newLikedBy = [...(post.likedBy || []), userId];
        onLikeChange(post.id, likeCount, newLikedBy);
      } else {
        const userId = user?.uid || 'demo-user';
        const newLikedBy = post.likedBy?.filter(id => id !== userId) || [];
        onLikeChange(post.id, Math.max(0, likeCount - 1), newLikedBy);
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className={`
        inline-flex items-center gap-2 transition rounded-md px-2 py-1.5 ring-1 ring-transparent hover:ring-white/10
        ${isLiked
          ? 'text-red-400 hover:text-red-300 bg-red-500/10'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }
        ${!user ? 'opacity-75' : 'cursor-pointer'}
        ${isLiking ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      <span className="text-sm">{likeCount}</span>
    </button>
  );
}
