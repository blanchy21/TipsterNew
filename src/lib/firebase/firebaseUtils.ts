/**
 * Barrel re-export file for backward compatibility.
 * All Firebase utility functions are now split into focused modules:
 * - auth-utils.ts: Authentication (login, logout)
 * - firestore-helpers.ts: Generic CRUD operations
 * - notification-utils.ts: Notification management
 * - post-utils.ts: Post CRUD, likes, views
 * - profile-utils.ts: User profile management
 * - follow-utils.ts: Follow/unfollow, suggestions, search
 * - comment-utils.ts: Comment CRUD, likes
 * - admin-utils.ts: Admin operations, user deletion, diagnostics
 * - storage-utils.ts: File upload
 */

export { logoutUser, signInWithGoogle } from "./auth-utils";
export { addDocument, getDocuments, updateDocument, deleteDocument } from "./firestore-helpers";
export { createNotification, getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "./notification-utils";
export { deletePost, likePost, unlikePost, createPost, getPosts, getPostById, togglePostLike, incrementPostViews, updatePost, incrementPostCommentCount, decrementPostCommentCount } from "./post-utils";
export { ensureUserProfileExists, checkUserProfileExists, createUserProfile, getUserProfile, updateUserProfile, uploadProfileImage, deleteProfileImage, updateUserAvatar, updateUserCoverPhoto, addProfilePhoto, removeProfilePhoto } from "./profile-utils";
export { followUser, unfollowUser, checkIfFollowing, getUserFollowers, getUserFollowing, getFollowingUsers, getFollowers, getFollowSuggestions, searchUsers } from "./follow-utils";
export { createComment, getCommentsByPostId, updateComment, deleteComment, toggleCommentLike } from "./comment-utils";
export { testFirebaseConnection, inspectFirebaseData, getUserStats, deleteUser, deleteTestUsers } from "./admin-utils";
export { uploadFile } from "./storage-utils";
