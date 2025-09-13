'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    className?: string;
}

export default function ErrorDisplay({ error, onRetry, className = '' }: ErrorDisplayProps) {
    return (
        <div className={`bg-red-500/10 border border-red-500/20 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h3 className="text-red-400 font-medium mb-1">Error</h3>
                    <p className="text-red-300 text-sm">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
