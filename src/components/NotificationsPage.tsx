'use client';

import React, { useState } from 'react';
import { Bell, Settings, Trash2, Check, X, Filter } from 'lucide-react';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    settings,
    updateSettings
  } = useNotifications();

  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<Notification['type'] | 'all'>('all');

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

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'Likes';
      case 'comment':
        return 'Comments';
      case 'follow':
        return 'Follows';
      case 'tip':
        return 'Tips';
      case 'match_result':
        return 'Match Results';
      case 'system':
        return 'System';
      default:
        return 'Other';
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' ||
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);

    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter;

    return matchesReadFilter && matchesTypeFilter;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Here you would navigate to the relevant page/post
    if (notification.actionUrl) {
      // router.push(notification.actionUrl);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-slate-300" />
            <div>
              <h1 className="text-xl font-semibold text-slate-100">Notifications</h1>
              <p className="text-sm text-slate-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-white/10 px-6 py-4 bg-white/5">
          <h3 className="font-medium text-slate-100 mb-3">Notification Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 capitalize">
                  {key === 'matchResults' ? 'Match Results' : key}
                </span>
                <button
                  onClick={() => updateSettings({ [key]: !value })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-slate-600'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="border-b border-white/10 px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Filter:</span>
          </div>

          <div className="flex space-x-2">
            {(['all', 'unread', 'read'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === filterType
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                {filterType === 'all' ? 'All' : filterType}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-slate-300">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as Notification['type'] | 'all')}
              className="text-sm bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {(['like', 'comment', 'follow', 'tip', 'match_result', 'system'] as const).map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="px-6 py-3 bg-blue-500/10 border-b border-blue-500/20">
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Bell className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-100 mb-2">No notifications</h3>
            <p className="text-sm text-slate-400 text-center max-w-sm">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                  ? "No read notifications to show."
                  : "You'll see notifications here when people interact with your content."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-6 hover:bg-white/5 cursor-pointer transition-all duration-300 ${!notification.read ? 'bg-blue-500/10 border-l-4 border-l-blue-500' : ''
                  }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-slate-100">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('🗑️ NotificationsPage: Delete button clicked for notification:', notification.id);
                            deleteNotification(notification.id);
                          }}
                          className="p-1 text-slate-500 hover:text-red-400 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">
                      {notification.message}
                    </p>
                    {notification.user && (
                      <p className="text-xs text-slate-400 mt-2">
                        from {notification.user.name} (@{notification.user.handle})
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                        {getTypeLabel(notification.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
