'use client';

import React, { useState, useEffect } from 'react';
import { X, Bell, Heart, MessageCircle, UserPlus, Target, Trophy, Settings } from 'lucide-react';
import { Notification } from '@/lib/types';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({
  notification,
  onClose,
  duration = 5000
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-400" />;
      case 'tip':
        return <Target className="w-5 h-5 text-purple-400" />;
      case 'match_result':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'system':
        return <Settings className="w-5 h-5 text-gray-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-[#0B0F14] border border-white/10 rounded-lg shadow-lg transform transition-all duration-300 ${isVisible
        ? 'translate-x-0 opacity-100 scale-100'
        : 'translate-x-full opacity-0 scale-95'
        }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-100">
                {notification.title}
              </h4>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              {notification.message}
            </p>
            {notification.user && (
              <p className="text-xs text-slate-400 mt-1">
                from {notification.user.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-700 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-linear"
          style={{
            width: '100%',
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
