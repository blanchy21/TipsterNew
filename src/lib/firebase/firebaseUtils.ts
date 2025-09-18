import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  getDoc,
  setDoc,
  query,
  where,
  increment,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { User, Post, Comment, CommentFormData, Notification } from "@/lib/types";
import { normalizeImageUrl } from "@/lib/imageUtils";

// Auth functions
export const logoutUser = () => {
  if (!auth) {

    return Promise.resolve();
  }
  return signOut(auth);
};

export const signInWithGoogle = async () => {
  if (!auth) {

    throw new Error("Firebase auth not available");
  }

  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) => {
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

// Notification functions
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
    const docRef = await addDoc(collection(db, "notifications"), notificationPayload);
    const notification: Notification = {
      ...notificationPayload,
      id: docRef.id,
    };

    return docRef.id;
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  if (!db) {

    return [];
  }

  // Get notifications where the user is the recipient
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
    // Console statement removed for production
    throw error;
  }
};

export const deletePost = async (postId: string) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    await deleteDoc(doc(db, "posts", postId));

  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const updateDocument = (collectionName: string, id: string, data: any) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    return updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    // Console statement removed for production
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
    // Console statement removed for production
    throw error;
  }
};


// Like functions
export const likePost = async (postId: string, userId: string) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    // Get post details to find the post owner
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();
    const postOwnerId = postData.userId;

    // Don't create notification if user is liking their own post
    if (postOwnerId !== userId) {
      // Get user profile for notification
      const userProfile = await getUserProfile(userId);
      if (userProfile) {
        await createNotification({
          type: 'like',
          title: 'New Like',
          message: `${userProfile.name} liked your post`,
          user: userProfile,
          postId: postId,
          recipientId: postOwnerId,
          actionUrl: `/post/${postId}`
        });
      }
    }

    const postRef = doc(db, "posts", postId);
    return updateDoc(postRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1) // Properly increment the likes count
    });
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  const postRef = doc(db, "posts", postId);
  return updateDoc(postRef, {
    likedBy: arrayRemove(userId),
    likes: increment(-1) // Properly decrement the likes count
  });
};

