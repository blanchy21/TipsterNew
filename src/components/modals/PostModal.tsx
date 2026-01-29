'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, X, ChevronDown, Send } from 'lucide-react';
import { Post } from '@/lib/types';
import { sports } from './post-modal/constants';
import RichTextEditor from './post-modal/RichTextEditor';

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => void;
  selectedSport?: string;
}

export default function PostModal({ open, onClose, onSubmit, selectedSport }: PostModalProps) {
  const [sport, setSport] = useState('Football');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [odds, setOdds] = useState('');
  const [tags, setTags] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);

  useEffect(() => {
    if (open) {
      setSport(selectedSport && selectedSport !== 'All Sports' ? selectedSport : 'Football');
      setTitle('');
      setContent('');
      setOdds('');
      setTags('');
      setGameDate('');
      setEditorResetKey(prev => prev + 1);
    }
  }, [open, selectedSport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    if (content.length > 1000000) {
      alert('Content is too large. Please reduce the image size or remove some images.');
      return;
    }

    onSubmit({
      sport,
      title: title.trim(),
      content: content,
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
      <div className="relative w-full max-w-4xl bg-surface-1/95 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">Share Tip</h2>
              <p className="text-sm text-zinc-400">Share your sports tip with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Sport
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSportDropdown(!showSportDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span className="text-zinc-200">{sport}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showSportDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSportDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-2 border border-white/20 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                    {sports.map((sportOption) => (
                      <button
                        key={sportOption}
                        type="button"
                        onClick={() => {
                          setSport(sportOption);
                          setShowSportDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors text-zinc-200"
                      >
                        {sportOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your tip about?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-zinc-200 placeholder:text-zinc-500"
                required
              />
            </div>

            <RichTextEditor
              onContentChange={setContent}
              resetKey={editorResetKey}
            />

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Odds (Fractional or Decimal)
              </label>
              <input
                type="text"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="e.g., 2/1 or 3.0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-zinc-200 placeholder:text-zinc-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-zinc-200"
              />
              <p className="text-xs text-zinc-500 mt-1">When does the game/event take place?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., football, analysis, premier-league"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-zinc-200 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
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
