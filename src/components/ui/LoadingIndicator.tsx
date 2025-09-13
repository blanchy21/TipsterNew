'use client';

import React from 'react';
import { Bot } from 'lucide-react';

interface LoadingIndicatorProps {
    message?: string;
    className?: string;
}

export default function LoadingIndicator({ message = "AI is thinking...", className = '' }: LoadingIndicatorProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-slate-100 border border-white/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-300 ml-2">{message}</span>
                </div>
            </div>
        </div>
    );
}