// Helper function to ensure user profile exists
const ensureUserProfileExists = async (userId: string) => {
  if (!db) {

    return;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {

    // Create a minimal user profile
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

  } else {

  }
};

// Export function to check if user profile exists (for debugging)
export const checkUserProfileExists = async (userId: string): Promise<boolean> => {
  if (!db) {

    return false;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
};

// Follow functions
export const followUser = async (followerId: string, followingId: string) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    // Ensure both user profiles exist before attempting follow operation
    await ensureUserProfileExists(followerId);
    await ensureUserProfileExists(followingId);

    // Get follower profile for notification
    const followerProfile = await getUserProfile(followerId);

    const batch = writeBatch(db);

    // Add to follower's following list
    const followerRef = doc(db, "users", followerId);
    batch.update(followerRef, {
      following: arrayUnion(followingId),
      followingCount: 1 // This will be handled by a cloud function in production
    });

    // Add to following user's followers list
    const followingRef = doc(db, "users", followingId);
    batch.update(followingRef, {
      followers: arrayUnion(followerId),
      followersCount: 1 // This will be handled by a cloud function in production
    });

    await batch.commit();

    // Create notification for the user being followed
    if (followerProfile) {
      await createNotification({
        type: 'follow',
        title: 'New Follower',
        message: `${followerProfile.name} started following you`,
        user: followerProfile,
        recipientId: followingId,
        actionUrl: `/profile/${followerId}`
      });
    }

    return Promise.resolve();
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  // Ensure both user profiles exist before attempting unfollow operation
  await ensureUserProfileExists(followerId);
  await ensureUserProfileExists(followingId);

  const batch = writeBatch(db);

  // Remove from follower's following list
  const followerRef = doc(db, "users", followerId);
  batch.update(followerRef, {
    following: arrayRemove(followingId),
    followingCount: -1 // This will be handled by a cloud function in production
  });

  // Remove from following user's followers list
  const followingRef = doc(db, "users", followingId);
  batch.update(followingRef, {
    followers: arrayRemove(followerId),
    followersCount: -1 // This will be handled by a cloud function in production
  });

  return batch.commit();
};

export const checkIfFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  if (!db) {

    return false;
  }

  const userRef = doc(db, "users", followerId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return false;
  }

  const userData = userDoc.data();
  return userData.following?.includes(followingId) || false;
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  if (!db) {

    return [];
  }

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const followerIds = userData.followers || [];

  if (followerIds.length === 0) {
    return [];
  }

  const followers = await Promise.all(
    followerIds.map(async (followerId: string) => {
      const followerRef = doc(db, "users", followerId);
      const followerDoc = await getDoc(followerRef);
      if (followerDoc.exists()) {
        const followerData = followerDoc.data();
        return {
          id: followerDoc.id,
          name: followerData.displayName || followerData.name || 'Anonymous User',
          handle: followerData.handle || `@user${followerDoc.id.slice(0, 8)}`,
          avatar: normalizeImageUrl(followerData.photoURL || followerData.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'),
          followers: followerData.followers || [],
          following: followerData.following || [],
          followersCount: followerData.followersCount || 0,
          followingCount: followerData.followingCount || 0,
          bio: followerData.bio || '',
          location: followerData.location || '',
          website: followerData.website || '',
          socialMedia: followerData.socialMedia || {},
          profilePhotos: followerData.profilePhotos || [],
          coverPhoto: followerData.coverPhoto || '',
          specializations: followerData.specializations || [],
          memberSince: followerData.memberSince || new Date().toISOString(),
          isVerified: followerData.isVerified || false,
          privacy: followerData.privacy || {
            showEmail: false,
            showPhone: false,
            showLocation: false,
            showSocialMedia: false
          },
          preferences: followerData.preferences || {
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
        };
      }
      return null;
    })
  );

  return followers.filter(Boolean) as User[];
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  if (!db) {

    return [];
  }

  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return [];
  }

  const userData = userDoc.data();
  const followingIds = userData.following || [];

  if (followingIds.length === 0) {
    return [];
  }

  const following = await Promise.all(
    followingIds.map(async (followingId: string) => {
      const followingRef = doc(db, "users", followingId);
      const followingDoc = await getDoc(followingRef);
      if (followingDoc.exists()) {
        const followingData = followingDoc.data();
        return {
          id: followingDoc.id,
          name: followingData.displayName || followingData.name || 'Anonymous User',
          handle: followingData.handle || `@user${followingDoc.id.slice(0, 8)}`,
          avatar: normalizeImageUrl(followingData.photoURL || followingData.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'),
          followers: followingData.followers || [],
          following: followingData.following || [],
          followersCount: followingData.followersCount || 0,
          followingCount: followingData.followingCount || 0,
          bio: followingData.bio || '',
          location: followingData.location || '',
          website: followingData.website || '',
          socialMedia: followingData.socialMedia || {},
          profilePhotos: followingData.profilePhotos || [],
          coverPhoto: followingData.coverPhoto || '',
          specializations: followingData.specializations || [],
          memberSince: followingData.memberSince || new Date().toISOString(),
          isVerified: followingData.isVerified || false,
          privacy: followingData.privacy || {
            showEmail: false,
            showPhone: false,
            showLocation: false,
            showSocialMedia: false
          },
          preferences: followingData.preferences || {
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
        };
      }
      return null;
    })
  );

  return following.filter(Boolean) as User[];
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  if (!storage) {

    throw new Error("Firebase Storage not available");
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Sports App Specific Functions

// User Profile Management
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
      // Use setDoc to create with specific document ID (user.uid)
      await setDoc(userRef, {
        id: user.uid,
        displayName,
        name: displayName, // Also store as name for compatibility
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
      // Console statement removed for production
      throw error;
    }
  } else {

  }

  return userRef;
};

// Firebase Diagnostics
export const testFirebaseConnection = async () => {
  if (!db) {

    return { success: false, error: "Firebase not initialized" };
  }

  try {

    // Try to read from a test collection
    const testRef = collection(db, 'test');
    const testDoc = await addDoc(testRef, {
      test: true,
      timestamp: new Date()
    });

    // Clean up test document
    await deleteDoc(testDoc);

    return { success: true, docId: testDoc.id };
  } catch (error: any) {
    // Console statement removed for production
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Check what's actually in the Firebase database
export const inspectFirebaseData = async () => {
  if (!db) {

    return { success: false, error: "Firebase not initialized" };
  }

  try {

    // Check posts collection
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Check users collection
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      posts: posts,
      users: users,
      postsCount: posts.length,
      usersCount: users.length
    };
  } catch (error: any) {
    // Console statement removed for production
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

// Posts Management
export const createPost = async (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'> & { user: Post['user'] }) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {

    const newPost = {
      ...postData,
      userId: postData.user?.id, // Add userId field for security rules
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      views: 0,
      likedBy: []
    };

    const docRef = await addDocument('posts', newPost);

    const createdPost = {
      id: docRef.id,
      ...newPost,
      user: postData.user // Ensure user property is included for Post type
    };

    return createdPost;
  } catch (error: any) {
    // Console statement removed for production
    // Error details logged for debugging

    // If it's a permission error, provide a more helpful message
    if (error.code === 'permission-denied') {
      throw new Error('Permission denied. Please make sure you are signed in and have permission to create posts.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('You must be signed in to create posts.');
    }

    throw error;
  }
};

export const getPosts = async () => {
  if (!db) {

    return [];
  }

  try {

    const posts = await getDocuments('posts');

    const processedPosts = posts.map((post: any) => ({
      ...post,
      createdAt: post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : post.createdAt
    }));

    const sortedPosts = processedPosts.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    return sortedPosts;
  } catch (error: any) {
    // Console statement removed for production
    // Error details logged for debugging

    // If it's a permission error, return empty array but don't crash
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {

      return [];
    }

    return [];
  }
};

export const togglePostLike = async (postId: string, userId: string, isLiked: boolean) => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];

      if (isLiked) {
        // Add like
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      } else {
        // Remove like
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      }
    }
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const incrementPostViews = async (postId: string) => {
  if (!db) {

    return;
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      await updateDocument('posts', postId, {
        views: (postData.views || 0) + 1
      });
    }
  } catch (error) {
    // Console statement removed for production
  }
};

// Profile Management Functions
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: userSnap.id,
        name: userData.displayName || userData.name || 'Anonymous User',
        handle: userData.handle || `@user${userSnap.id.slice(0, 8)}`,
        avatar: normalizeImageUrl(userData.photoURL || userData.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'),
        followers: userData.followers || [],
        following: userData.following || [],
        followersCount: userData.followersCount || 0,
        followingCount: userData.followingCount || 0,
        bio: userData.bio || '',
        location: userData.location || '',
        website: userData.website || '',
        socialMedia: userData.socialMedia || {},
        profilePhotos: userData.profilePhotos || [],
        coverPhoto: userData.coverPhoto || '',
        specializations: userData.specializations || [],
        memberSince: userData.memberSince || new Date().toISOString(),
        isVerified: userData.isVerified || false,
        privacy: userData.privacy || {
          showEmail: false,
          showPhone: false,
          showLocation: false,
          showSocialMedia: false
        },
        preferences: userData.preferences || {
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
      };
    }
    return null;
  } catch (error) {
    // Console statement removed for production
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
    // Console statement removed for production
    return false;
  }
};

export const uploadProfileImage = async (userId: string, file: File, type: 'avatar' | 'cover' | 'gallery'): Promise<string | null> => {
  // In development, use base64 fallback to avoid CORS issues
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Console statement removed for production
    return await uploadImageAsBase64(userId, file, type);
  }

  try {
    // Check if Firebase Storage is available
    if (!storage) {
      // Console statement removed for production
      return await uploadImageAsBase64(userId, file, type);
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profiles/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    // Console statement removed for production

    // Fallback to base64 for any Firebase Storage error (including CORS)
    if (error.code === 'storage/unauthorized' ||
      error.code === 'storage/invalid-argument' ||
      error.message?.includes('CORS') ||
      error.message?.includes('cors') ||
      error.message?.includes('blocked') ||
      error.message?.includes('preflight')) {
      // Console statement removed for production
      return await uploadImageAsBase64(userId, file, type);
    }

    // For any other error, also try base64 fallback
    // Console statement removed for production
    return await uploadImageAsBase64(userId, file, type);
  }
};

// Fallback function to upload images as base64 to Firestore
const uploadImageAsBase64 = async (userId: string, file: File, type: 'avatar' | 'cover' | 'gallery'): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const base64String = e.target?.result as string;
        const fileName = `${type}_${userId}_${Date.now()}`;

        // Store base64 image in Firestore
        const imageDoc = {
          userId,
          type,
          fileName,
          base64Data: base64String,
          uploadedAt: new Date().toISOString(),
          size: file.size,
          contentType: file.type
        };

        // Store in a temporary collection for base64 images
        await addDocument('base64Images', imageDoc);

        // Console statement removed for production
        // Return the base64 string as the URL
        resolve(base64String);
      } catch (error) {
        // Console statement removed for production
        reject(error);
      }
    };

    reader.onerror = () => {
      // Console statement removed for production
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
    // Console statement removed for production
    return false;
  }
};

