'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bold, Italic, Underline, Smile } from 'lucide-react';
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

// Emoji categories for the picker
const emojiCategories = {
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '🎯', '🏹', '🎣', '🤸', '🤾', '🏋️', '🚴', '🏇', '🏊', '🏄', '🏃', '🤺', '🥊', '🥋', '🎽', '🏅', '🥇', '🥈', '🥉', '🏆', '🏵️', '🎖️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌉', '🌁', '🚠', '🚡', '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🛻', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪'],
  general: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '👤', '👥', '🫂', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦠', '💊', '💉', '🩹', '🩺', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧵', '🧶', '🪡', '🪢', '🪣', '🧽', '🧯', '🛒', '🛍️', '🛎️', '🧾', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🪤', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🩻', '🩼', '🦽', '🦼', '🦯', '🦮', '🦺', '🦿', '🦾', '🦵', '🦶', '🦴', '🦷', '🦻', '🦳', '🦲', '🦱', '🦰', '🦸', '🦹', '🦷', '🦴', '🦵', '🦶', '🦿', '🦾', '🦺', '🦮', '🦯', '🦼', '🦽', '🩼', '🩻', '🩺', '🩹', '💊', '🩸', '💉', '📡', '🔭', '🔬', '🧬', '🧫', '🧪', '⚗️', '🧲', '🧰', '🪤', '⚙️', '🔩', '🪛', '🔧', '🪚', '🛡️', '🏹', '🪃', '🔫', '⚔️', '🗡️', '🛠️', '⚒️', '⛏️', '🪓', '🔨', '🗝️', '🔑', '🔐', '🔏', '🔓', '🔒', '🗑️', '🗄️', '🗃️', '✂️', '📐', '📏', '🖇️', '📎', '📍', '📌', '📋', '🧾', '🛎️', '🛍️', '🛒', '🧯', '🧽', '🪣', '🪢', '🪡', '🧶', '🧵', '🧸', '🧷', '🧴', '🛀', '🛁', '🚿', '🚰', '🚽', '🧻', '🧺', '🧹', '🌡️', '🧪', '🧫', '🧬', '🦠', '🩸', '💊', '💉', '🩹', '🩺', '🩻', '🩼', '🦽', '🦼', '🦯', '🦮', '🦺', '🦿', '🦾', '🦵', '🦶', '🦴', '🦷', '🦻', '🦳', '🦲', '🦱', '🦰', '🦸', '🦹'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💥', '💢', '💨', '💦', '💧', '🌊', '🌪️', '🌩️', '⛈️', '🌦️', '🌧️', '🌤️', '⛅', '☀️', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌍', '🌎', '🌏', '🌋', '🏔️', '⛰️', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌉', '🌁', '🚠', '🚡', '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🛻', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪']
};

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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker) {
        const target = event.target as Node;
        const emojiPicker = document.querySelector('[data-emoji-picker]');

        // Only close if clicking outside both the content area and emoji picker
        if (contentRef.current && !contentRef.current.contains(target) &&
          (!emojiPicker || !emojiPicker.contains(target))) {
          setShowEmojiPicker(false);
        }
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    contentRef.current?.focus();
    updateFormattingState();
  };

  const updateFormattingState = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));
  };

  const insertEmoji = (emoji: string) => {
    if (contentRef.current) {
      // Focus the contentEditable div first
      contentRef.current.focus();

      // Try using execCommand first (more reliable for contentEditable)
      const success = document.execCommand('insertText', false, emoji);

      if (!success) {
        // Fallback to manual insertion
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
          // If there's a selection, insert at the cursor position
          const range = selection.getRangeAt(0);
          range.deleteContents();

          // Create a text node with the emoji
          const textNode = document.createTextNode(emoji);
          range.insertNode(textNode);

          // Move cursor after the inserted emoji
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // If no selection, append to the end
          const range = document.createRange();
          range.selectNodeContents(contentRef.current);
          range.collapse(false);

          const textNode = document.createTextNode(emoji);
          range.insertNode(textNode);

          // Move cursor after the inserted emoji
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }

      // Trigger the content change handler
      handleContentChange();
    }
    setShowEmojiPicker(false);
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      // Get the text content directly, which preserves emojis better
      const textContent = contentRef.current.textContent || contentRef.current.innerText || '';
      setContent(textContent);
    }
  };

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
          {/* Formatting Toolbar */}
          <div className="relative flex items-center gap-2 p-2 bg-slate-800/30 border border-slate-600 rounded-t-lg border-b-0">
            <button
              type="button"
              onClick={() => handleFormat('bold')}
              className={`p-2 rounded hover:bg-white/10 transition-colors ${isBold ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat('italic')}
              className={`p-2 rounded hover:bg-white/10 transition-colors ${isItalic ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat('underline')}
              className={`p-2 rounded hover:bg-white/10 transition-colors ${isUnderline ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 rounded hover:bg-white/10 transition-colors ${showEmojiPicker ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                }`}
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              className="absolute z-20 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-xl p-4 max-w-sm max-h-80 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-emoji-picker
            >
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Sports</h4>
                  <div className="flex flex-wrap gap-1">
                    {emojiCategories.sports.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 text-lg hover:bg-white/10 rounded transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">General</h4>
                  <div className="flex flex-wrap gap-1">
                    {emojiCategories.general.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 text-lg hover:bg-white/10 rounded transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Symbols</h4>
                  <div className="flex flex-wrap gap-1">
                    {emojiCategories.symbols.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="p-2 text-lg hover:bg-white/10 rounded transition-colors"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rich Text Editor */}
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onKeyUp={updateFormattingState}
            onMouseUp={updateFormattingState}
            onKeyDown={handleKeyDown}
            className="w-full bg-slate-800/50 border border-slate-600 rounded-b-lg px-3 py-2 text-slate-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-slate-400 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500 empty:before:pointer-events-none"
            style={{ minHeight: isReply ? '48px' : '72px' }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
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
