'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, X, ChevronDown, Send, Bold, Italic, Underline, Smile } from 'lucide-react';
import { Post } from '@/lib/types';

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => void;
  selectedSport?: string;
}

const sports = [
  'American Football',
  'Badminton',
  'Baseball',
  'Basketball',
  'Boxing',
  'Cricket',
  'Cycling',
  'Darts',
  'Esports',
  'Football',
  'Formula 1',
  'Golf',
  'Greyhound Racing',
  'Hockey',
  'Horse Racing',
  'MLB',
  'MMA',
  'MotoGP',
  'NBA',
  'NHL',
  'Rugby',
  'Snooker',
  'Table Tennis',
  'Tennis',
  'Volleyball'
];

// Emoji categories for the picker
const emojiCategories = {
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '🎯', '🏹', '🎣', '🤸', '🤾', '🏋️', '🚴', '🏇', '🏊', '🏄', '🏃', '🤺', '🥊', '🥋', '🎽', '🏅', '🥇', '🥈', '🥉', '🏆', '🏵️', '🎖️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌉', '🌁', '🚠', '🚡', '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🛻', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪'],
  general: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '👤', '👥', '🫂', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '🦠', '💊', '💉', '🩹', '🩺', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧵', '🧶', '🪡', '🪢', '🪣', '🧽', '🧯', '🛒', '🛍️', '🛎️', '🧾', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🪤', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🩻', '🩼', '🦽', '🦼', '🦯', '🦮', '🦺', '🦿', '🦾', '🦵', '🦶', '🦴', '🦷', '🦻', '🦳', '🦲', '🦱', '🦰', '🦸', '🦹', '🦷', '🦴', '🦵', '🦶', '🦿', '🦾', '🦺', '🦮', '🦯', '🦼', '🦽', '🩼', '🩻', '🩺', '🩹', '💊', '🩸', '💉', '📡', '🔭', '🔬', '🧬', '🧫', '🧪', '⚗️', '🧲', '🧰', '🪤', '⚙️', '🔩', '🪛', '🔧', '🪚', '🛡️', '🏹', '🪃', '🔫', '⚔️', '🗡️', '🛠️', '⚒️', '⛏️', '🪓', '🔨', '🗝️', '🔑', '🔐', '🔏', '🔓', '🔒', '🗑️', '🗄️', '🗃️', '✂️', '📐', '📏', '🖇️', '📎', '📍', '📌', '📋', '🧾', '🛎️', '🛍️', '🛒', '🧯', '🧽', '🪣', '🪢', '🪡', '🧶', '🧵', '🧸', '🧷', '🧴', '🛀', '🛁', '🚿', '🚰', '🚽', '🧻', '🧺', '🧹', '🌡️', '🧪', '🧫', '🧬', '🦠', '🩸', '💊', '💉', '🩹', '🩺', '🩻', '🩼', '🦽', '🦼', '🦯', '🦮', '🦺', '🦿', '🦾', '🦵', '🦶', '🦴', '🦷', '🦻', '🦳', '🦲', '🦱', '🦰', '🦸', '🦹'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '⭐', '🌟', '💫', '✨', '⚡', '🔥', '💥', '💢', '💨', '💦', '💧', '🌊', '🌪️', '🌩️', '⛈️', '🌦️', '🌧️', '🌤️', '⛅', '☀️', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌍', '🌎', '🌏', '🌋', '🏔️', '⛰️', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌉', '🌁', '🚠', '🚡', '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🛻', '🚁', '🚟', '🚠', '🚡', '🎠', '🎡', '🎢', '💈', '🎪'],
  flags: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧', '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼']
};

export default function PostModal({ open, onClose, onSubmit, selectedSport }: PostModalProps) {
  const [sport, setSport] = useState('Football');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [odds, setOdds] = useState('');
  const [tags, setTags] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Use the selected sport from sidebar, or default to Football
      setSport(selectedSport && selectedSport !== 'All Sports' ? selectedSport : 'Football');
      setTitle('');
      setContent('');
      setOdds('');
      setTags('');
      setGameDate('');
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setShowEmojiPicker(false);
    }
  }, [open, selectedSport]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    onSubmit({
      sport,
      title: title.trim(),
      content: content.trim(),
      tags: tagArray,
      odds: odds.trim(),
      gameDate: gameDate.trim(),
      tipStatus: 'pending' as const,
      isGameFinished: false
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Share Tip</h2>
              <p className="text-sm text-slate-400">Share your sports tip with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Sport
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSportDropdown(!showSportDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-slate-200">{sport}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSportDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSportDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                    {sports.map((sportOption) => (
                      <button
                        key={sportOption}
                        type="button"
                        onClick={() => {
                          setSport(sportOption);
                          setShowSportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-slate-200"
                      >
                        {sportOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your tip about?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Sports Tip Details
              </label>

              {/* Formatting Toolbar */}
              <div className="relative flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-t-lg border-b-0">
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
                className="w-full min-h-[300px] px-4 py-3 bg-white/5 border border-white/10 rounded-b-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 resize-none overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500 empty:before:pointer-events-none"
                style={{ minHeight: '300px' }}
                data-placeholder="Share your sports tip details, analysis, or reasoning..."
                suppressContentEditableWarning={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Odds (Fractional or Decimal)
              </label>
              <input
                type="text"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="e.g., 2/1 or 3.0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Game Date & Time
              </label>
              <input
                type="datetime-local"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200"
              />
              <p className="text-xs text-slate-500 mt-1">When does the game/event take place?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., football, analysis, premier-league"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Share Tip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
