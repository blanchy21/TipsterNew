'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Camera, Upload, Save, User, MapPin, Globe, Twitter, Instagram, Facebook, Linkedin, Trash2 } from 'lucide-react';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { User as UserType } from '@/lib/types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, user }) => {
  const { profile, updateProfile, uploadAvatar, uploadCoverPhoto, addPhoto, removePhoto, loading } = useProfile();
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'photos' | 'privacy'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        name: profile.name || '',
        handle: profile.handle || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        socialMedia: {
          twitter: profile.socialMedia?.twitter || '',
          instagram: profile.socialMedia?.instagram || '',
          facebook: profile.socialMedia?.facebook || '',
          linkedin: profile.socialMedia?.linkedin || '',
        },
        specializations: profile.specializations || [],
        privacy: {
          showEmail: profile.privacy?.showEmail ?? true,
          showPhone: profile.privacy?.showPhone ?? true,
          showLocation: profile.privacy?.showLocation ?? true,
          showSocialMedia: profile.privacy?.showSocialMedia ?? true,
        }
      });
    }
  }, [profile, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        showEmail: prev.privacy?.showEmail ?? true,
        showPhone: prev.privacy?.showPhone ?? true,
        showLocation: prev.privacy?.showLocation ?? true,
        showSocialMedia: prev.privacy?.showSocialMedia ?? true,
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handleSpecializationToggle = (sport: string) => {
    setFormData(prev => {
      const current = prev.specializations || [];
      const updated = current.includes(sport)
        ? current.filter(s => s !== sport)
        : [...current, sport];
      return { ...prev, specializations: updated };
    });
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      onClose();
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handleCoverPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadCoverPhoto(file);
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await addPhoto(file);
    }
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    await removePhoto(photoUrl);
  };

  const sports = ['Football', 'Basketball', 'Tennis', 'Cricket', 'Horse Racing', 'Golf', 'Rugby', 'Baseball', 'Hockey', 'Boxing'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { key: 'basic', label: 'Basic Info', icon: User },
            { key: 'social', label: 'Social Media', icon: Globe },
            { key: 'photos', label: 'Photos', icon: Camera },
            { key: 'privacy', label: 'Privacy', icon: User }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === key
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2">Handle</label>
                  <input
                    type="text"
                    value={formData.handle || ''}
                    onChange={(e) => handleInputChange('handle', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="@yourhandle"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-4">Specializations</label>
                <div className="grid grid-cols-2 gap-3">
                  {sports.map((sport) => (
                    <label key={sport} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specializations?.includes(sport) || false}
                        onChange={() => handleSpecializationToggle(sport)}
                        className="w-4 h-4 text-blue-500 bg-white/5 border-white/20 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">{sport}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia?.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia?.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia?.facebook || ''}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    LinkedIn
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-4">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-white/5 border border-white/10">
                    {profile?.avatar ? (
                      <Image src={profile.avatar} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Avatar
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-4">Cover Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    {profile?.coverPhoto ? (
                      <Image src={profile.coverPhoto} alt="Cover" width={128} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={coverPhotoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => coverPhotoInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Cover
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Photos */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-4">Gallery Photos</label>
                <div className="grid grid-cols-4 gap-4">
                  {profile?.profilePhotos?.map((photo, index) => (
                    <div key={index} className="relative group">
                      <Image src={photo} alt={`Gallery ${index + 1}`} width={80} height={80} className="w-full h-20 object-cover rounded-xl" />
                      <button
                        onClick={() => handleRemovePhoto(photo)}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Add Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
                {[
                  { key: 'showEmail', label: 'Show Email Address', description: 'Allow others to see your email' },
                  { key: 'showPhone', label: 'Show Phone Number', description: 'Allow others to see your phone' },
                  { key: 'showLocation', label: 'Show Location', description: 'Allow others to see your location' },
                  { key: 'showSocialMedia', label: 'Show Social Media', description: 'Allow others to see your social links' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="font-medium text-white">{label}</div>
                      <div className="text-sm text-neutral-400">{description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacy?.[key as keyof typeof formData.privacy] || false}
                        onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-3 text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
