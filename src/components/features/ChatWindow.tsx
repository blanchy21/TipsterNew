'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Conversation, Message, User } from '@/lib/types';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Image as ImageIcon, Smile } from 'lucide-react';
import { subscribeToMessages, sendMessage, markMessagesAsRead } from '@/lib/firebase/messagingUtils';
import { useAuth } from '@/lib/hooks/useAuth';

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUser: User;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  onSendMessage,
  onBack
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation || !user) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

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

  const getOtherParticipant = () => {
    if (!conversation) return null;
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Select a conversation</h3>
          <p className="text-neutral-400 text-sm">Choose a conversation to start messaging</p>
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

          <Image
            src={otherParticipant?.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'}
            alt={otherParticipant?.name || 'User'}
            width={40}
            height={40}
            className="rounded-full object-cover border-2 border-white/20"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-white">{otherParticipant?.name}</h3>
            <p className="text-sm text-neutral-400">@{otherParticipant?.handle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Phone className="w-5 h-5 text-neutral-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Video className="w-5 h-5 text-neutral-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <MoreVertical className="w-5 h-5 text-neutral-400" />
            </button>
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
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start the conversation</h3>
              <p className="text-neutral-400 text-sm">Send your first message to {otherParticipant?.name}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.uid;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
              const showDate = !prevMessage ||
                new Date(prevMessage.timestamp).toDateString() !== new Date(message.timestamp).toDateString();

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs text-slate-400">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {showAvatar && (
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 ${isCurrentUser ? 'order-1' : ''}`}>
                        <Image
                          src={isCurrentUser ? (user?.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face') : (otherParticipant?.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face')}
                          alt={isCurrentUser ? 'You' : (otherParticipant?.name || 'User')}
                          width={32}
                          height={32}
                          className="rounded-full object-cover border border-white/20"
                        />
                      </div>
                    )}

                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {showAvatar && (
                        <div className={`text-xs text-slate-400 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {isCurrentUser ? 'You' : otherParticipant?.name}
                        </div>
                      )}

                      <div
                        className={`inline-block max-w-[70%] rounded-2xl px-4 py-2 ${isCurrentUser
                          ? 'bg-indigo-500 text-white'
                          : 'bg-white/10 text-slate-100'
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>

                      <div className={`text-xs text-slate-400 mt-1 flex items-center gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        {formatMessageTime(message.timestamp)}
                        {isCurrentUser && message.read && (
                          <span className="text-indigo-300">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Attach image"
          >
            <ImageIcon className="w-5 h-5 text-neutral-400" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Smile className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-600 disabled:cursor-not-allowed rounded-2xl transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
