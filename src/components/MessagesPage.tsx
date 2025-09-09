'use client';

import React, { useState } from 'react';
import { Conversation, User, Message } from '@/lib/types';
import MessagesList from './MessagesList';
import ChatWindow from './ChatWindow';
import { normalizeImageUrl } from '@/lib/imageUtils';

const MessagesPage: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Current user (in a real app, this would come from auth context)
  const currentUser: User = {
    id: 'current-user',
    name: 'You',
    handle: '@you',
    avatar: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
  };

  // Sample conversations data
  const conversations: Conversation[] = [
    {
      id: 'conv-1',
      participants: [
        currentUser,
        {
          id: 'user-1',
          name: 'Sarah Chen',
          handle: '@sarahchen',
          avatar: 'https://images.unsplash.com/photo-1640402882370-eb3d172f026e?w=96&h=96&fit=crop&crop=face'
        }
      ],
      lastMessage: {
        id: 'msg-1',
        senderId: 'user-1',
        receiverId: 'current-user',
        content: 'Great analysis on the Arsenal match! What do you think about their Champions League chances?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false,
        type: 'text'
      },
      unreadCount: 2,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'conv-2',
      participants: [
        currentUser,
        {
          id: 'user-2',
          name: 'Marcus Rodriguez',
          handle: '@marcusrod',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'
        }
      ],
      lastMessage: {
        id: 'msg-2',
        senderId: 'current-user',
        receiverId: 'user-2',
        content: 'Thanks! I think they have a real chance this year.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'conv-3',
      participants: [
        currentUser,
        {
          id: 'user-3',
          name: 'Alex Thompson',
          handle: '@alexthompson',
          avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face')
        }
      ],
      lastMessage: {
        id: 'msg-3',
        senderId: 'user-3',
        receiverId: 'current-user',
        content: 'Can you share your thoughts on the Liverpool vs City match?',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: false,
        type: 'text'
      },
      unreadCount: 1,
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'conv-4',
      participants: [
        currentUser,
        {
          id: 'user-4',
          name: 'Emma Wilson',
          handle: '@emmawilson',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face'
        }
      ],
      lastMessage: {
        id: 'msg-4',
        senderId: 'user-4',
        receiverId: 'current-user',
        content: 'Your tactical breakdown was spot on! 🔥',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'conv-5',
      participants: [
        currentUser,
        {
          id: 'user-5',
          name: 'David Kim',
          handle: '@davidkim',
          avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face')
        }
      ],
      lastMessage: {
        id: 'msg-5',
        senderId: 'current-user',
        receiverId: 'user-5',
        content: 'Looking forward to the analysis!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: true,
        type: 'text'
      },
      unreadCount: 0,
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setShowMobileChat(true);
  };

  const handleSendMessage = (content: string) => {
    // In a real app, this would send the message to the server
    console.log('Sending message:', content);
    // You would typically update the conversation's lastMessage here
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 to-[#2c1376]/70">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <div className="w-80 flex-shrink-0">
          <MessagesList
            conversations={conversations}
            currentUser={currentUser}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId || undefined}
          />
        </div>
        
        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation || null}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1">
        {!showMobileChat ? (
          <MessagesList
            conversations={conversations}
            currentUser={currentUser}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId || undefined}
          />
        ) : (
          <ChatWindow
            conversation={selectedConversation || null}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
