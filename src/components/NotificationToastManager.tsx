'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import NotificationToast from './NotificationToast';
import { Notification } from '@/lib/types';

export default function NotificationToastManager() {
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();
  const [toasts, setToasts] = useState<Array<{ id: string; notification: Notification }>>([]);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);

    // Check if there are new unread notifications
    if (unreadNotifications.length > lastNotificationCount) {
      const newNotifications = unreadNotifications.slice(lastNotificationCount);

      // Add new notifications as toasts
      newNotifications.forEach(notification => {
        setToasts(prev => [...prev, {
          id: `${notification.id}-${Date.now()}`,
          notification
        }]);
      });
    }

    setLastNotificationCount(unreadNotifications.length);
  }, [notifications, lastNotificationCount]);

  const removeToast = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // For tip verification notifications, open the post detail modal
    if (notification.type === 'tip' && notification.postId) {
      // Dispatch a custom event to open the post detail modal
      window.dispatchEvent(new CustomEvent('openPostDetail', {
        detail: { postId: notification.postId }
      }));
    } else if (notification.actionUrl) {
      router.push(notification.actionUrl);
    } else if (notification.postId) {
      // Fallback to post page if actionUrl is not set
      router.push(`/post/${notification.postId}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <NotificationToast
            notification={toast.notification}
            onClose={() => removeToast(toast.id)}
            duration={5000}
            onNotificationClick={handleNotificationClick}
          />
        </div>
      ))}
    </div>
  );
}
