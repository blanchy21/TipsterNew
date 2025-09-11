"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification, NotificationSettings } from "../types";
import { useAuth } from "../hooks/useAuth";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead as markAllAsReadFirebase,
  createNotification as createNotificationFirebase,
  deleteNotification as deleteNotificationFirebase
} from "../firebase/firebaseUtils";
import { onSnapshot, query, collection, where, orderBy, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";

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
        console.error('Error loading notification settings:', error);
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

    // Try the optimized query first, fallback to simpler query if index doesn't exist
    let q;
    try {
      q = query(
        notificationsRef,
        where("recipientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
    } catch (error) {
      console.warn('Composite index not found, using simpler query:', error);
      // Fallback to query without orderBy if index doesn't exist
      q = query(
        notificationsRef,
        where("recipientId", "==", user.uid)
      );
    }

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
      console.error('Error listening to notifications:', error);
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
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
      console.error('Error marking all notifications as read:', error);
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
      console.error('Error deleting notification:', error);
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
      console.error('Error clearing all notifications:', error);
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
