'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

const sampleMessages: Message[] = [
  {
    id: '1',
    content: "Welcome to Tipster Arena Chat! I'm your AI sports analyst assistant. How can I help you today?",
    sender: 'ai',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'text'
  },
  {
    id: '2',
    content: "Hi! I'm looking for analysis on the upcoming Arsenal vs Man United match. What are your thoughts?",
    sender: 'user',
    timestamp: '2024-01-15T10:01:00Z',
    type: 'text'
  },
  {
    id: '3',
    content: "Great question! Arsenal's home form has been exceptional this season with a 85% win rate at the Emirates. However, Man United's counter-attacking style could exploit Arsenal's high defensive line. Key factors to watch:\n\n• Midfield battle between Rice and Casemiro\n• Arsenal's set-piece advantage (12 goals this season)\n• United's away form improvement (3 wins in last 4)\n\nI'd lean towards Arsenal 2-1, but it's going to be tight!",
    sender: 'ai',
    timestamp: '2024-01-15T10:02:00Z',
    type: 'text'
  },
  {
    id: '4',
    content: "That's really insightful! What about the key players to watch?",
    sender: 'user',
    timestamp: '2024-01-15T10:03:00Z',
    type: 'text'
  },
  {
    id: '5',
    content: "Absolutely! Here are the key players to watch:\n\n**Arsenal:**\n• Bukayo Saka - 8 goals, 7 assists this season\n• Declan Rice - Defensive midfield maestro\n• Gabriel Jesus - Big game player\n\n**Man United:**\n• Marcus Rashford - 6 goals in last 8 games\n• Bruno Fernandes - Creative spark\n• Casemiro - Defensive anchor\n\nSaka vs Luke Shaw will be a fascinating battle on the right flank!",
    sender: 'ai',
    timestamp: '2024-01-15T10:04:00Z',
    type: 'text'
  }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Arsenal/Man United responses
    if (message.includes('arsenal') && message.includes('man united')) {
      return "🔥 **Arsenal vs Man United Analysis**\n\n**Arsenal's Strengths:**\n• Home form: 8W-1D-0L at Emirates this season\n• Saka's form: 3 goals in last 4 games\n• Set pieces: 12 goals from dead balls\n\n**Man United's Threats:**\n• Rashford's pace on counter-attacks\n• Casemiro's experience in big games\n• Away form improvement: 3 wins in last 4\n\n**Prediction:** Arsenal 2-1 (Saka, Jesus | Rashford)\n**Key Battle:** Rice vs Fernandes in midfield";
    }

    // Basketball responses
    if (message.includes('lakers') || message.includes('warriors') || message.includes('nba')) {
      return "🏀 **NBA Analysis**\n\n**Lakers vs Warriors Breakdown:**\n• LeBron's leadership vs Curry's shooting\n• AD's defense vs Draymond's playmaking\n• Lakers' size advantage in the paint\n• Warriors' small-ball lineup effectiveness\n\n**Key Stats:**\n• Lakers: 45.2% FG, 34.1% 3PT\n• Warriors: 47.8% FG, 37.2% 3PT\n• Rebounding: Lakers +3.2 per game\n\n**Prediction:** Lakers 115-110 (LeBron 28pts, Curry 32pts)";
    }

    // Tennis responses
    if (message.includes('djokovic') || message.includes('medvedev') || message.includes('tennis')) {
      return "🎾 **Tennis Analysis**\n\n**Djokovic vs Medvedev:**\n• Djokovic's mental toughness in crucial moments\n• Medvedev's improved serve (67% first serve)\n• Head-to-head: Djokovic leads 10-5\n• Court surface: Hard court favors both players\n\n**Key Factors:**\n• Djokovic's return game (breaks 25% of serves)\n• Medvedev's court coverage and defense\n• Experience in Grand Slam finals\n\n**Prediction:** Djokovic in 4 sets (6-4, 4-6, 6-3, 6-2)";
    }

    // General sports questions
    if (message.includes('prediction') || message.includes('analysis')) {
      return "📊 **Sports Analysis Ready**\n\nI can provide detailed analysis on:\n• **Football:** Premier League, Champions League, La Liga\n• **Basketball:** NBA, EuroLeague, College Basketball\n• **Tennis:** Grand Slams, ATP, WTA tours\n• **Other Sports:** Formula 1, Golf, Boxing\n\nWhat specific match or sport would you like me to analyze?";
    }

    // Default response
    return "Thanks for your question! I'm here to provide expert sports analysis and insights. I can help with:\n\n• Match predictions and analysis\n• Player performance insights\n• Team tactics and strategies\n• Injury updates and impact\n• Transfer news and rumors\n\nWhat sport or match would you like to discuss?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Generate AI response based on user input
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Sports AI Assistant</h1>
            <p className="text-sm text-slate-400">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Phone className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Video className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-b border-white/10 bg-slate-800/30">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setInputMessage("Analyze Arsenal vs Man United match")}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
          >
            ⚽ Arsenal vs Man United
          </button>
          <button
            onClick={() => setInputMessage("Lakers vs Warriors prediction")}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
          >
            🏀 Lakers vs Warriors
          </button>
          <button
            onClick={() => setInputMessage("Djokovic vs Medvedev analysis")}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
          >
            🎾 Djokovic vs Medvedev
          </button>
          <button
            onClick={() => setInputMessage("What are today's best sports predictions?")}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors"
          >
            📊 Today&apos;s Predictions
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === 'user'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
                : 'bg-white/10 backdrop-blur-sm text-slate-100 border border-white/20'
                }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content.split('\n').map((line, index) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <div key={index} className="font-semibold text-base mb-2">
                        {line.replace(/\*\*/g, '')}
                      </div>
                    );
                  }
                  if (line.startsWith('•')) {
                    return (
                      <div key={index} className="ml-2 mb-1">
                        {line}
                      </div>
                    );
                  }
                  return <div key={index} className="mb-2">{line}</div>;
                })}
              </div>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-sky-100' : 'text-slate-400'
                }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 backdrop-blur-sm text-slate-100 border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-end gap-3">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
            <Paperclip className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sports analysis, predictions, or insights..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors">
              <Smile className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-2 text-xs text-slate-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
