'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Conversation, Message, User } from '@/lib/types';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { subscribeToMessages, sendMessage, markMessagesAsRead, subscribeToUserPresence, setTypingStatus, subscribeToTypingStatus, PresenceData } from '@/lib/firebase/messagingUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { getDefaultAvatar } from '@/lib/imageUtils';

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUser: User;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  onStartNewConversation?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  onSendMessage,
  onBack,
  onStartNewConversation
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [otherUserPresence, setOtherUserPresence] = useState<PresenceData | null>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  // Set up real-time message listener
  useEffect(() => {
    if (!conversation || !user) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(conversation.id, (messagesData) => {
      setMessages(messagesData);
      setLoading(false);
    });

    // Mark messages as read when conversation is opened
    markMessagesAsRead(conversation.id, user.uid).catch(() => { });

    return () => unsubscribe();
  }, [conversation, user]);

  // Subscribe to other user's online presence
  useEffect(() => {
    if (!conversation) {
      setOtherUserPresence(null);
      return;
    }
    const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherUser) return;

    const unsubscribe = subscribeToUserPresence(otherUser.id, setOtherUserPresence);
    return () => unsubscribe();
  }, [conversation, currentUser.id]);

  // Subscribe to other user's typing status
  useEffect(() => {
    if (!conversation || !user) {
      setOtherUserTyping(false);
      return;
    }
    const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherUser) return;

    const unsubscribe = subscribeToTypingStatus(conversation.id, otherUser.id, setOtherUserTyping);
    return () => unsubscribe();
  }, [conversation, currentUser.id, user]);

  // Handle typing indicator - notify other user when we're typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!conversation || !user) return;

    // Set typing to true
    setTypingStatus(conversation.id, user.uid, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing to false after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      if (conversation && user) {
        setTypingStatus(conversation.id, user.uid, false);
      }
    }, 2000);
  };

  // Clean up typing status when conversation changes or unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    // Clear typing indicator
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingStatus(conversation.id, user.uid, false);

    try {
      await sendMessage(conversation.id, user.uid, messageText);
    } catch (error) {
      // Console statement removed for production
      // Restore message on error
      setNewMessage(messageText);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `Active ${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    return `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  const getOtherParticipant = () => {
    if (!conversation) return null;
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-xl">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-1 ring-indigo-500/20">
            <MessageCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Your Messages</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-5">
            Connect with other tipsters, share insights, and discuss picks privately.
          </p>
          {onStartNewConversation && (
            <button
              onClick={onStartNewConversation}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Start a conversation
            </button>
          )}
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>

          <div className="relative">
            <Image
              src={otherParticipant?.avatar || getDefaultAvatar()}
              alt={otherParticipant?.name || 'User'}
              width={40}
              height={40}
              className="rounded-full object-cover border-2 border-white/20"
            />
            {otherUserPresence?.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-surface-1" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white">{otherParticipant?.name}</h3>
            <p className="text-xs text-zinc-400">
              {otherUserTyping ? (
                <span className="text-indigo-300">typing...</span>
              ) : otherUserPresence?.isOnline ? (
                <span className="text-emerald-400">Active now</span>
              ) : otherUserPresence?.lastSeen ? (
                formatLastSeen(otherUserPresence.lastSeen)
              ) : (
                otherParticipant?.handle
              )}
            </p>
          </div>

        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-xs">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-semibold text-white mb-2">Say hello to {otherParticipant?.name}!</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Start the conversation &mdash; talk tips, discuss upcoming games, or just say hi.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.uid;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

              const timeDiffFromPrev = prevMessage
                ? (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) / 60000
                : Infinity;
              const senderChanged = !prevMessage || prevMessage.senderId !== message.senderId;
              const showAvatar = senderChanged || timeDiffFromPrev > 2;

              const nextSenderDifferent = !nextMessage || nextMessage.senderId !== message.senderId;
              const timeDiffToNext = nextMessage
                ? (new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime()) / 60000
                : Infinity;
              const isLastInGroup = nextSenderDifferent || timeDiffToNext > 2;

              const showDate = !prevMessage ||
                new Date(prevMessage.timestamp).toDateString() !== new Date(message.timestamp).toDateString();

              return (
                <div key={message.id} className={showAvatar && index > 0 ? 'pt-3' : ''}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-surface-3/50 px-3 py-1 rounded-full text-xs text-zinc-400">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {showAvatar && !isCurrentUser ? (
                      <div className="w-7 h-7 rounded-full flex-shrink-0 self-end">
                        <Image
                          src={otherParticipant?.avatar || getDefaultAvatar()}
                          alt={otherParticipant?.name || 'User'}
                          width={28}
                          height={28}
                          className="rounded-full object-cover border border-white/20"
                        />
                      </div>
                    ) : !isCurrentUser ? (
                      <div className="w-7 h-7 flex-shrink-0" />
                    ) : null}

                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {showAvatar && !isCurrentUser && (
                        <div className="text-xs text-zinc-500 mb-1 ml-1">
                          {otherParticipant?.name}
                        </div>
                      )}

                      <div
                        className={`inline-block max-w-[75%] px-3.5 py-2 ${
                          isCurrentUser
                            ? `bg-indigo-500 text-white ${isLastInGroup ? 'rounded-2xl rounded-br-md' : 'rounded-2xl'}`
                            : `bg-white/10 text-zinc-100 ${isLastInGroup ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl'}`
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>

                      {isLastInGroup && (
                        <div className={`text-[11px] text-zinc-500 mt-1 flex items-center gap-1 ${isCurrentUser ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
                          {formatMessageTime(message.timestamp)}
                          {isCurrentUser && message.read && (
                            <span className="text-indigo-300">✓</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex items-center gap-2 pt-2 pl-9">
            <div className="bg-white/10 rounded-2xl rounded-bl-md px-3.5 py-2.5 inline-flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              maxLength={500}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-600 disabled:cursor-not-allowed rounded-2xl transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
        {newMessage.length > 0 && (
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-zinc-500">Press Enter to send</span>
            <span className={`text-xs ${newMessage.length > 450 ? 'text-amber-400' : 'text-zinc-500'}`}>
              {newMessage.length}/500
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