export const updateUserAvatar = async (userId: string, avatarUrl: string): Promise<boolean> => {
  try {
    await updateUserProfile(userId, { avatar: avatarUrl });
    return true;
  } catch (error: any) {
    // Console statement removed for production
    // Handle COEP and other Firestore connection errors gracefully
    if (error.message?.includes('COEP') ||
      error.message?.includes('NotSameOriginAfterDefaultedToSameOriginByCoep') ||
      error.message?.includes('blocked')) {
      // Console statement removed for production
      return false;
    }
    return false;
  }
};

export const updateUserCoverPhoto = async (userId: string, coverPhotoUrl: string): Promise<boolean> => {
  try {
    await updateUserProfile(userId, { coverPhoto: coverPhotoUrl });
    return true;
  } catch (error: any) {
    // Console statement removed for production
    // Handle COEP and other Firestore connection errors gracefully
    if (error.message?.includes('COEP') ||
      error.message?.includes('NotSameOriginAfterDefaultedToSameOriginByCoep') ||
      error.message?.includes('blocked')) {
      // Console statement removed for production
      return false;
    }
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
    // Console statement removed for production
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
    // Console statement removed for production
    return false;
  }
};

// Following System Functions
export const getFollowingUsers = async (userId: string): Promise<User[]> => {
  if (!db) {

    return [];
  }

  try {
    const following = await getUserFollowing(userId);
    return following;
  } catch (error) {
    // Console statement removed for production
    return [];
  }
};

