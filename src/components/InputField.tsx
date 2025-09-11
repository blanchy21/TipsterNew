'use client';

import React, { useRef, useState } from 'react';
import { Send, Smile, Paperclip, Square } from 'lucide-react';

interface InputFieldProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onStop?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
}

export default function InputField({
    value,
    onChange,
    onSend,
    onStop,
    disabled = false,
    isLoading = false,
    placeholder = "Ask about sports analysis, predictions, or insights...",
    className = ''
}: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled && !isLoading) {
                onSend();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !disabled && !isLoading) {
            onSend();
        }
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    };

    React.useEffect(() => {
        adjustTextareaHeight();
    }, [value]);

    return (
        <div className={`p-4 border-t border-white/10 bg-slate-800/50 backdrop-blur-sm ${className}`}>
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                    disabled={disabled}
                >
                    <Paperclip className="w-5 h-5 text-slate-400" />
                </button>

                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className={`
              w-full bg-white/10 border rounded-2xl px-4 py-3 pr-12 text-white placeholder-slate-400 
              focus:outline-none transition-all resize-none overflow-hidden
              ${isFocused
                                ? 'border-sky-500/50 ring-2 ring-sky-500/50'
                                : 'border-white/20 hover:border-white/30'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />

                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
                        disabled={disabled}
                    >
                        <Smile className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {isLoading && onStop ? (
                    <button
                        type="button"
                        onClick={onStop}
                        className="p-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all flex-shrink-0"
                        title="Stop generating"
                    >
                        <Square className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        type="submit"
                        disabled={!value.trim() || disabled || isLoading}
                        className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                )}
            </form>

            <div className="mt-2 text-xs text-slate-400 text-center">
                Press Enter to send, Shift+Enter for new line
            </div>
        </div>
    );
}
