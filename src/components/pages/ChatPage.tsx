'use client';

import React, { useState } from 'react';
import { MessageCircle, Users, Trophy, Zap, TrendingUp, CircleDot, Target } from 'lucide-react';
import ChatRoom from '@/components/features/ChatRoom';

interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  sport?: string;
  gameId?: string;
  onlineCount: number;
  color: string;
}

const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'Discuss anything sports-related',
    icon: <MessageCircle className="w-5 h-5" />,
    onlineCount: 127,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'football',
    name: 'Football',
    description: 'Premier League, Champions League & more',
    icon: <Trophy className="w-5 h-5" />,
    sport: 'Football',
    onlineCount: 89,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'horse-racing',
    name: 'Horse Racing',
    description: 'Flat Racing, Jump Racing & Major Festivals',
    icon: <CircleDot className="w-5 h-5" />,
    sport: 'Horse Racing',
    onlineCount: 38,
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'golf',
    name: 'Golf',
    description: 'Masters, PGA Championship & Ryder Cup',
    icon: <Target className="w-5 h-5" />,
    sport: 'Golf',
    onlineCount: 31,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    description: 'Grand Slams, ATP & WTA Tours',
    icon: <TrendingUp className="w-5 h-5" />,
    sport: 'Tennis',
    onlineCount: 42,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'basketball',
    name: 'Basketball',
    description: 'NBA, EuroLeague & College Basketball',
    icon: <Zap className="w-5 h-5" />,
    sport: 'Basketball',
    onlineCount: 64,
    color: 'from-orange-500 to-red-600'
  }
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<string>('general');

  const selectedChannelData = CHAT_CHANNELS.find(channel => channel.id === selectedChannel);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2">Live Chat</h1>
          <p className="text-slate-400 text-sm">Join the conversation with fellow tipsters</p>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {CHAT_CHANNELS.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel.id)}
              className={`w-full p-4 rounded-lg text-left transition-all ${selectedChannel === channel.id
                ? 'bg-gradient-to-r ' + channel.color + ' text-white shadow-lg'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
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
                <div className="flex items-center gap-1 text-xs opacity-70">
                  <Users className="w-3 h-3" />
                  {channel.onlineCount}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-slate-700/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-white mb-1">Chat Rules</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Be respectful to other users</li>
              <li>• Keep discussions sports-related</li>
              <li>• No spam or self-promotion</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
              <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a Channel</h3>
              <p className="text-slate-400">Choose a chat channel to start the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}