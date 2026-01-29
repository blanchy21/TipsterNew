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

      // Update the backend (works in both authenticated and demo mode)
      await togglePostLike(post.id, userId, !isLiked);
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
        inline-flex items-center gap-1.5 transition-colors rounded-md px-2 py-1.5 text-sm
        ${isLiked
          ? 'text-red-400 hover:text-red-300'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
        }
        ${isLiking ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
      <span className="tabular-nums">{likeCount}</span>
    </button>
  );
}
