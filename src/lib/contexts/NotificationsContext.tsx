"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, NotificationSettings } from "@/lib/types";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead as markAllAsReadFirebase,
  createNotification as createNotificationFirebase,
  deleteNotification as deleteNotificationFirebase
} from "@/lib/firebase/firebaseUtils";
import { onSnapshot, query, collection, where, orderBy, getDocs, writeBatch, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  clearAllNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  settings: {
    likes: true,
    comments: true,
    follows: true,
    tips: true,
    matchResults: true,
    system: true,
  },
  addNotification: () => { },
  markAsRead: () => { },
  markAllAsRead: () => { },
  deleteNotification: () => { },
  updateSettings: () => { },
  clearAllNotifications: () => { },
});

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    likes: true,
    comments: true,
    follows: true,
    tips: true,
    matchResults: true,
    system: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        // Console statement removed for production
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Set up real-time listener for notifications when user is authenticated
  useEffect(() => {
    if (!user || !db) {
      // Clear notifications when not authenticated
      setNotifications([]);
      return;
    }

    const notificationsRef = collection(db, "notifications");

    // Use simple query without orderBy to avoid index requirements
    // Sorting will be done in JavaScript for better performance
    // Limit to 50 notifications to improve performance
    const q = query(
      notificationsRef,
      where("recipientId", "==", user.uid),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          recipientId: data.recipientId || user.uid // Ensure recipientId exists
        } as Notification;
      });

      // Sort by createdAt if we couldn't use orderBy in the query
      const sortedData = notificationsData.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sortedData);
    }, (error) => {
      // Console statement removed for production
      // Clear notifications on error
      setNotifications([]);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;

    try {
      await createNotificationFirebase({
        ...notificationData,
        recipientId: user.uid
      });
    } catch (error) {
      // Console statement removed for production
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      // Console statement removed for production
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await markAllAsReadFirebase(user.uid);
    } catch (error) {
      // Console statement removed for production
      // Fallback to local state update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  const deleteNotification = async (id: string) => {

    try {
      await deleteNotificationFirebase(id);

    } catch (error) {
      // Console statement removed for production
      // Fallback to local state update

      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearAllNotifications = async () => {
    if (!user) return;

    try {
      // Delete all notifications for the user
      const notificationsRef = collection(db, "notifications");
      const q = query(notificationsRef, where("recipientId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      // Console statement removed for production
      // Fallback to local state update
      setNotifications([]);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        settings,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updateSettings,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
