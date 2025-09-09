'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { Comment } from '@/lib/types';
import { getCommentsByPostId, updateComment } from '@/lib/firebase/firebaseUtils';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentsListProps {
  postId: string;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentsList({ postId, onCommentCountChange }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getCommentsByPostId(postId);
      setComments(fetchedComments);
      onCommentCountChange?.(fetchedComments.length);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCommentAdded = () => {
    loadComments();
    setReplyingTo(null);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    onCommentCountChange?.(comments.length - 1);
  };

  const handleCommentEdited = async (commentId: string, newContent: string) => {
    try {
      await updateComment(commentId, newContent);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: newContent, isEdited: true, editedAt: new Date().toISOString() }
            : comment
        )
      );
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleEdit = (commentId: string) => {
    setEditingComment(commentId);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      <div className="border-t border-slate-700/50 pt-4">
        <CommentForm
          postId={postId}
          onCommentAdded={handleCommentAdded}
          placeholder="Share your thoughts on this tip..."
        />
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  onDelete={handleCommentDeleted}
                  onReply={handleReply}
                  onEdit={handleCommentEdited}
                />

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-3 ml-8 border-l border-slate-700/50 pl-4">
                    <CommentForm
                      postId={postId}
                      parentId={comment.id}
                      onCommentAdded={handleCommentAdded}
                      onCancel={handleCancelReply}
                      placeholder={`Reply to ${comment.user.name}...`}
                      isReply={true}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
