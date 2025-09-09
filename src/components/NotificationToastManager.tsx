'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '@/lib/contexts/NotificationsContext';
import NotificationToast from './NotificationToast';
import { Notification } from '@/lib/types';

export default function NotificationToastManager() {
  const { notifications } = useNotifications();
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
          />
        </div>
      ))}
    </div>
  );
}