export const getFollowers = async (userId: string): Promise<User[]> => {
  if (!db) {

    return [];
  }

  try {
    const followers = await getUserFollowers(userId);
    return followers;
  } catch (error) {
    // Console statement removed for production
    return [];
  }
};

export const getFollowSuggestions = async (userId: string, limit: number = 10): Promise<User[]> => {
  if (!db) {

    return [];
  }

  try {
    // Get all users from Firestore
    const allUsers = await getDocuments('users');

    // Get current user's following list
    const currentUser = await getUserProfile(userId);
    const followingIds = currentUser?.following || [];

    // Filter out current user, already followed users, and deleted users
    const suggestions = allUsers
      .filter((user: any) => {
        // Skip if it's the current user
        if (user.id === userId) return false;

        // Skip if already following
        if (followingIds.includes(user.id)) return false;

        // Skip if user is marked as deleted
        if (user.deleted) return false;

        return true;
      })
      .slice(0, limit)
      .map((user: any) => ({
        id: user.id,
        name: user.displayName || user.name || 'Anonymous',
        handle: user.handle || `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        avatar: normalizeImageUrl(user.photoURL || user.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'),
        bio: user.bio || '',
        specializations: user.specializations || [],
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        isVerified: user.isVerified || false
      }));

    return suggestions;
  } catch (error) {
    // Console statement removed for production
    return [];
  }
};

export const searchUsers = async (query: string, limit: number = 20): Promise<User[]> => {
  if (!db) {

    return [];
  }

  try {
    const allUsers = await getDocuments('users');
    const searchQuery = query.toLowerCase();

    const results = allUsers
      .filter((user: any) => {
        const name = (user.displayName || user.name || '').toLowerCase();
        const handle = (user.handle || '').toLowerCase();
        const bio = (user.bio || '').toLowerCase();

        return name.includes(searchQuery) ||
          handle.includes(searchQuery) ||
          bio.includes(searchQuery);
      })
      .slice(0, limit)
      .map((user: any) => ({
        id: user.id,
        name: user.displayName || user.name || 'Anonymous',
        handle: user.handle || `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
        avatar: normalizeImageUrl(user.photoURL || user.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'),
        bio: user.bio || '',
        specializations: user.specializations || [],
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        isVerified: user.isVerified || false
      }));

    return results;
  } catch (error) {
    // Console statement removed for production
    return [];
  }
};

// Comments Management Functions
export const createComment = async (postId: string, userId: string, commentData: CommentFormData): Promise<Comment | null> => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    // Get user profile
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const newComment: any = {
      postId,
      userId: userProfile.id, // Add userId field for security rules
      user: {
        id: userProfile.id,
        name: userProfile.name || 'Anonymous',
        handle: userProfile.handle || `@${(userProfile.name || 'user').toLowerCase().replace(/\s+/g, '')}`,
        avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
      },
      content: commentData.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isEdited: false
    };

    // Only add parentId if it exists
    if (commentData.parentId) {
      newComment.parentId = commentData.parentId;
    }

    const docRef = await addDocument('comments', newComment);
    const createdComment = { id: docRef.id, ...newComment };

    // Update post comment count
    await incrementPostCommentCount(postId);

    // Get post details to find the post owner and create notification
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const postOwnerId = postData.userId;

      // Don't create notification if user is commenting on their own post
      if (postOwnerId !== userId) {
        await createNotification({
          type: 'comment',
          title: 'New Comment',
          message: `${userProfile.name} commented on your post`,
          user: userProfile,
          postId: postId,
          recipientId: postOwnerId,
          actionUrl: `/post/${postId}`
        });
      }
    }

    return createdComment;
  } catch (error) {
    // Console statement removed for production
    throw error;
  }
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  if (!db) {

    return [];
  }

  try {
    const comments = await getDocuments('comments');
    const postComments = comments
      .filter((comment: any) => comment.postId === postId)
      .map((comment: any) => ({
        ...comment,
        createdAt: comment.createdAt?.toDate ? comment.createdAt.toDate().toISOString() : comment.createdAt,
        editedAt: comment.editedAt?.toDate ? comment.editedAt.toDate().toISOString() : comment.editedAt
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return postComments;
  } catch (error) {
    // Console statement removed for production
    return [];
  }
};

export const updateComment = async (commentId: string, content: string): Promise<boolean> => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    await updateDocument('comments', commentId, {
      content,
      isEdited: true,
      editedAt: new Date()
    });
    return true;
  } catch (error) {
    // Console statement removed for production
    return false;
  }
};

