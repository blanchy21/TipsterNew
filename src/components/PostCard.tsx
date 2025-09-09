'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, MessageCircle, Eye, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { Post } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import LikeButton from './LikeButton';
import FollowButton from './FollowButton';
import CommentsList from './CommentsList';
import AvatarWithFallback from './AvatarWithFallback';
import UserProfileLink from './UserProfileLink';

interface PostCardProps {
  post: Post;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
  onCommentCountChange?: (postId: string, newCount: number) => void;
  onNavigateToProfile?: (userId: string) => void;
}

export default function PostCard({ post, onLikeChange, onCommentCountChange, onNavigateToProfile }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);

  const handleCommentCountChange = (newCount: number) => {
    setCommentCount(newCount);
    onCommentCountChange?.(post.id, newCount);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <article className="group rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition ring-1 ring-white/5 hover:ring-white/10 p-4 md:p-5">
      <div className="flex items-start gap-3">
        <AvatarWithFallback
          src={post.user.avatar}
          alt={post.user.name}
          name={post.user.name}
          size={40}
          className="ring-1 ring-white/10"
        />
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {onNavigateToProfile ? (
                  <UserProfileLink 
                    user={post.user} 
                    onNavigateToProfile={onNavigateToProfile}
                    className="text-slate-100 font-medium truncate hover:text-blue-400"
                  >
                    {post.user.name}
                  </UserProfileLink>
                ) : (
                  <span className="text-slate-100 font-medium truncate">{post.user.name}</span>
                )}
                <span className="text-slate-500 text-sm truncate">{post.user.handle}</span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-500 text-xs">{timeAgo(post.createdAt)}</span>
              </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-300/90 bg-sky-500/10 ring-1 ring-sky-500/20 px-2 py-1 rounded-md">
                {post.sport}
              </span>
              <FollowButton targetUser={post.user} variant="minimal" />
              <button className="p-2 rounded-md hover:bg-white/5 transition ring-1 ring-transparent hover:ring-white/10">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            <h3 className="text-slate-100 font-semibold text-lg leading-tight">
              {post.title}
            </h3>
            
            <p className="text-sm text-slate-300/90 leading-relaxed">
              {post.content}
            </p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 ring-1 ring-white/10 px-2.5 py-1.5"
                  >
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-300 text-sm">{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <LikeButton post={post} onLikeChange={onLikeChange} />
            <button 
              onClick={toggleComments}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition rounded-md px-2 py-1.5 hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{commentCount}</span>
              {showComments ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <div className="inline-flex items-center gap-2 text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{post.views}</span>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 text-xs text-slate-500">
              <span>Community Discussion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-slate-700/50 pt-4">
          <CommentsList 
            postId={post.id} 
            onCommentCountChange={handleCommentCountChange}
          />
        </div>
      )}
    </article>
  );
}
