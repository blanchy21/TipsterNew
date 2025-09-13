'use client';

import React, { useState } from 'react';
import { MessageCircle, Users, ChevronDown, ChevronUp } from 'lucide-react';
import ChatRoom from './ChatRoom';

interface LiveGameChatProps {
    gameId: string;
    gameTitle: string;
    sport: string;
    isExpanded?: boolean;
    className?: string;
}

export default function LiveGameChat({
    gameId,
    gameTitle,
    sport,
    isExpanded = false,
    className = ''
}: LiveGameChatProps) {
    const [expanded, setExpanded] = useState(isExpanded);
    const [onlineCount] = useState(Math.floor(Math.random() * 50) + 10);

    return (
        <div className={`bg-slate-800/30 rounded-lg border border-white/10 ${className}`}>
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{gameTitle}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {onlineCount} chatting
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded text-xs font-medium">
                        {sport}
                    </div>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {expanded && (
                <div className="border-t border-white/10">
                    <ChatRoom
                        gameId={gameId}
                        sport={sport}
                        title={`${gameTitle} Chat`}
                        className="h-96"
                    />
                </div>
            )}
        </div>
    );
}
