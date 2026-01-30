'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, User, Message } from '@/lib/types';
import MessagesList from '@/components/features/MessagesList';
import ChatWindow from '@/components/features/ChatWindow';
import { normalizeImageUrl, getDefaultAvatar } from '@/lib/imageUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { subscribeToConversations, getOrCreateConversation, sendMessage, setUserPresence } from '@/lib/firebase/messagingUtils';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggerNewConversation, setTriggerNewConversation] = useState(false);

  // Current user from auth context
  const currentUser: User = user ? {
    id: user.uid,
    name: user.displayName || 'You',
    handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
    avatar: normalizeImageUrl(user.photoURL || getDefaultAvatar())
  } : {
    id: 'anonymous',
    name: 'You',
    handle: '@you',
    avatar: getDefaultAvatar()
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

  // Set user as online when viewing messages
  useEffect(() => {
    if (!user) return;
    setUserPresence(user.uid, true);

    const handleBeforeUnload = () => {
      setUserPresence(user.uid, false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      setUserPresence(user.uid, false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  const selectedConversation = conversations.find(conv => conv.id === selectedConversationId);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.id);
    setShowMobileChat(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !selectedConversationId) return;

    try {
      await sendMessage(selectedConversationId, user.uid, content);
    } catch (error) {
      // Console statement removed for production
    }
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  const handleStartNewConversation = () => {
    setTriggerNewConversation(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-surface-0 via-surface-1 to-surface-0">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-zinc-400 mb-6">You need to be signed in to access messages</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-surface-0 via-surface-1 to-surface-0">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-surface-0 via-surface-1 to-surface-0">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <div className="w-80 flex-shrink-0">
          <MessagesList
            conversations={conversations}
            currentUser={currentUser}
            onSelectConversation={handleSelectConversation}
            onConversationCreated={handleConversationCreated}
            selectedConversationId={selectedConversationId || undefined}
            showNewConversationForm={triggerNewConversation}
            onShowNewConversationForm={setTriggerNewConversation}
          />
        </div>

        <div className="flex-1">
          <ChatWindow
            conversation={selectedConversation || null}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            onStartNewConversation={handleStartNewConversation}
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
            onConversationCreated={handleConversationCreated}
            selectedConversationId={selectedConversationId || undefined}
            showNewConversationForm={triggerNewConversation}
            onShowNewConversationForm={setTriggerNewConversation}
          />
        ) : (
          <ChatWindow
            conversation={selectedConversation || null}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            onStartNewConversation={handleStartNewConversation}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
