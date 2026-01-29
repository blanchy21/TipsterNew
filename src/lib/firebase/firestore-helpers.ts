import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export const addDocument = (collectionName: string, data: Record<string, unknown>) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }
  return addDoc(collection(db, collectionName), data);
};

export const getDocuments = async (collectionName: string) => {
  if (!db) {
    return [];
  }
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: Record<string, unknown>) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    return updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    throw error;
  }
};

export const deleteDocument = (collectionName: string, id: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    return deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    throw error;
  }
};
