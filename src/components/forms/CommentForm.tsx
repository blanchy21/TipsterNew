'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bold, Italic, Underline, Smile, Image, Upload } from 'lucide-react';
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
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearchTerm, setGifSearchTerm] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close emoji picker and GIF picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const emojiPicker = document.querySelector('[data-emoji-picker]');
      const gifPicker = document.querySelector('[data-gif-picker]');

      if (showEmojiPicker) {
        // Only close if clicking outside both the content area and emoji picker
        if (contentRef.current && !contentRef.current.contains(target) &&
          (!emojiPicker || !emojiPicker.contains(target))) {
          setShowEmojiPicker(false);
        }
      }

      if (showGifPicker) {
        // Only close if clicking outside both the content area and GIF picker
        if (contentRef.current && !contentRef.current.contains(target) &&
          (!gifPicker || !gifPicker.contains(target))) {
          setShowGifPicker(false);
        }
      }
    };

    if (showEmojiPicker || showGifPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker, showGifPicker]);

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

  const searchGifs = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingGifs(true);
    try {
      // Use environment variable for API key, fallback to demo key
      const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY || 'dc6zaTOxFJmzC';
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=20&rating=g`
      );

      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('Error searching GIFs:', error);
      // Fallback to local GIF collection when API fails
      setGifs(getFallbackGifs(query));
    } finally {
      setIsLoadingGifs(false);
    }
  };

  // Fallback GIF collection for when API is unavailable
  const getFallbackGifs = (query: string) => {
    const fallbackGifs = [
      {
        id: 'happy-1',
        title: 'Happy',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
        }
      },
      {
        id: 'excited-1',
        title: 'Excited',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
        }
      },
      {
        id: 'celebration-1',
        title: 'Celebration',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/100.gif' }
        }
      },
      {
        id: 'sports-1',
        title: 'Sports',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/100.gif' }
        }
      },
      {
        id: 'win-1',
        title: 'Win',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
        }
      },
      {
        id: 'victory-1',
        title: 'Victory',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
        }
      },
      {
        id: 'football-1',
        title: 'Football',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/100.gif' }
        }
      },
      {
        id: 'basketball-1',
        title: 'Basketball',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/100.gif' }
        }
      },
      {
        id: 'success-1',
        title: 'Success',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/100.gif' }
        }
      },
      {
        id: 'thumbs-up-1',
        title: 'Thumbs Up',
        images: {
          fixed_height: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/giphy.gif' },
          fixed_height_small: { url: 'https://media.giphy.com/media/3o6Zt4HUhqJqJqJqJq/100.gif' }
        }
      }
    ];

    // If no query, return a random selection
    if (!query.trim()) {
      const shuffled = [...fallbackGifs].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    }

    const searchQuery = query.toLowerCase();

    // Create different GIF sets based on search terms
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
    } else {
      // For any other search, return a random selection
      const shuffled = [...fallbackGifs].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    }

    // If we found relevant GIFs, return them, otherwise return random selection
    if (relevantGifs.length > 0) {
      return relevantGifs;
    } else {
      const shuffled = [...fallbackGifs].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 6);
    }
  };

  const insertGif = (gif: any) => {
    if (contentRef.current) {
      // Focus the contentEditable div first
      contentRef.current.focus();

      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        // If there's a selection, insert at the cursor position
        const range = selection.getRangeAt(0);
        range.deleteContents();

        // Create an image element with the GIF
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
        img.style.margin = '4px';
        img.style.borderRadius = '4px';

        range.insertNode(img);

        // Move cursor after the inserted GIF
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // If no selection, append to the end
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);

        // Create an image element with the GIF
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
        img.style.margin = '4px';
        img.style.borderRadius = '4px';

        range.insertNode(img);

        // Move cursor after the inserted GIF
        range.setStartAfter(img);
        range.setEndAfter(img);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Trigger the content change handler
      handleContentChange();
    }
    setShowGifPicker(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Compress image before uploading
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      // Calculate new dimensions (max 800px width, maintain aspect ratio)
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality

      console.log('Original size:', file.size, 'bytes');
      console.log('Compressed size:', compressedDataUrl.length, 'bytes');

      insertImage(compressedDataUrl);
    };

    img.src = URL.createObjectURL(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertImage = (imageUrl: string) => {
    if (contentRef.current) {
      contentRef.current.focus();

      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Uploaded image';
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
        img.style.margin = '4px';
        img.style.borderRadius = '4px';

        range.insertNode(img);

        range.setStartAfter(img);
        range.setEndAfter(img);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        range.collapse(false);

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Uploaded image';
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
        img.style.margin = '4px';
        img.style.borderRadius = '4px';

        range.insertNode(img);

        range.setStartAfter(img);
        range.setEndAfter(img);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      handleContentChange();
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      // Get the HTML content to preserve images and formatting
      const htmlContent = contentRef.current.innerHTML || '';
      setContent(htmlContent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !content.trim() || isSubmitting) return;

    // Check if content is too large (Firestore limit is 1MB)
    if (content.length > 1000000) {
      console.error('Content too large for Firestore:', content.length, 'bytes');
      alert('Content is too large. Please reduce the image size or remove some images.');
      return;
    }

    setIsSubmitting(true);

    try {
      const commentData: CommentFormData = {
        content: content // Don't trim HTML content
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
            <button
              type="button"
              onClick={() => setShowGifPicker(!showGifPicker)}
              className={`p-2 rounded hover:bg-white/10 transition-colors ${showGifPicker ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
                }`}
              title="GIF"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded hover:bg-white/10 transition-colors text-slate-400"
              title="Upload Image"
            >
              <Upload className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
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

          {/* GIF Picker */}
          {showGifPicker && (
            <div
              className="absolute z-20 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-xl p-4 max-w-md max-h-80 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-gif-picker
            >
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Search GIFs</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={gifSearchTerm}
                      onChange={(e) => setGifSearchTerm(e.target.value)}
                      placeholder="Search for GIFs..."
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          searchGifs(gifSearchTerm);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => searchGifs(gifSearchTerm)}
                      disabled={isLoadingGifs || !gifSearchTerm.trim()}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition"
                    >
                      {isLoadingGifs ? '...' : 'Search'}
                    </button>
                  </div>
                </div>

                {gifs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Results</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {gifs.map((gif) => (
                        <button
                          key={gif.id}
                          type="button"
                          onClick={() => insertGif(gif)}
                          className="relative group rounded-lg overflow-hidden hover:ring-2 hover:ring-sky-500/50 transition"
                        >
                          <img
                            src={gif.images.fixed_height_small.url}
                            alt={gif.title}
                            className="w-full h-20 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {gifSearchTerm && gifs.length === 0 && !isLoadingGifs && (
                  <div className="text-center text-slate-400 text-sm py-4">
                    No GIFs found for "{gifSearchTerm}"
                  </div>
                )}
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
