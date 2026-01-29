'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import { fallbackGifs } from './constants';

interface GifPickerProps {
  onSelect: (gif: any) => void;
}

function getFallbackGifsForQuery(query: string) {
  if (!query.trim()) {
    const shuffled = [...fallbackGifs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }

  const searchQuery = query.toLowerCase();
  let relevantGifs = [];

  if (searchQuery.includes('happy') || searchQuery.includes('smile') || searchQuery.includes('joy')) {
    relevantGifs = fallbackGifs.filter(gif => gif.title.toLowerCase().includes('happy'));
  } else if (searchQuery.includes('sport') || searchQuery.includes('football') || searchQuery.includes('basketball')) {
    relevantGifs = fallbackGifs.filter(gif =>
      gif.title.toLowerCase().includes('sports') ||
      gif.title.toLowerCase().includes('football') ||
      gif.title.toLowerCase().includes('basketball')
    );
  } else if (searchQuery.includes('win') || searchQuery.includes('victory') || searchQuery.includes('success')) {
    relevantGifs = fallbackGifs.filter(gif =>
      gif.title.toLowerCase().includes('win') ||
      gif.title.toLowerCase().includes('victory') ||
      gif.title.toLowerCase().includes('success')
    );
  } else if (searchQuery.includes('celebrat') || searchQuery.includes('party') || searchQuery.includes('excit')) {
    relevantGifs = fallbackGifs.filter(gif =>
      gif.title.toLowerCase().includes('celebration') ||
      gif.title.toLowerCase().includes('excited')
    );
  }

  if (relevantGifs.length > 0) return relevantGifs;

  const shuffled = [...fallbackGifs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 6);
}

export default function GifPicker({ onSelect }: GifPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchGifs = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY || '';
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );

      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();
      setGifs(data.data || []);
    } catch {
      setGifs(getFallbackGifsForQuery(query));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="absolute z-20 mt-1 bg-surface-2 border border-white/20 rounded-lg shadow-xl p-4 max-w-md max-h-80 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
      data-gif-picker
    >
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-zinc-200 mb-2">Search GIFs</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for GIFs..."
              className="flex-1 px-3 py-2 bg-surface-3 border border-zinc-600 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-zinc-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchGifs(searchTerm);
                }
              }}
            />
            <button
              type="button"
              onClick={() => searchGifs(searchTerm)}
              disabled={isLoading || !searchTerm.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition"
            >
              {isLoading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {gifs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-200 mb-2">Results</h4>
            <div className="grid grid-cols-2 gap-2">
              {gifs.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => onSelect(gif)}
                  className="relative group rounded-lg overflow-hidden hover:ring-2 hover:ring-primary/50 transition"
                >
                  <NextImage
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    width={gif.images.fixed_height_small.width}
                    height={gif.images.fixed_height_small.height}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {searchTerm && gifs.length === 0 && !isLoading && (
          <div className="text-center text-zinc-400 text-sm py-4">
            No GIFs found for &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
