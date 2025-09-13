'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, User, Message } from '@/lib/types';
import MessagesList from '@/components/features/MessagesList';
import ChatWindow from '@/components/features/ChatWindow';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { subscribeToConversations, getOrCreateConversation, sendMessage } from '@/lib/firebase/messagingUtils';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Current user from auth context
  const currentUser: User = user ? {
    id: user.uid,
    name: user.displayName || 'You',
    handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
    avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
  } : {
    id: 'anonymous',
    name: 'You',
    handle: '@you',
    avatar: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
  };

  // Set up real-time conversation listener
  useEffect(() => {
    if (!user) {

      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToConversations(user.uid, (conversationsData) => {

      setConversations(conversationsData);
      setLoading(false);
    });

    // Add a timeout fallback in case the listener never fires
    const timeout = setTimeout(() => {

      setLoading(false);
    }, 10000); // 10 second timeout

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [user]);

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedConversationId) return;

    try {
      await sendMessage(selectedConversationId, user.uid, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-slate-400 mb-6">You need to be signed in to access messages</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
