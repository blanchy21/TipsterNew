'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Bot, Phone, Video, MoreVertical, Trash2, RotateCcw } from 'lucide-react';
import MessageList from './MessageList';
import InputField from '@/components/forms/InputField';
import ModelSelector from './ModelSelector';
import ErrorDisplay from '@/components/ui/ErrorDisplay';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp?: string;
}

const QUICK_ACTIONS = [
    {
        id: 'arsenal-united',
        label: '⚽ Arsenal vs Man United',
        prompt: 'Analyze Arsenal vs Man United match'
    },
    {
        id: 'lakers-warriors',
        label: '🏀 Lakers vs Warriors',
        prompt: 'Lakers vs Warriors prediction'
    },
    {
        id: 'djokovic-medvedev',
        label: '🎾 Djokovic vs Medvedev',
        prompt: 'Djokovic vs Medvedev analysis'
    },
    {
        id: 'today-predictions',
        label: '📊 Today\'s Predictions',
        prompt: 'What are today\'s best sports predictions?'
    }
];

export default function ChatInterface() {
    const [selectedModel, setSelectedModel] = useState('gpt-4o');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        reload,
        setMessages
    } = useChat({
        api: '/api/chat',
        body: {
            model: selectedModel,
        },
        onError: (error) => {
            setError(error.message);
        },
        onFinish: () => {
            setError(null);
        }
    });

    // Load chat history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('tipster-chat-history');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    setMessages(parsedHistory);
                }
            } catch (error) {
                console.error('Failed to load chat history:', error);
            }
        }
    }, []);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('tipster-chat-history', JSON.stringify(messages));
        }
    }, [messages]);

    // Save model preference to localStorage
    useEffect(() => {
        const savedModel = localStorage.getItem('tipster-chat-model');
        if (savedModel) {
            setSelectedModel(savedModel);
        }
    }, []);

    useEffect(() => {
        setSelectedModel(selectedModel);
        localStorage.setItem('tipster-chat-model', selectedModel);
    }, [selectedModel]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleModelChange = (model: string) => {
        setSelectedModel(model);
        setError(null);
    };

    const handleSendMessage = () => {
        if (input.trim()) {
            setError(null);
            handleSubmit(new Event('submit') as any);
        }
    };

    const handleStop = () => {
        stop();
    };

    const handleRetry = () => {
        setError(null);
        reload();
    };

    const handleClearHistory = () => {
        setMessages([]);
        setError(null);
        localStorage.removeItem('tipster-chat-history');
    };

    const handleQuickAction = (prompt: string) => {
        handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>);
    };

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return '';
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
                        <h1 className="text-lg font-semibold text-white">Tipster Arena AI</h1>
                        <p className="text-sm text-slate-400">
                            {isLoading ? 'Analyzing...' : 'Ready to help'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClearHistory}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        title="Clear chat history"
                    >
                        <Trash2 className="w-5 h-5 text-slate-400" />
                    </button>
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

            {/* Model Selector */}
            <div className="px-4 py-3 border-b border-white/10 bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-300">AI Model</h3>
                    {error && (
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Retry
                        </button>
                    )}
                </div>
                <ModelSelector
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                    disabled={isLoading}
                />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-b border-white/10 bg-slate-800/30">
                <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => handleQuickAction(action.prompt)}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-300 whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="px-4 py-3">
                    <ErrorDisplay error={error} onRetry={handleRetry} />
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
                <MessageList
                    messages={messages.map(msg => ({
                        id: msg.id,
                        content: msg.content,
                        role: msg.role as 'user' | 'assistant',
                        timestamp: msg.createdAt?.toISOString()
                    }))}
                    isLoading={isLoading}
                />
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <InputField
                value={input}
                onChange={(value) => handleInputChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
                onSend={handleSendMessage}
                onStop={handleStop}
                disabled={isLoading}
                isLoading={isLoading}
                placeholder="Ask about sports analysis, predictions, or insights..."
            />
        </div>
    );
}
