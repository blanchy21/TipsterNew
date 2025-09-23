'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface RealtimeIndicatorProps {
    isConnected?: boolean;
    isUpdating?: boolean;
    className?: string;
}

export default function RealtimeIndicator({
    isConnected = true,
    isUpdating = false,
    className = ''
}: RealtimeIndicatorProps) {
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        if (isUpdating) {
            setShowIndicator(true);
            const timer = setTimeout(() => {
                setShowIndicator(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isUpdating]);

    if (!showIndicator && !isUpdating) {
        return null;
    }

    return (
        <div className={`fixed top-4 right-4 z-50 ${className}`}>
            <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isConnected
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }
        ${showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}>
                {isUpdating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">Updating...</span>
                    </>
                ) : isConnected ? (
                    <>
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm font-medium">Live</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4" />
                        <span className="text-sm font-medium">Offline</span>
                    </>
                )}
            </div>
        </div>
    );
}
