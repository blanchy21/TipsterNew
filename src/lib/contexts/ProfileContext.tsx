'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getUserProfile, updateUserProfile, uploadProfileImage, updateUserAvatar, updateUserCoverPhoto, addProfilePhoto, removeProfilePhoto } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProfileContextType {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  uploadCoverPhoto: (file: File) => Promise<boolean>;
  addPhoto: (file: File) => Promise<boolean>;
  removePhoto: (photoUrl: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.uid) {
      await loadProfile(user.uid);
    }
  };

  const loadUserProfile = async (userId: string) => {
    await loadProfile(userId);
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user?.uid) return false;
    
    setLoading(true);
    setError(null);
    try {
      const success = await updateUserProfile(user.uid, profileData);
      if (success) {
        setProfile(prev => prev ? { ...prev, ...profileData } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user?.uid) return false;
    
    setLoading(true);
    setError(null);
    try {
      const avatarUrl = await uploadProfileImage(user.uid, file, 'avatar');
      if (avatarUrl) {
        const success = await updateUserAvatar(user.uid, avatarUrl);
        if (success) {
          setProfile(prev => prev ? { ...prev, avatar: avatarUrl } : null);
        }
        return success;
      }
      return false;
    } catch (err) {
      setError('Failed to upload avatar');
      console.error('Error uploading avatar:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadCoverPhoto = async (file: File): Promise<boolean> => {
    if (!user?.uid) return false;
    
    setLoading(true);
    setError(null);
    try {
      const coverPhotoUrl = await uploadProfileImage(user.uid, file, 'cover');
      if (coverPhotoUrl) {
        const success = await updateUserCoverPhoto(user.uid, coverPhotoUrl);
        if (success) {
          setProfile(prev => prev ? { ...prev, coverPhoto: coverPhotoUrl } : null);
        }
        return success;
      }
      return false;
    } catch (err) {
      setError('Failed to upload cover photo');
      console.error('Error uploading cover photo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (file: File): Promise<boolean> => {
    if (!user?.uid) return false;
    
    setLoading(true);
    setError(null);
    try {
      const photoUrl = await uploadProfileImage(user.uid, file, 'gallery');
      if (photoUrl) {
        const success = await addProfilePhoto(user.uid, photoUrl);
        if (success) {
          setProfile(prev => prev ? { 
            ...prev, 
            profilePhotos: [...(prev.profilePhotos || []), photoUrl] 
          } : null);
        }
        return success;
      }
      return false;
    } catch (err) {
      setError('Failed to add photo');
      console.error('Error adding photo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = async (photoUrl: string): Promise<boolean> => {
    if (!user?.uid) return false;
    
    setLoading(true);
    setError(null);
    try {
      const success = await removeProfilePhoto(user.uid, photoUrl);
      if (success) {
        setProfile(prev => prev ? { 
          ...prev, 
          profilePhotos: prev.profilePhotos?.filter(url => url !== photoUrl) || []
        } : null);
      }
      return success;
    } catch (err) {
      setError('Failed to remove photo');
      console.error('Error removing photo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadProfile(user.uid);
    } else {
      setProfile(null);
    }
  }, [user?.uid]);

  const value: ProfileContextType = {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    uploadCoverPhoto,
    addPhoto,
    removePhoto,
    refreshProfile,
    loadUserProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
