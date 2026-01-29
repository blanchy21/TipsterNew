'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Smile, Image as ImageIcon, Upload } from 'lucide-react';
import EmojiPicker from './EmojiPicker';
import GifPicker from './GifPicker';

interface RichTextEditorProps {
  onContentChange: (html: string) => void;
  resetKey: number;
}

export default function RichTextEditor({ onContentChange, resetKey }: RichTextEditorProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset editor content when resetKey changes
  useEffect(() => {
    if (contentRef.current) {
      // Clear user-generated content from the contentEditable editor
      contentRef.current.textContent = '';
    }
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  }, [resetKey]);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const emojiPickerEl = document.querySelector('[data-emoji-picker]');
      const gifPickerEl = document.querySelector('[data-gif-picker]');

      if (showEmojiPicker) {
        if (contentRef.current && !contentRef.current.contains(target) &&
          (!emojiPickerEl || !emojiPickerEl.contains(target))) {
          setShowEmojiPicker(false);
        }
      }

      if (showGifPicker) {
        if (contentRef.current && !contentRef.current.contains(target) &&
          (!gifPickerEl || !gifPickerEl.contains(target))) {
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

  const triggerContentChange = () => {
    if (contentRef.current) {
      // Read the HTML from the user's own contentEditable div (user-generated content only)
      const editorContent = contentRef.current.cloneNode(true) as HTMLElement;
      onContentChange(editorContent.innerHTML || '');
    }
  };

  const insertEmoji = (emoji: string) => {
    if (contentRef.current) {
      contentRef.current.focus();
      const success = document.execCommand('insertText', false, emoji);
      if (!success) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(emoji);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          const range = document.createRange();
          range.selectNodeContents(contentRef.current);
          range.collapse(false);
          const textNode = document.createTextNode(emoji);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
      triggerContentChange();
    }
    setShowEmojiPicker(false);
  };

  const insertMediaElement = (src: string, alt: string) => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.maxWidth = '200px';
    img.style.height = 'auto';
    img.style.margin = '4px';
    img.style.borderRadius = '4px';

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      range.insertNode(img);
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    triggerContentChange();
  };

  const insertGif = (gif: any) => {
    insertMediaElement(gif.images.fixed_height.url, gif.title);
    setShowGifPicker(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgEl = new window.Image();

    imgEl.onload = () => {
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = imgEl;

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
      ctx?.drawImage(imgEl, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      insertMediaElement(compressedDataUrl, 'Uploaded image');
    };

    imgEl.src = URL.createObjectURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-2">
        Sports Tip Details
      </label>

      {/* Formatting Toolbar */}
      <div className="relative flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-t-lg border-b-0">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${isBold ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${isItalic ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${isUnderline ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'}`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${showEmojiPicker ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'}`}
          title="Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowGifPicker(!showGifPicker)}
          className={`p-2 rounded hover:bg-white/10 transition-colors ${showGifPicker ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'}`}
          title="GIF"
        >
          <ImageIcon className="w-4 h-4" />
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
      {showEmojiPicker && <EmojiPicker onSelect={insertEmoji} />}

      {/* GIF Picker */}
      {showGifPicker && <GifPicker onSelect={insertGif} />}

      {/* Rich Text Editor */}
      <div
        ref={contentRef}
        contentEditable
        onInput={triggerContentChange}
        onKeyUp={updateFormattingState}
        onMouseUp={updateFormattingState}
        className="w-full min-h-[300px] px-4 py-3 bg-white/5 border border-white/10 rounded-b-lg focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none text-slate-200 resize-none overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-slate-500 empty:before:pointer-events-none"
        style={{ minHeight: '300px' }}
        data-placeholder="Share your sports tip details, analysis, or reasoning..."
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
