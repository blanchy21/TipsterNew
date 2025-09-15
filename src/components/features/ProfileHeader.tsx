'use client';

import React from 'react';
import Image from 'next/image';
import {
    MapPin,
    Phone,
    Mail,
    Globe,
    Calendar,
    Camera,
    Facebook,
    Twitter,
    Instagram,
    Edit3,
    Settings
} from 'lucide-react';
import FollowButton from './FollowButton';
import { User } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    onEditProfile: () => void;
    onNavigateToProfile?: (userId: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    isOwnProfile,
    onEditProfile,
    onNavigateToProfile
}) => {
    return (
        <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 relative overflow-hidden">
                {user.coverPhoto ? (
                    <Image
                        src={user.coverPhoto}
                        alt="Cover photo"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                )}
                {isOwnProfile && (
                    <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors">
                        <Camera className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
                {/* Profile Picture */}
                <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                        <Image
                            src={normalizeImageUrl(user.avatar)}
                            alt={user.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isOwnProfile && (
                        <button className="absolute bottom-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-full border-2 border-slate-900 transition-colors">
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    )}
                </div>

                {/* User Info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
                        <p className="text-slate-400 mb-2">{user.handle}</p>

                        {/* Bio */}
                        {user.bio && (
                            <p className="text-slate-300 mb-4 max-w-md">{user.bio}</p>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            {user.location && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{user.location}</span>
                                </div>
                            )}
                            {user.privacy?.showPhone && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">Contact available</span>
                                </div>
                            )}
                            {user.privacy?.showEmail && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-sm">Email available</span>
                                </div>
                            )}
                            {user.website && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Globe className="w-4 h-4" />
                                    <a
                                        href={user.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm hover:text-blue-400 transition-colors"
                                    >
                                        {user.website}
                                    </a>
                                </div>
                            )}
                            {user.memberSince && (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm">Joined {new Date(user.memberSince).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        {(user.socialMedia?.facebook || user.socialMedia?.twitter || user.socialMedia?.instagram) && (
                            <div className="flex gap-3 mb-4">
                                {user.socialMedia?.facebook && (
                                    <a
                                        href={user.socialMedia.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors"
                                    >
                                        <Facebook className="w-4 h-4 text-white" />
                                    </a>
                                )}
                                {user.socialMedia?.twitter && (
                                    <a
                                        href={user.socialMedia.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-800 hover:bg-blue-400 rounded-lg transition-colors"
                                    >
                                        <Twitter className="w-4 h-4 text-white" />
                                    </a>
                                )}
                                {user.socialMedia?.instagram && (
                                    <a
                                        href={user.socialMedia.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-slate-800 hover:bg-pink-600 rounded-lg transition-colors"
                                    >
                                        <Instagram className="w-4 h-4 text-white" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {isOwnProfile ? (
                            <>
                                <button
                                    onClick={onEditProfile}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                            </>
                        ) : (
                            <FollowButton
                                targetUser={user}
                                onNavigateToProfile={onNavigateToProfile}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
