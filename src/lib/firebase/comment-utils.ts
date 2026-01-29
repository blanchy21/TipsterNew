import { db } from "./firebase";
import {
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Comment, CommentFormData } from "@/lib/types";
import { addDocument, getDocuments, updateDocument, deleteDocument } from "./firestore-helpers";
import { getUserProfile } from "./profile-utils";
import { getDefaultAvatar } from "@/lib/imageUtils";
import { createNotification } from "./notification-utils";
import { incrementPostCommentCount, decrementPostCommentCount } from "./post-utils";

export const createComment = async (postId: string, userId: string, commentData: CommentFormData): Promise<Comment | null> => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const newComment: any = {
      postId,
      userId: userProfile.id,
      user: {
        id: userProfile.id,
        name: userProfile.name || 'Anonymous',
        handle: userProfile.handle || `@${(userProfile.name || 'user').toLowerCase().replace(/\s+/g, '')}`,
        avatar: userProfile.avatar || getDefaultAvatar()
      },
      content: commentData.content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isEdited: false
    };

    if (commentData.parentId) {
      newComment.parentId = commentData.parentId;
    }

    const docRef = await addDocument('comments', newComment);
    const createdComment = { id: docRef.id, ...newComment };

    await incrementPostCommentCount(postId);

    const postDoc = await getDoc(doc(db, "posts", postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const postOwnerId = postData.userId;

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
    return false;
  }
};

export const deleteComment = async (commentId: string, postId: string): Promise<boolean> => {
  if (!db) {
    throw new Error("Firebase Firestore not available");
  }

  try {
    await deleteDocument('comments', commentId);
    await decrementPostCommentCount(postId);
    return true;
  } catch (error) {
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

      if (isLiked) {
        await updateDocument('comments', commentId, {
          likes: commentData.likes + 1,
          likedBy: arrayUnion(userId)
        });
      } else {
        await updateDocument('comments', commentId, {
          likes: Math.max(0, commentData.likes - 1),
          likedBy: arrayRemove(userId)
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
