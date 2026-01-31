import { db, storage } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User } from "@/lib/types";
import { normalizeImageUrl, getDefaultAvatar } from "@/lib/imageUtils";
import { addDocument, updateDocument } from "./firestore-helpers";

const buildUserDefaults = (data: any, id: string): User => ({
  id,
  name: data.displayName || data.name || 'Anonymous User',
  handle: data.handle || `@user${id.slice(0, 8)}`,
  avatar: normalizeImageUrl(data.avatar || data.photoURL || getDefaultAvatar()),
  followers: data.followers || [],
  following: data.following || [],
  followersCount: data.followersCount || 0,
  followingCount: data.followingCount || 0,
  bio: data.bio || '',
  location: data.location || '',
  website: data.website || '',
  socialMedia: data.socialMedia || {},
  profilePhotos: data.profilePhotos || [],
  coverPhoto: data.coverPhoto || '',
  specializations: data.specializations || [],
  memberSince: data.memberSince || new Date().toISOString(),
  isVerified: data.isVerified || false,
  privacy: data.privacy || {
    showEmail: false,
    showPhone: false,
    showLocation: false,
    showSocialMedia: false
  },
  preferences: data.preferences || {
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      mentions: true,
      system: true
    },
    theme: 'dark',
    language: 'en'
  }
});

export const ensureUserProfileExists = async (userId: string) => {
  if (!db) {
    return;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      id: userId,
      displayName: 'User',
      email: '',
      photoURL: '',
      createdAt: new Date(),
      followers: [],
      following: [],
      followersCount: 0,
      followingCount: 0,
      bio: '',
      favoriteSports: [],
      isVerified: false
    });
  }
};

export const checkUserProfileExists = async (userId: string): Promise<boolean> => {
  if (!db) {
    return false;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
};

export const createUserProfile = async (user: any, additionalData: any = {}) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        id: user.uid,
        displayName,
        name: displayName,
        email,
        photoURL,
        handle: `@${displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        createdAt,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        ...additionalData
      });
    } catch (error) {
      throw error;
    }
  }

  return userRef;
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return buildUserDefaults(userSnap.data(), userSnap.id);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<User>): Promise<boolean> => {
  try {
    await updateDocument('users', userId, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const uploadProfileImage = async (userId: string, file: File, type: 'avatar' | 'cover' | 'gallery'): Promise<string | null> => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return await uploadImageAsBase64(userId, file, type);
  }

  try {
    if (!storage) {
      return await uploadImageAsBase64(userId, file, type);
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profiles/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    return await uploadImageAsBase64(userId, file, type);
  }
};

const uploadImageAsBase64 = async (userId: string, file: File, type: 'avatar' | 'cover' | 'gallery'): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const base64String = e.target?.result as string;
        const fileName = `${type}_${userId}_${Date.now()}`;

        const imageDoc = {
          userId,
          type,
          fileName,
          base64Data: base64String,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          contentType: file.type
        };

        await addDocument('base64Images', imageDoc);
        resolve(base64String);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

export const deleteProfileImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    return false;
  }
};

export const updateUserAvatar = async (userId: string, avatarUrl: string): Promise<boolean> => {
  try {
    await updateUserProfile(userId, { avatar: avatarUrl });
    return true;
  } catch (error: any) {
    return false;
  }
};

export const updateUserCoverPhoto = async (userId: string, coverPhotoUrl: string): Promise<boolean> => {
  try {
    await updateUserProfile(userId, { coverPhoto: coverPhotoUrl });
    return true;
  } catch (error: any) {
    return false;
  }
};

export const addProfilePhoto = async (userId: string, photoUrl: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      const currentPhotos = userProfile.profilePhotos || [];
      const updatedPhotos = [...currentPhotos, photoUrl];
      await updateUserProfile(userId, { profilePhotos: updatedPhotos });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const removeProfilePhoto = async (userId: string, photoUrl: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      const currentPhotos = userProfile.profilePhotos || [];
      const updatedPhotos = currentPhotos.filter(url => url !== photoUrl);
      await updateUserProfile(userId, { profilePhotos: updatedPhotos });
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
