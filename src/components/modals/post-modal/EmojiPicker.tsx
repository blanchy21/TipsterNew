'use client';

import React from 'react';
import { emojiCategories } from './constants';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
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
                onClick={() => onSelect(emoji)}
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
                onClick={() => onSelect(emoji)}
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
                onClick={() => onSelect(emoji)}
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
  );
}
