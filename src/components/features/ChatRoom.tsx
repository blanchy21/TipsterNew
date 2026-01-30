'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, limit, serverTimestamp, where, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { Send, Users, MessageCircle, Clock, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { getDefaultAvatar } from '@/lib/imageUtils';

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
    const [showScrollButton, setShowScrollButton] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isNearBottomRef = useRef(true);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShowScrollButton(false);
    }, []);

    // Check if user is near bottom of chat
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const threshold = 100;
        const isNear = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        isNearBottomRef.current = isNear;
        setShowScrollButton(!isNear);
    }, []);

    // Auto-scroll only if user is near bottom
    useEffect(() => {
        if (isNearBottomRef.current) {
            scrollToBottom();
        } else {
            setShowScrollButton(true);
        }
    }, [messages, scrollToBottom]);

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

    // Real-time presence tracking
    useEffect(() => {
        if (!user || !db) return;

        const channelKey = gameId || sport || 'general';
        const presenceRef = doc(db, 'chatPresence', `${channelKey}_${user.uid}`);

        // Mark user as online in this channel
        setDoc(presenceRef, {
            userId: user.uid,
            channel: channelKey,
            lastSeen: serverTimestamp()
        }).catch(() => {});

        // Listen for online users in this channel
        const presenceQuery = query(
            collection(db, 'chatPresence'),
            where('channel', '==', channelKey)
        );

        const unsubPresence = onSnapshot(presenceQuery, (snapshot) => {
            setOnlineUsers(snapshot.size);
        }, () => {});

        // Cleanup: remove presence on unmount
        return () => {
            deleteDoc(presenceRef).catch(() => {});
            unsubPresence();
        };
    }, [user, gameId, sport]);

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
                    avatar: user.photoURL || getDefaultAvatar()
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

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const msgDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

        if (msgDay.getTime() === today.getTime()) return 'Today';
        if (msgDay.getTime() === yesterday.getTime()) return 'Yesterday';
        return messageDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (!user) {
        return (
            <div className={`flex items-center justify-center h-64 bg-surface-2/50 rounded-lg ${className}`}>
                <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-400">Please sign in to join the chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-surface-2/30 rounded-lg border border-white/10 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-white truncate">{title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {onlineUsers} online
                        </p>
                    </div>
                </div>
                {sport && (
                    <div className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                        {sport}
                    </div>
                )}
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 relative"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-300 font-medium mb-1">No messages yet</p>
                        <p className="text-zinc-500 text-sm max-w-[240px]">Be the first to say something in {title}.</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isCurrentUser = message.user.id === user.uid;
                        const prevMessage = index > 0 ? messages[index - 1] : null;
                        const showAvatar = !isCurrentUser && (!prevMessage || prevMessage.user.id !== message.user.id);
                        const showName = !isCurrentUser && (!prevMessage || prevMessage.user.id !== message.user.id);
                        const showDate = !prevMessage ||
                            formatDate(prevMessage.createdAt) !== formatDate(message.createdAt);
                        // Add spacing between different users
                        const differentUser = prevMessage && prevMessage.user.id !== message.user.id;

                        return (
                            <div key={message.id} className={differentUser && !showDate ? 'pt-3' : ''}>
                                {showDate && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-surface-3/50 px-3 py-1 rounded-full text-xs text-zinc-500">
                                            {formatDate(message.createdAt)}
                                        </div>
                                    </div>
                                )}

                                <div className={`flex gap-2.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    {/* Avatar for other users only */}
                                    {!isCurrentUser && (
                                        <div className="w-7 h-7 rounded-full flex-shrink-0 mt-auto">
                                            {showAvatar ? (
                                                <Image
                                                    src={message.user.avatar}
                                                    alt={message.user.name}
                                                    width={28}
                                                    height={28}
                                                    className="rounded-full object-cover w-7 h-7"
                                                />
                                            ) : (
                                                <div className="w-7 h-7" /> // spacer for alignment
                                            )}
                                        </div>
                                    )}

                                    <div className={`max-w-[75%] sm:max-w-[65%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                                        {showName && (
                                            <span className="text-xs text-zinc-500 mb-0.5 ml-1">
                                                {message.user.name} <span className="text-zinc-600">{message.user.handle}</span>
                                            </span>
                                        )}

                                        <div
                                            className={`rounded-2xl px-3.5 py-2 ${isCurrentUser
                                                ? 'bg-accent text-white rounded-br-md'
                                                : 'bg-white/[0.08] text-zinc-100 rounded-bl-md'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                        </div>

                                        <span className="text-[10px] text-zinc-600 mt-0.5 mx-1">
                                            {formatTime(message.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />

                {/* Scroll to bottom button */}
                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="sticky bottom-2 left-1/2 -translate-x-1/2 mx-auto flex items-center gap-1.5 bg-surface-3 border border-white/10 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg hover:bg-surface-4 transition-colors"
                    >
                        <ArrowDown className="w-3 h-3" />
                        New messages
                    </button>
                )}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-white/10">
                <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm sm:text-base"
                        maxLength={500}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 sm:p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </form>
                <div className="text-xs text-zinc-400 mt-2 text-center">
                    Press Enter to send • {newMessage.length}/500 characters
                </div>
            </div>
        </div>
    );
}
