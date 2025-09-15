'use client';

import React, { useState, useRef, useEffect, memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { MoreHorizontal, MessageCircle, Eye, Hash, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, AlertCircle, Trophy, Edit, Trash2, X } from 'lucide-react';
import { Post, TipStatus } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import LikeButton from './LikeButton';
import FollowButton from './FollowButton';
import CommentsList from './CommentsList';
import AvatarWithFallback from '@/components/ui/AvatarWithFallback';
import UserProfileLink from '@/components/ui/UserProfileLink';
import TipVerificationStatus from './TipVerificationStatus';
import { useAuth } from '@/lib/hooks/useAuth';
import { deletePost, updatePost } from '@/lib/firebase/firebaseUtils';
import AsyncErrorBoundary from '@/components/ui/AsyncErrorBoundary';
import { CardLoadingState } from '@/components/ui/LoadingState';

interface PostCardProps {
  post: Post;
  onLikeChange: (postId: string, newLikes: number, newLikedBy: string[]) => void;
  onCommentCountChange?: (postId: string, newCount: number) => void;
  onNavigateToProfile?: (userId: string) => void;
  onPostDeleted?: (postId: string) => void;
  onPostUpdated?: (postId: string, updatedPost: Post) => void;
}

const PostCard = memo(function PostCard({ post, onLikeChange, onCommentCountChange, onNavigateToProfile, onPostDeleted, onPostUpdated }: PostCardProps) {

  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: post.title,
    content: post.content,
    odds: post.odds || '',
    tags: post.tags.join(', '),
    sport: post.sport
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleCommentCountChange = useCallback((newCount: number) => {
    setCommentCount(newCount);
    onCommentCountChange?.(post.id, newCount);
  }, [post.id, onCommentCountChange]);

  const toggleComments = useCallback(() => {
    setShowComments(!showComments);
  }, [showComments]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close edit modal with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showEditModal) {
        handleEditCancel();
      }
    };

    if (showEditModal) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showEditModal]);

  // Check if current user can edit/delete this post
  const canEdit = user && user.uid === post.user.id;
  const canDelete = user && user.uid === post.user.id;

  const handleDeletePost = async () => {
    if (!canDelete) return;

    const confirmed = window.confirm('Are you sure you want to delete this tip? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onPostDeleted?.(post.id);
      setShowMenu(false);
    } catch (error) {
      // Console statement removed for production
      alert('Failed to delete tip. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPost = () => {
    if (!canEdit) return;
    // Reset form to current post values
    setEditForm({
      title: post.title,
      content: post.content,
      odds: post.odds || '',
      tags: post.tags.join(', '),
      sport: post.sport
    });
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setIsUpdating(true);
    try {
      const updatedPost = {
        ...post,
        title: editForm.title.trim(),
        content: editForm.content.trim(),
        odds: editForm.odds.trim() || undefined,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        sport: editForm.sport,
        updatedAt: new Date().toISOString()
      };

      await updatePost(post.id, updatedPost);
      onPostUpdated?.(post.id, updatedPost);
      setShowEditModal(false);
    } catch (error) {
      // Console statement removed for production
      alert('Failed to update tip. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    // Reset form to original values
    setEditForm({
      title: post.title,
      content: post.content,
      odds: post.odds || '',
      tags: post.tags.join(', '),
      sport: post.sport
    });
  };

  const getTipStatusDisplay = (status: TipStatus | undefined) => {
    if (!status) return null;

    const statusConfig = {
      pending: {
        icon: Clock,
        text: 'Pending',
        className: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
        iconClassName: 'text-yellow-300'
      },
      win: {
        icon: CheckCircle,
        text: 'Win',
        className: 'bg-green-500/20 text-green-300 ring-green-500/30',
        iconClassName: 'text-green-300'
      },
      loss: {
        icon: XCircle,
        text: 'Loss',
        className: 'bg-red-500/20 text-red-300 ring-red-500/30',
        iconClassName: 'text-red-300'
      },
      void: {
        icon: AlertCircle,
        text: 'Void',
        className: 'bg-gray-500/20 text-gray-300 ring-gray-500/30',
        iconClassName: 'text-gray-300'
      },
      place: {
        icon: Trophy,
        text: 'Place',
        className: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
        iconClassName: 'text-blue-300'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ring-1 ${config.className}`}>
        <Icon className={`w-4 h-4 ${config.iconClassName}`} />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  return (
    <AsyncErrorBoundary
      fallback={<CardLoadingState />}
      onError={(error) => {
        // Console statement removed for production
      }}
    >
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
                {(canEdit || canDelete) && (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 rounded-md hover:bg-white/5 transition ring-1 ring-transparent hover:ring-white/10"
                    >
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          {canEdit && (
                            <button
                              onClick={handleEditPost}
                              className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Tip
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={handleDeletePost}
                              disabled={isDeleting}
                              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              {isDeleting ? 'Deleting...' : 'Delete Tip'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <h3 className="text-slate-100 font-semibold text-lg leading-tight">
                {post.title}
              </h3>

              <p className="text-sm text-slate-300/90 leading-relaxed">
                {post.content}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {post.odds && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3 py-2">
                    <span className="text-emerald-300 text-sm font-medium">Odds:</span>
                    <span className="text-emerald-200 text-sm font-semibold">{post.odds}</span>
                  </div>
                )}

                <TipVerificationStatus
                  status={post.tipStatus}
                  verifiedAt={post.verifiedAt}
                  verifiedBy={post.verifiedBy}
                  showDetails={false}
                />
              </div>

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

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Edit Tip</h3>
                  <button
                    onClick={handleEditCancel}
                    className="p-2 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tip Title
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tip title..."
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Analysis & Reasoning
                    </label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                      placeholder="Share your analysis and reasoning..."
                      required
                    />
                  </div>

                  {/* Sport and Odds */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Sport
                      </label>
                      <select
                        value={editForm.sport}
                        onChange={(e) => setEditForm(prev => ({ ...prev, sport: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="American Football">American Football</option>
                        <option value="Badminton">Badminton</option>
                        <option value="Baseball">Baseball</option>
                        <option value="Basketball">Basketball</option>
                        <option value="Boxing">Boxing</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Cycling">Cycling</option>
                        <option value="Darts">Darts</option>
                        <option value="Esports">Esports</option>
                        <option value="Football">Football</option>
                        <option value="Formula 1">Formula 1</option>
                        <option value="Golf">Golf</option>
                        <option value="Greyhound Racing">Greyhound Racing</option>
                        <option value="Hockey">Hockey</option>
                        <option value="Horse Racing">Horse Racing</option>
                        <option value="MLB">MLB</option>
                        <option value="MMA">MMA</option>
                        <option value="MotoGP">MotoGP</option>
                        <option value="NBA">NBA</option>
                        <option value="NHL">NHL</option>
                        <option value="Rugby">Rugby</option>
                        <option value="Snooker">Snooker</option>
                        <option value="Table Tennis">Table Tennis</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Volleyball">Volleyball</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Odds (Optional)
                      </label>
                      <input
                        type="text"
                        value={editForm.odds}
                        onChange={(e) => setEditForm(prev => ({ ...prev, odds: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2.5, 3/1, +150"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.tags}
                      onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., prediction, analysis, hot-tip"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      disabled={isUpdating}
                      className="px-4 py-2 text-slate-300 hover:text-white transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating || !editForm.title.trim() || !editForm.content.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Tip'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </article>
    </AsyncErrorBoundary>
  );
});

export default PostCard;
