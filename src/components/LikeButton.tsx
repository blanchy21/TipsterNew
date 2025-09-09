'use client';

import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Post } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { likePost, unlikePost } from '@/lib/firebase/firebaseUtils';

interface LikeButtonProps {
  post: Post;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
}

export default function LikeButton({ post, onLikeChange }: LikeButtonProps) {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  
  const isLiked = user ? post.likedBy?.includes(user.uid) : false;
  const likeCount = post.likes || 0;

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    
    try {
      if (isLiked) {
        // Unlike the post
        await unlikePost(post.id, user.uid);
        const newLikedBy = post.likedBy?.filter(id => id !== user.uid) || [];
        onLikeChange(post.id, Math.max(0, likeCount - 1), newLikedBy);
      } else {
        // Like the post
        await likePost(post.id, user.uid);
        const newLikedBy = [...(post.likedBy || []), user.uid];
        onLikeChange(post.id, likeCount + 1, newLikedBy);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // In demo mode, still update the UI optimistically
      if (isLiked) {
        const newLikedBy = post.likedBy?.filter(id => id !== user.uid) || [];
        onLikeChange(post.id, Math.max(0, likeCount - 1), newLikedBy);
      } else {
        const newLikedBy = [...(post.likedBy || []), user.uid];
        onLikeChange(post.id, likeCount + 1, newLikedBy);
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={!user || isLiking}
      className={`
        inline-flex items-center gap-2 transition rounded-md px-2 py-1.5 ring-1 ring-transparent hover:ring-white/10
        ${isLiked 
          ? 'text-red-400 hover:text-red-300 bg-red-500/10' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }
        ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isLiking ? 'opacity-50 cursor-wait' : ''}
      `}
    >
      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      <span className="text-sm">{likeCount}</span>
    </button>
  );
}
