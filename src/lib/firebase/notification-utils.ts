import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Notification } from "@/lib/types";
import { addDocument } from "./firestore-helpers";

export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  const notificationPayload = {
    ...notificationData,
    createdAt: new Date().toISOString(),
    read: false,
  };

  try {
    const docRef = await addDocument("notifications", notificationPayload);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  if (!db) {
    return [];
  }

  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("recipientId", "==", userId), orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Notification[];
};

export const markNotificationAsRead = async (notificationId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  return updateDoc(doc(db, "notifications", notificationId), {
    read: true
  });
};

export const markAllNotificationsAsRead = async (userId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("recipientId", "==", userId), where("read", "==", false));

  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);

  querySnapshot.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });

  return batch.commit();
};

export const deleteNotification = async (notificationId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    await deleteDoc(doc(db, "notifications", notificationId));
  } catch (error) {
    throw error;
  }
};
