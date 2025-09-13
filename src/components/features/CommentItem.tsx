'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Reply, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { Comment } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { toggleCommentLike, deleteComment } from '@/lib/firebase/firebaseUtils';
import AvatarWithFallback from '@/components/ui/AvatarWithFallback';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  isReply?: boolean;
}

export default function CommentItem({
  comment,
  onDelete,
  onReply,
  onEdit,
  isReply = false
}: CommentItemProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(comment.likedBy.includes(user?.uid || ''));
  const [likes, setLikes] = useState(comment.likes);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.uid === comment.user.id;
  const canEdit = isOwner && !isReply; // Don't allow editing replies for now
  const canDelete = isOwner;

  const handleLike = async () => {
    if (!user) return;

    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikes(newLikes);

    try {
      await toggleCommentLike(comment.id, user.uid, newIsLiked);
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes(likes);
      console.error('Error liking comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteComment(comment.id, comment.postId);
      onDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (!canEdit) return;
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className={`group ${isReply ? 'ml-8 border-l border-slate-700/50 pl-4' : ''}`}>
      <div className="flex items-start gap-3">
        <AvatarWithFallback
          src={comment.user.avatar}
          alt={comment.user.name}
          name={comment.user.name}
          size={32}
          className="ring-1 ring-white/10 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-100 font-medium text-sm truncate">
              {comment.user.name}
            </span>
            <span className="text-slate-500 text-xs truncate">
              {comment.user.handle}
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-500 text-xs">
              {timeAgo(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-slate-500 text-xs">(edited)</span>
            )}
          </div>

          <div className="mt-1">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs rounded-md transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-slate-200 text-xs rounded-md transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed mt-1">
                {comment.content}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`inline-flex items-center gap-1 text-xs transition ${isLiked
                ? 'text-red-400 hover:text-red-300'
                : 'text-slate-400 hover:text-slate-200'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => onReply(comment.id)}
                disabled={!user}
                className={`inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition ${!user ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </button>
            )}

            {(canEdit || canDelete) && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 rounded hover:bg-white/5 transition"
                >
                  <MoreHorizontal className="w-3 h-3 text-slate-400" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-6 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {canEdit && (
                      <button
                        onClick={handleEdit}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
