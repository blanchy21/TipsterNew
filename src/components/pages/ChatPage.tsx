'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Trophy, Zap, TrendingUp, CircleDot, Target, Menu, X } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import ChatRoom from '@/components/features/ChatRoom';

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sport?: string;
  gameId?: string;
  presenceKey: string;
  color: string;
}

const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'Discuss anything sports-related',
    icon: <MessageCircle className="w-5 h-5" />,
    presenceKey: 'general',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'football',
    name: 'Football',
    description: 'Premier League, Champions League & more',
    icon: <Trophy className="w-5 h-5" />,
    sport: 'Football',
    presenceKey: 'Football',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'horse-racing',
    name: 'Horse Racing',
    description: 'Flat Racing, Jump Racing & Major Festivals',
    icon: <CircleDot className="w-5 h-5" />,
    sport: 'Horse Racing',
    presenceKey: 'Horse Racing',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Masters, PGA Championship & Ryder Cup',
    icon: <Target className="w-5 h-5" />,
    sport: 'Golf',
    presenceKey: 'Golf',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    description: 'Grand Slams, ATP & WTA Tours',
    icon: <TrendingUp className="w-5 h-5" />,
    sport: 'Tennis',
    presenceKey: 'Tennis',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    description: 'NBA, EuroLeague & College Basketball',
    icon: <Zap className="w-5 h-5" />,
    sport: 'Basketball',
    presenceKey: 'Basketball',
    color: 'from-orange-500 to-red-600'
  }
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [showSidebar, setShowSidebar] = useState(false);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});

  // Listen to real presence counts for all channels
  useEffect(() => {
    if (!db) return;

    const unsubscribes = CHAT_CHANNELS.map((channel) => {
      const presenceQuery = query(
        collection(db, 'chatPresence'),
        where('channel', '==', channel.presenceKey)
      );
      return onSnapshot(presenceQuery, (snapshot) => {
        setOnlineCounts(prev => ({ ...prev, [channel.id]: snapshot.size }));
      }, () => {});
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const selectedChannelData = CHAT_CHANNELS.find(channel => channel.id === selectedChannel);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-surface-0 via-surface-1 to-surface-0">
      {/* Mobile Channel Selector Bar */}
      <div className="md:hidden fixed top-[52px] left-0 right-0 z-20 bg-surface-2/90 backdrop-blur-sm border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <Menu className="w-4 h-4 text-zinc-300" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {selectedChannelData?.name || 'Live Chat'}
            </p>
          </div>
          {selectedChannelData && (onlineCounts[selectedChannelData.id] ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
              <Users className="w-3 h-3" />
              {onlineCounts[selectedChannelData.id]}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 md:z-auto w-80 max-w-[85vw] h-full bg-surface-2/50 backdrop-blur-sm border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out`}>
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-white">Live Chat</h1>
            <button
              onClick={() => setShowSidebar(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-300" />
            </button>
          </div>
          <p className="text-zinc-400 text-sm">Join the conversation with fellow tipsters</p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CHAT_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => handleChannelSelect(channel.id)}
              className={`w-full p-4 rounded-lg text-left transition-all ${selectedChannel === channel.id
                ? 'bg-gradient-to-r ' + channel.color + ' text-white shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedChannel === channel.id
                  ? 'bg-white/20'
                  : 'bg-white/10'
                  }`}>
                  {channel.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{channel.name}</h3>
                  <p className="text-sm opacity-80">{channel.description}</p>
                </div>
                {(onlineCounts[channel.id] ?? 0) > 0 && (
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Users className="w-3 h-3" />
                    {onlineCounts[channel.id]}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-surface-3/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-white mb-1">Chat Rules</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Be respectful to other users</li>
              <li>• Keep discussions sports-related</li>
              <li>• No spam or self-promotion</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col pt-[52px] md:pt-0">
        {selectedChannelData ? (
          <ChatRoom
            gameId={selectedChannelData.gameId}
            sport={selectedChannelData.sport}
            title={selectedChannelData.name}
            className="h-full"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Channel</h3>
              <p className="text-zinc-400">Choose a chat channel to start the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}