'use client';

import React from 'react';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import { User } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface NotificationDemoProps {
  className?: string;
}

export default function NotificationDemo({ className = '' }: NotificationDemoProps) {
  const { addNotification } = useNotifications();

  const demoUsers: User[] = [
    {
      id: 'demo1',
      name: 'Alex Thompson',
      handle: '@alexthompson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face')
    },
    {
      id: 'demo2',
      name: 'Lisa Chen',
      handle: '@lisachen',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=face')
    },
    {
      id: 'demo3',
      name: 'David Rodriguez',
      handle: '@davidr',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face'
    }
  ];

  const addDemoNotification = (type: 'like' | 'comment' | 'follow' | 'tip' | 'match_result' | 'system') => {
    const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    const currentUserId = 'current-user'; // Demo user ID
    
    const notifications = {
      like: {
        type: 'like' as const,
        title: 'New Like',
        message: `${user.name} liked your tip on Manchester United vs Arsenal`,
        user,
        postId: 'demo-post-1',
        recipientId: currentUserId
      },
      comment: {
        type: 'comment' as const,
        title: 'New Comment',
        message: `${user.name} commented on your Liverpool vs Chelsea prediction`,
        user,
        postId: 'demo-post-2',
        recipientId: currentUserId
      },
      follow: {
        type: 'follow' as const,
        title: 'New Follower',
        message: `${user.name} started following you`,
        user,
        recipientId: currentUserId
      },
      tip: {
        type: 'tip' as const,
        title: 'New Tip Available',
        message: `${user.name} shared a new tip for the NBA Finals game`,
        user,
        postId: 'demo-post-3',
        recipientId: currentUserId
      },
      match_result: {
        type: 'match_result' as const,
        title: 'Match Result',
        message: 'Your prediction for Manchester United vs Arsenal was correct!',
        recipientId: currentUserId
      },
      system: {
        type: 'system' as const,
        title: 'System Update',
        message: 'New features have been added to the platform. Check them out!',
        recipientId: currentUserId
      }
    };

    addNotification(notifications[type]);
  };

  return (
    <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Notification Demo</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the buttons below to add sample notifications:
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => addDemoNotification('like')}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
        >
          Add Like
        </button>
        <button
          onClick={() => addDemoNotification('comment')}
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
        >
          Add Comment
        </button>
        <button
          onClick={() => addDemoNotification('follow')}
          className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
        >
          Add Follow
        </button>
        <button
          onClick={() => addDemoNotification('tip')}
          className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors text-sm"
        >
          Add Tip
        </button>
        <button
          onClick={() => addDemoNotification('match_result')}
          className="px-3 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors text-sm"
        >
          Add Match Result
        </button>
        <button
          onClick={() => addDemoNotification('system')}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
        >
          Add System
        </button>
      </div>
    </div>
  );
}
