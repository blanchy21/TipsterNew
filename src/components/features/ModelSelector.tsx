'use client';

import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
    selectedModel: string;
    onModelChange: (model: string) => void;
    disabled?: boolean;
}

const models = [
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        description: 'Most capable model for complex analysis',
        icon: Bot,
        color: 'from-emerald-500 to-green-600'
    },
    {
        id: 'claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        description: 'Excellent for detailed reasoning',
        icon: Sparkles,
        color: 'from-purple-500 to-indigo-600'
    }
];

export default function ModelSelector({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
    return (
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
            {models.map((model) => {
                const Icon = model.icon;
                const isSelected = selectedModel === model.id;

                return (
                    <button
                        key={model.id}
                        onClick={() => onModelChange(model.id)}
                        disabled={disabled}
                        className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 flex-1
              ${isSelected
                                ? `bg-gradient-to-r ${model.color} text-white shadow-lg`
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
                    >
                        <Icon className="w-4 h-4" />
                        <div className="text-left">
                            <div className="font-medium text-sm">{model.name}</div>
                            <div className="text-xs opacity-80">{model.provider}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
