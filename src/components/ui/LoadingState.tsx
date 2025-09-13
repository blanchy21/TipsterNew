'use client';

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'spinner' | 'dots' | 'pulse';
    className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
    message = 'Loading...',
    size = 'md',
    variant = 'spinner',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    const renderSpinner = () => (
        <div className={`${sizeClasses[size]} border-2 border-amber-500 border-t-transparent rounded-full animate-spin`} />
    );

    const renderDots = () => (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-amber-500 rounded-full animate-pulse`}
                    style={{
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1s',
                    }}
                />
            ))}
        </div>
    );

    const renderPulse = () => (
        <div className={`${sizeClasses[size]} bg-amber-500 rounded-full animate-pulse`} />
    );

    const renderLoader = () => {
        switch (variant) {
            case 'dots':
                return renderDots();
            case 'pulse':
                return renderPulse();
            default:
                return renderSpinner();
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            {renderLoader()}
            {message && (
                <p className="text-slate-300 text-sm font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

// Specialized loading components for common use cases
export const FeedLoadingState: React.FC = () => (
    <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-1/4" />
                        <div className="h-4 bg-slate-700 rounded w-1/2" />
                        <div className="h-20 bg-slate-700 rounded" />
                        <div className="flex space-x-4">
                            <div className="h-4 bg-slate-700 rounded w-16" />
                            <div className="h-4 bg-slate-700 rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const CardLoadingState: React.FC = () => (
    <div className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
        <div className="space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-700 rounded w-1/2" />
            <div className="h-32 bg-slate-700 rounded" />
            <div className="flex justify-between">
                <div className="h-4 bg-slate-700 rounded w-20" />
                <div className="h-4 bg-slate-700 rounded w-16" />
            </div>
        </div>
    </div>
);

export const ButtonLoadingState: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
    <div className="flex items-center justify-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{text}</span>
    </div>
);

export const PageLoadingState: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/70 text-lg">Loading Tipster Arena...</p>
        </div>
    </div>
);

export default LoadingState;
