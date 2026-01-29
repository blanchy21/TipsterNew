import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  writeBatch,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDocuments } from "./firestore-helpers";
import { getUserProfile } from "./profile-utils";
import { User } from "@/lib/types";

export const testFirebaseConnection = async () => {
  if (!db) {
    return { success: false, error: "Firebase not initialized" };
  }

  try {
    const testRef = collection(db, 'test');
    const testDoc = await addDoc(testRef, {
      test: true,
      timestamp: new Date()
    });

    await deleteDoc(testDoc);

    return { success: true, docId: testDoc.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const inspectFirebaseData = async () => {
  if (!db) {
    return { success: false, error: "Firebase not initialized" };
  }

  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      posts,
      users,
      postsCount: posts.length,
      usersCount: users.length
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const getUserStats = async (userId: string): Promise<{
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
}> => {
  if (!db) {
    return { totalPosts: 0, totalLikes: 0, totalComments: 0, engagementRate: 0 };
  }

  try {
    const posts = await getDocuments('posts');
    const userPosts = posts.filter((post: any) => post.user.id === userId);

    const comments = await getDocuments('comments');
    const userComments = comments.filter((comment: any) => comment.user.id === userId);

    const totalPosts = userPosts.length;
    const totalLikes = userPosts.reduce((sum: number, post: any) => sum + (post.likes || 0), 0);
    const totalComments = userComments.length;
    const engagementRate = totalPosts > 0 ? Math.round((totalLikes / totalPosts) * 100) / 100 : 0;

    return { totalPosts, totalLikes, totalComments, engagementRate };
  } catch (error) {
    return { totalPosts: 0, totalLikes: 0, totalComments: 0, engagementRate: 0 };
  }
};

export const deleteUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  if (!db) {
    return { success: false, error: "Firebase Firestore not available" };
  }

  try {
    const batch = writeBatch(db);

    const postsSnapshot = await getDocs(query(collection(db, 'posts'), where('userId', '==', userId)));
    postsSnapshot.docs.forEach(doc => { batch.delete(doc.ref); });

    const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('userId', '==', userId)));
    commentsSnapshot.docs.forEach(doc => { batch.delete(doc.ref); });

    const notificationsSnapshot = await getDocs(query(collection(db, 'notifications'), where('recipientId', '==', userId)));
    notificationsSnapshot.docs.forEach(doc => { batch.delete(doc.ref); });

    const allUsersSnapshot = await getDocs(collection(db, 'users'));
    allUsersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.followers?.includes(userId)) {
        batch.update(doc.ref, {
          followers: arrayRemove(userId),
          followersCount: Math.max(0, (userData.followersCount || 0) - 1)
        });
      }
      if (userData.following?.includes(userId)) {
        batch.update(doc.ref, {
          following: arrayRemove(userId),
          followingCount: Math.max(0, (userData.followingCount || 0) - 1)
        });
      }
    });

    const allPostsSnapshot = await getDocs(collection(db, 'posts'));
    allPostsSnapshot.docs.forEach(doc => {
      const postData = doc.data();
      if (postData.likedBy?.includes(userId)) {
        const newLikedBy = postData.likedBy.filter((id: string) => id !== userId);
        batch.update(doc.ref, {
          likedBy: newLikedBy,
          likes: Math.max(0, (postData.likes || 0) - 1)
        });
      }
    });

    const allCommentsSnapshot = await getDocs(collection(db, 'comments'));
    allCommentsSnapshot.docs.forEach(doc => {
      const commentData = doc.data();
      if (commentData.likedBy?.includes(userId)) {
        const newLikedBy = commentData.likedBy.filter((id: string) => id !== userId);
        batch.update(doc.ref, {
          likedBy: newLikedBy,
          likes: Math.max(0, (commentData.likes || 0) - 1)
        });
      }
    });

    const base64ImagesSnapshot = await getDocs(query(collection(db, 'base64Images'), where('userId', '==', userId)));
    base64ImagesSnapshot.docs.forEach(doc => { batch.delete(doc.ref); });

    const userRef = doc(db, 'users', userId);
    batch.delete(userRef);

    await batch.commit();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete user'
    };
  }
};

export const deleteTestUsers = async (testUserNames: string[]): Promise<{ success: boolean; deletedUsers: string[]; errors: string[] }> => {
  if (!db) {
    return { success: false, deletedUsers: [], errors: ["Firebase Firestore not available"] };
  }

  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const testUsers = users.filter((user: any) => {
      const name = user.displayName || user.name || '';
      return testUserNames.some(testName =>
        name.toLowerCase().includes(testName.toLowerCase()) ||
        testName.toLowerCase().includes(name.toLowerCase())
      );
    });

    const deletedUsers: string[] = [];
    const errors: string[] = [];

    for (const testUser of testUsers) {
      try {
        const result = await deleteUser(testUser.id);
        if (result.success) {
          deletedUsers.push((testUser as any).displayName || (testUser as any).name || testUser.id);
        } else {
          errors.push(`Failed to delete ${(testUser as any).displayName || (testUser as any).name}: ${result.error}`);
        }
      } catch (error: any) {
        errors.push(`Error deleting ${(testUser as any).displayName || (testUser as any).name}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      deletedUsers,
      errors
    };
  } catch (error: any) {
    return {
      success: false,
      deletedUsers: [],
      errors: [error.message || 'Failed to delete test users']
    };
  }
};
