'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Conversation, User } from '@/lib/types';
import { Search, MoreVertical, Plus, MessageCircle } from 'lucide-react';
import { getOrCreateConversation } from '@/lib/firebase/messagingUtils';
import { useAuth } from '@/lib/hooks/useAuth';

interface MessagesListProps {
  conversations: Conversation[];
  currentUser: User;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

const MessagesList: React.FC<MessagesListProps> = ({
  conversations,
  currentUser,
  onSelectConversation,
  selectedConversationId
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationUser, setNewConversationUser] = useState('');

  const handleStartNewConversation = async () => {
    if (!user || !newConversationUser.trim()) return;

    try {
      // For now, we'll create a conversation with a placeholder user
      // In a real app, you'd have a user search/selection interface
      const conversationId = await getOrCreateConversation(user.uid, newConversationUser.trim());

      // Find the conversation in the list and select it
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        onSelectConversation(conversation);
      }

      setNewConversationUser('');
      setShowNewConversation(false);
    } catch (error) {
      // Console statement removed for production
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherParticipant?.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewConversation(!showNewConversation)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Start new conversation"
              >
                <Plus className="w-5 h-5 text-neutral-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <MoreVertical className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
          </div>
        </div>

        {/* New Conversation Form - Only show when active */}
        {showNewConversation && (
          <div className="px-4 pb-3">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex gap-2 items-stretch">
                <input
                  type="text"
                  placeholder="Enter user ID to start conversation..."
                  value={newConversationUser}
                  onChange={(e) => setNewConversationUser(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-sm min-w-0"
                />
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleStartNewConversation}
                    disabled={!newConversationUser.trim()}
                    className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => setShowNewConversation(false)}
                    className="px-3 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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
            <p className="text-neutral-400 text-sm">
              {searchQuery ? 'No conversations match your search' : 'Start a conversation with other sports analysts'}
            </p>
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
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">
                          {otherParticipant.name}
                        </h3>
                        <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-neutral-400'
                          }`}>
                          {conversation.lastMessage.content}
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