export const deleteComment = async (commentId: string, postId: string): Promise<boolean> => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    await deleteDocument('comments', commentId);

    // Decrement post comment count
    await decrementPostCommentCount(postId);

    return true;
  } catch (error) {
    // Console statement removed for production
    return false;
  }
};

export const toggleCommentLike = async (commentId: string, userId: string, isLiked: boolean): Promise<boolean> => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    const commentRef = doc(db, 'comments', commentId);
    const commentSnap = await getDoc(commentRef);

    if (commentSnap.exists()) {
      const commentData = commentSnap.data();
      const likedBy = commentData.likedBy || [];

      if (isLiked) {
        // Add like
        await updateDocument('comments', commentId, {
          likes: commentData.likes + 1,
          likedBy: arrayUnion(userId)
        });
      } else {
        // Remove like
        await updateDocument('comments', commentId, {
          likes: Math.max(0, commentData.likes - 1),
          likedBy: arrayRemove(userId)
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    // Console statement removed for production
    return false;
  }
};

export const incrementPostCommentCount = async (postId: string): Promise<void> => {
  if (!db) {

    return;
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      await updateDocument('posts', postId, {
        comments: (postData.comments || 0) + 1
      });
    }
  } catch (error) {
    // Console statement removed for production
  }
};

export const decrementPostCommentCount = async (postId: string): Promise<void> => {
  if (!db) {

    return;
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const postData = postSnap.data();
      await updateDocument('posts', postId, {
        comments: Math.max(0, (postData.comments || 0) - 1)
      });
    }
  } catch (error) {
    // Console statement removed for production
  }
};

// User Stats Functions
export const getUserStats = async (userId: string): Promise<{
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
}> => {
  if (!db) {

    return {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      engagementRate: 0
    };
  }

  try {
    // Get all posts by the user
    const posts = await getDocuments('posts');
    const userPosts = posts.filter((post: any) => post.user.id === userId);

    // Get all comments by the user
    const comments = await getDocuments('comments');
    const userComments = comments.filter((comment: any) => comment.user.id === userId);

    // Calculate totals
    const totalPosts = userPosts.length;
    const totalLikes = userPosts.reduce((sum: number, post: any) => sum + (post.likes || 0), 0);
    const totalComments = userComments.length;

    // Calculate engagement rate (simplified: likes per post)
    const engagementRate = totalPosts > 0 ? Math.round((totalLikes / totalPosts) * 100) / 100 : 0;

    return {
      totalPosts,
      totalLikes,
      totalComments,
      engagementRate
    };
  } catch (error) {
    // Console statement removed for production
    return {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      engagementRate: 0
    };
  }
};

export const updatePost = async (postId: string, data: Partial<Post>): Promise<boolean> => {
  if (!db) {

    throw new Error("Firebase Firestore not available");
  }

  try {
    await updateDocument('posts', postId, data);
    return true;
  } catch (error) {
    // Console statement removed for production
    return false;
  }
};
