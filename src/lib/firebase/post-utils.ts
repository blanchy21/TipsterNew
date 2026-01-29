import { db } from "./firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Post } from "@/lib/types";
import { addDocument, getDocuments, updateDocument } from "./firestore-helpers";
import { getUserProfile } from "./profile-utils";
import { createNotification } from "./notification-utils";

export const deletePost = async (postId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    throw error;
  }
};

export const likePost = async (postId: string, userId: string) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (!postDoc.exists()) {
      throw new Error("Post not found");
    }

    const postData = postDoc.data();
    const postOwnerId = postData.userId;

    if (postOwnerId !== userId) {
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
      likes: increment(1)
    });
  } catch (error) {
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
    likes: increment(-1)
  });
};

export const createPost = async (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'> & { user: Post['user'] }) => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    const newPost = {
      ...postData,
      userId: postData.user?.id,
      createdAt: new Date(),
      likes: 0,
      comments: 0,
      views: 0,
      likedBy: [],
      tipStatus: 'pending'
    };

    const docRef = await addDocument('posts', newPost);

    const createdPost = {
      id: docRef.id,
      ...newPost,
      user: postData.user
    };

    return createdPost;
  } catch (error: any) {
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
    if (error.code === 'permission-denied' || error.code === 'unauthenticated') {
      return [];
    }

    return [];
  }
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  if (!db) {
    return null;
  }

  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));

    if (!postDoc.exists()) {
      return null;
    }

    const postData = postDoc.data();
    return {
      ...postData,
      id: postDoc.id,
      createdAt: postData.createdAt?.toDate ? postData.createdAt.toDate().toISOString() : postData.createdAt
    } as Post;
  } catch (error) {
    return null;
  }
};

export const togglePostLike = async (postId: string, userId: string, isLiked: boolean) => {
  if (!db) {
    return;
  }

  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(userId)
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(userId)
        });
      }
    }
  } catch (error) {
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
    // Silently fail for view counting
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
    // Silently fail for comment count
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
    // Silently fail for comment count
  }
};
