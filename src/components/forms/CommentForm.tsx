'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { createComment } from '@/lib/firebase/firebaseUtils';
import { CommentFormData } from '@/lib/types';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
  placeholder?: string;
  isReply?: boolean;
}

export default function CommentForm({ 
  postId, 
  parentId, 
  onCommentAdded, 
  onCancel,
  placeholder = "Write a comment...",
  isReply = false
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const commentData: CommentFormData = {
        content: content.trim()
      };
      
      // Only add parentId if it exists
      if (parentId) {
        commentData.parentId = parentId;
      }

      await createComment(postId, user.uid, commentData);
      setContent('');
      onCommentAdded();
    } catch (error) {
      // Console statement removed for production
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-slate-400 text-sm">
        Please sign in to comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-slate-400"
            rows={isReply ? 2 : 3}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Press Cmd+Enter to submit
        </div>
        
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="p-2 rounded-md hover:bg-white/5 transition text-slate-400 hover:text-slate-200 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : (isReply ? 'Reply' : 'Comment')}
          </button>
        </div>
      </div>
    </form>
  );
}
