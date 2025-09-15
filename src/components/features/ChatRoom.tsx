'use client';

import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { Send, Users, MessageCircle, Clock } from 'lucide-react';
import Image from 'next/image';

interface ChatMessage {
    id: string;
    text: string;
    createdAt: any;
    user: {
        id: string;
        name: string;
        handle: string;
        avatar: string;
    };
    gameId?: string;
    sport?: string;
}

interface ChatRoomProps {
    gameId?: string;
    sport?: string;
    title?: string;
    className?: string;
}

export default function ChatRoom({ gameId, sport, title = "Live Chat", className = '' }: ChatRoomProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Set up real-time listener for messages
    useEffect(() => {
        if (!user) return;

        let messagesQuery;

        if (gameId) {
            // Game-specific chat
            messagesQuery = query(
                collection(db, 'chatMessages'),
                where('gameId', '==', gameId),
                orderBy('createdAt', 'asc'),
                limit(100)
            );
        } else if (sport) {
            // Sport-specific chat - simplified query to avoid index requirement
            messagesQuery = query(
                collection(db, 'chatMessages'),
                where('sport', '==', sport),
                limit(100)
            );
        } else {
            // General chat - only show messages with no sport and no gameId
            messagesQuery = query(
                collection(db, 'chatMessages'),
                where('gameId', '==', null),
                where('sport', '==', null),
                limit(100)
            );
        }

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
            })) as ChatMessage[];

            // Sort messages by creation time on the client side
            messagesData.sort((a, b) => {
                const aTime = a.createdAt?.getTime?.() || 0;
                const bTime = b.createdAt?.getTime?.() || 0;
                return aTime - bTime;
            });

            setMessages(messagesData);
            setIsLoading(false);
        }, (error) => {
            // Console statement removed for production
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, gameId, sport]);

    // Set up online users count (simplified - in production you'd use presence)
    useEffect(() => {
        const interval = setInterval(() => {
            setOnlineUsers(Math.floor(Math.random() * 50) + 10); // Mock online count
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(collection(db, 'chatMessages'), {
                text: newMessage.trim(),
                createdAt: serverTimestamp(),
                user: {
                    id: user.uid,
                    name: user.displayName || 'Anonymous',
                    handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
                    avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
                },
                gameId: gameId || null,
                sport: sport || null
            });

            setNewMessage('');
        } catch (error) {
            // Console statement removed for production
        }
    };

    const formatTime = (timestamp: Date) => {
        return timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp: Date) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return messageDate.toLocaleDateString() === now.toLocaleDateString()
                ? 'Today'
                : 'Yesterday';
        } else {
            return messageDate.toLocaleDateString();
        }
    };

    if (!user) {
        return (
            <div className={`flex items-center justify-center h-64 bg-slate-800/50 rounded-lg ${className}`}>
                <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Please sign in to join the chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-slate-800/30 rounded-lg border border-white/10 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {onlineUsers} online
                        </p>
                    </div>
                </div>
                {sport && (
                    <div className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-sm font-medium">
                        {sport}
                    </div>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isCurrentUser = message.user.id === user.uid;
                        const prevMessage = index > 0 ? messages[index - 1] : null;
                        const showAvatar = !prevMessage || prevMessage.user.id !== message.user.id;
                        const showDate = !prevMessage ||
                            formatDate(prevMessage.createdAt) !== formatDate(message.createdAt);

                        return (
                            <div key={message.id}>
                                {showDate && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-400">
                                            {formatDate(message.createdAt)}
                                        </div>
                                    </div>
                                )}

                                <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {showAvatar && (
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 ${isCurrentUser ? 'order-1' : ''}`}>
                                            <Image
                                                src={message.user.avatar}
                                                alt={message.user.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                        {showAvatar && (
                                            <div className={`text-xs text-slate-400 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                {message.user.name} • {message.user.handle}
                                            </div>
                                        )}

                                        <div
                                            className={`inline-block max-w-[70%] rounded-2xl px-4 py-2 ${isCurrentUser
                                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                                                : 'bg-white/10 text-slate-100'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                        </div>

                                        <div className={`text-xs text-slate-400 mt-1 flex items-center gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                            <Clock className="w-3 h-3" />
                                            {formatTime(message.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="text-xs text-slate-400 mt-2 text-center">
                    Press Enter to send • {newMessage.length}/500 characters
                </div>
            </div>
        </div>
    );
}
