'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Conversation, User } from '@/lib/types';
import { Search, Plus, MessageCircle, X, Loader2 } from 'lucide-react';
import { getOrCreateConversation, subscribeToUserPresence } from '@/lib/firebase/messagingUtils';
import { searchUsers } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { getDefaultAvatar } from '@/lib/imageUtils';

interface MessagesListProps {
  conversations: Conversation[];
  currentUser: User;
  onSelectConversation: (conversation: Conversation) => void;
  onConversationCreated?: (conversationId: string) => void;
  selectedConversationId?: string;
  showNewConversationForm?: boolean;
  onShowNewConversationForm?: (show: boolean) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  conversations,
  currentUser,
  onSelectConversation,
  onConversationCreated,
  selectedConversationId,
  showNewConversationForm,
  onShowNewConversationForm
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Subscribe to online presence for conversation participants
  useEffect(() => {
    if (conversations.length === 0) return;

    const unsubscribes: (() => void)[] = [];

    conversations.forEach(conv => {
      const otherUser = conv.participants.find(p => p.id !== currentUser.id);
      if (!otherUser) return;

      const unsub = subscribeToUserPresence(otherUser.id, (presence) => {
        setOnlineUsers(prev => {
          const next = new Set(prev);
          if (presence.isOnline) {
            next.add(otherUser.id);
          } else {
            next.delete(otherUser.id);
          }
          return next;
        });
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [conversations, currentUser.id]);

  // Allow parent to trigger showing the new conversation form
  useEffect(() => {
    if (showNewConversationForm) {
      setShowNewConversation(true);
      onShowNewConversationForm?.(false);
    }
  }, [showNewConversationForm, onShowNewConversationForm]);

  // Debounced user search
  useEffect(() => {
    if (!userSearchQuery.trim() || selectedUser) {
      setUserSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const results = await searchUsers(userSearchQuery.trim(), 10);
        // Filter out the current user
        setUserSearchResults(results.filter(u => u.id !== user?.uid));
      } catch {
        setUserSearchResults([]);
      }
      setIsSearchingUsers(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearchQuery, selectedUser, user?.uid]);

  const handleSelectUser = (selectedUserResult: User) => {
    setSelectedUser(selectedUserResult);
    setUserSearchQuery('');
    setUserSearchResults([]);
  };

  const handleStartNewConversation = async () => {
    if (!user || !selectedUser) return;

    setIsCreatingConversation(true);
    try {
      const conversationId = await getOrCreateConversation(user.uid, selectedUser.id);

      // Try to select existing conversation, otherwise notify parent with the ID
      // so it gets selected once the real-time listener picks it up
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        onSelectConversation(conversation);
      } else {
        onConversationCreated?.(conversationId);
      }

      setSelectedUser(null);
      setUserSearchQuery('');
      setShowNewConversation(false);
    } catch {
      // Failed to create conversation
    }
    setIsCreatingConversation(false);
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherParticipant?.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border-r border-white/10">
      {/* Header - Fixed height to prevent overflow */}
      <div className="flex-shrink-0 border-b border-white/10">
        {/* Title and Actions */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <button
              onClick={() => {
                setShowNewConversation(!showNewConversation);
                if (showNewConversation) {
                  setSelectedUser(null);
                  setUserSearchQuery('');
                  setUserSearchResults([]);
                }
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Start new conversation"
            >
              {showNewConversation ? (
                <X className="w-5 h-5 text-neutral-400" />
              ) : (
                <Plus className="w-5 h-5 text-neutral-400" />
              )}
            </button>
          </div>
        </div>

        {/* New Conversation - User Search Picker */}
        {showNewConversation && (
          <div className="px-4 pb-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-zinc-400 mb-2 font-medium">New message to:</p>

              {selectedUser ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Image
                      src={selectedUser.avatar || getDefaultAvatar()}
                      alt={selectedUser.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover border border-white/20 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-sm text-white font-medium truncate block">{selectedUser.name}</span>
                      <span className="text-xs text-zinc-400 truncate block">{selectedUser.handle}</span>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>
                  <button
                    onClick={handleStartNewConversation}
                    disabled={isCreatingConversation}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {isCreatingConversation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Chat'
                    )}
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search by name or handle..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm"
                  />

                  {/* Search Results Dropdown */}
                  {userSearchQuery.trim() && (
                    <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-surface-2/95 backdrop-blur-xl">
                      {isSearchingUsers ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                          <span className="text-xs text-zinc-400 ml-2">Searching...</span>
                        </div>
                      ) : userSearchResults.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-zinc-500">No users found</p>
                        </div>
                      ) : (
                        userSearchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelectUser(result)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                          >
                            <Image
                              src={result.avatar || getDefaultAvatar()}
                              alt={result.name}
                              width={32}
                              height={32}
                              className="rounded-full object-cover border border-white/20 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm text-white font-medium truncate">{result.name}</p>
                              <p className="text-xs text-zinc-400 truncate">{result.handle}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageCircle className="w-12 h-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
            <p className="text-neutral-400 text-sm mb-4">
              {searchQuery ? 'No conversations match your search' : 'Start a conversation with other tipsters'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewConversation(true)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              const isSelected = selectedConversationId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                    : 'hover:bg-white/10 border border-transparent'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Image
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      {conversation.unreadCount > 0 ? (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        </div>
                      ) : onlineUsers.has(otherParticipant.id) ? (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-surface-1" />
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {otherParticipant.name}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${
                          !conversation.lastMessage
                            ? 'text-neutral-500 italic'
                            : conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-neutral-400'
                          }`}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
