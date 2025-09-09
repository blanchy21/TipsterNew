'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Conversation, Message, User } from '@/lib/types';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Image as ImageIcon, Smile } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.lastMessage]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && conversation) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
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
            src={otherParticipant?.avatar || '/default-avatar.png'}
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
        {conversation.lastMessage ? (
          <div className="space-y-4">
            {/* Sample messages - in a real app, you'd fetch these from an API */}
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-xs">
                <Image
                  src={otherParticipant?.avatar || '/default-avatar.png'}
                  alt={otherParticipant?.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border border-white/20"
                />
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2">
                  <p className="text-white text-sm">Hey! Great analysis on the Arsenal match yesterday. What do you think about their chances in the Champions League?</p>
                  <span className="text-xs text-neutral-400 mt-1 block">10:30 AM</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                <p className="text-white text-sm">Thanks! I think they have a real chance this year. Their midfield is looking solid with the new signings.</p>
                <span className="text-xs text-indigo-200 mt-1 block">10:32 AM</span>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-xs">
                <Image
                  src={otherParticipant?.avatar || '/default-avatar.png'}
                  alt={otherParticipant?.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border border-white/20"
                />
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2">
                  <p className="text-white text-sm">Absolutely! The way they&apos;re playing now is much more consistent. Do you have any insights on their upcoming fixtures?</p>
                  <span className="text-xs text-neutral-400 mt-1 block">10:35 AM</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-indigo-500 rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                <p className="text-white text-sm">I&apos;ll be posting a detailed analysis later today. The key will be how they handle the away games in Europe.</p>
                <span className="text-xs text-indigo-200 mt-1 block">10:37 AM</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start the conversation</h3>
              <p className="text-neutral-400 text-sm">Send your first message to {otherParticipant?.name}</p>
            </div>
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
