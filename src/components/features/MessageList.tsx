'use client';

import React from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp?: string;
}

interface MessageListProps {
    messages: Message[];
    isLoading?: boolean;
    className?: string;
}

export default function MessageList({ messages, isLoading = false, className = '' }: MessageListProps) {
    const [copiedMessageId, setCopiedMessageId] = React.useState<string | null>(null);

    const copyToClipboard = async (content: string, messageId: string) => {
        try {
            await navigator.clipboard.writeText(content);
            setCopiedMessageId(messageId);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            // Console statement removed for production
        }
    };

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessage = (message: Message) => {
        const isUser = message.role === 'user';
        const isCopied = copiedMessageId === message.id;

        return (
            <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                )}

                <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 group relative ${isUser
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                        : 'bg-white/10 backdrop-blur-sm text-slate-100 border border-white/20'
                        }`}
                >
                    <div className="text-sm leading-relaxed">
                        {isUser ? (
                            <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                            <ReactMarkdown
                                className="prose prose-invert prose-sm max-w-none"
                                components={{
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-white">{children}</h3>,
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li className="text-slate-200">{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                    em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                                    code: ({ children }) => (
                                        <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono text-slate-200">
                                            {children}
                                        </code>
                                    ),
                                    pre: ({ children }) => (
                                        <pre className="bg-white/10 p-3 rounded-lg overflow-x-auto text-xs font-mono text-slate-200 mb-2">
                                            {children}
                                        </pre>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-sky-500 pl-4 italic text-slate-300 mb-2">
                                            {children}
                                        </blockquote>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${isUser ? 'text-sky-100' : 'text-slate-400'}`}>
                            {formatTime(message.timestamp)}
                        </p>

                        <button
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 ${isUser ? 'text-sky-100' : 'text-slate-400'
                                }`}
                            title="Copy message"
                        >
                            {isCopied ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </button>
                    </div>
                </div>

                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}>
            {messages.map(renderMessage)}

            {isLoading && (
                <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm text-slate-100 border border-white/20 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
