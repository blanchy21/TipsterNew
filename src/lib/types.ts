export interface User {
  id: string;
  name: string;
  displayName?: string; // Firebase displayName
  handle: string;
  avatar: string;
  photoURL?: string; // Firebase photoURL
  followers?: string[]; // Array of user IDs who follow this user
  following?: string[]; // Array of user IDs this user follows
  followersCount?: number;
  followingCount?: number;
  // Extended profile fields
  bio?: string;
  location?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  profilePhotos?: string[]; // Array of additional profile photos
  coverPhoto?: string;
  specializations?: string[]; // Sports the user specializes in
  memberSince?: string; // Date when user joined
  isVerified?: boolean;
  privacy?: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    showSocialMedia: boolean;
  };
  preferences?: {
    notifications: NotificationSettings;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

export type TipStatus = 'pending' | 'win' | 'loss' | 'void' | 'place';

export interface Post {
  id: string;
  user: User;
  sport: string;
  title: string;
  content: string;
  odds?: string; // Fractional or decimal odds
  tags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  likedBy: string[]; // Array of user IDs who liked this post
  // Tip verification fields
  tipStatus?: TipStatus;
  verifiedAt?: string; // When the tip was verified by admin
  verifiedBy?: string; // Admin user ID who verified the tip
  gameDate?: string; // When the game/event takes place
  isGameFinished?: boolean; // Whether the game has completed
}

export interface Fixture {
  id: string;
  time: string;
  league: string;
  teams: string;
  market: string;
  odds: string | number;
  matchDate?: string;
  isFinished?: boolean;
  score?: string | null;
  venue?: string;
}

export interface FollowingUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  winRate: number;
  following: boolean;
}

export interface TrendingItem {
  id: string;
  label: string;
  volume: number;
  delta: string;
}

import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  key: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'tip' | 'match_result' | 'system';
  title: string;
  message: string;
  user?: User;
  postId?: string;
  recipientId: string; // ID of the user who should receive this notification
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationSettings {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  tips: boolean;
  matchResults: boolean;
  system: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this comment
  replies?: Comment[]; // For nested replies
  parentId?: string; // For replies to comments
  isEdited?: boolean;
  editedAt?: string;
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}
