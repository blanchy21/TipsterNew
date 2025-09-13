'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Settings, Check } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import { Notification } from '@/lib/types';

interface NotificationsIconProps {
  className?: string;
}

export default function NotificationsIcon({ className = '' }: NotificationsIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, settings, updateSettings } = useNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect new notifications for visual indicators
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      setHasNewNotifications(true);
      // Auto-hide the indicator after 5 seconds
      const timer = setTimeout(() => setHasNewNotifications(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    // Here you would navigate to the relevant page/post
    if (notification.actionUrl) {
      // router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'tip':
        return '🎯';
      case 'match_result':
        return '⚽';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-slate-300 hover:text-slate-100 hover:bg-white/5 rounded-full transition-all duration-300 ${
          hasNewNotifications ? 'animate-pulse' : ''
        }`}
      >
        <Bell className={`w-6 h-6 transition-transform duration-300 ${
          hasNewNotifications ? 'scale-110' : ''
        }`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all duration-300 ${
            hasNewNotifications ? 'animate-bounce scale-125' : ''
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {hasNewNotifications && unreadCount === 0 && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0B0F14] rounded-lg shadow-lg border border-white/10 z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">Notifications</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <Settings className="w-4 h-4" />
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>

          {showSettings ? (
            <div className="p-4">
              <h4 className="font-medium text-slate-100 mb-3">Notification Settings</h4>
              <div className="space-y-3">
                {Object.entries(settings).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300 capitalize">
                      {key === 'matchResults' ? 'Match Results' : key}
                    </span>
                    <button
                      onClick={() => updateSettings({ [key]: !value })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300 ${
                      !notification.read ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-slate-100 truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-400">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-slate-500 hover:text-slate-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 mt-1 line-clamp-2">
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
                ))
              )}
            </div>
          )}

          {!showSettings && recentNotifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page
                }}
                className="w-full text-center text-sm text-blue-400 hover:text-blue-300"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
