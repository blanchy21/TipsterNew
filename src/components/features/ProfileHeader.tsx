'use client';

import React from 'react';
import Image from 'next/image';
import {
    MapPin,
    Globe,
    Calendar,
    Camera,
    Edit3,
    Settings,
    CheckCircle,
    ExternalLink
} from 'lucide-react';
import FollowButton from './FollowButton';
import { User } from '@/lib/types';
import { normalizeImageUrl } from '@/lib/imageUtils';
import AvatarWithFallback from '@/components/ui/AvatarWithFallback';

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
            <div className="h-52 md:h-64 relative overflow-hidden rounded-b-2xl">
                {user.coverPhoto ? (
                    <Image
                        src={user.coverPhoto}
                        alt="Cover photo"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="h-full bg-gradient-to-br from-surface-2 via-surface-3 to-surface-4 relative">
                        {/* Ambient amber glow */}
                        <div className="absolute bottom-0 left-1/4 w-1/2 h-32 bg-accent/[0.06] blur-3xl rounded-full" />
                        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-accent/[0.04] blur-2xl rounded-full" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1/80 via-transparent to-transparent" />
                {isOwnProfile && (
                    <button className="absolute top-4 right-4 p-2.5 bg-surface-2/70 hover:bg-surface-3/80 backdrop-blur-sm rounded-xl border border-white/[0.08] transition-all hover:border-white/[0.15]">
                        <Camera className="w-4 h-4 text-zinc-300" />
                    </button>
                )}
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-16 mb-5 flex items-end gap-5">
                    <div className="relative flex-shrink-0">
                        <div className={`w-[120px] h-[120px] rounded-full border-[3px] ${isOwnProfile ? 'border-accent/40' : 'border-surface-1'} overflow-hidden bg-surface-2 ring-4 ring-surface-1`}>
                            <AvatarWithFallback
                                src={user.avatar}
                                alt={user.name}
                                name={user.name}
                                size={120}
                            />
                        </div>
                        {isOwnProfile && (
                            <button
                                onClick={onEditProfile}
                                className="absolute bottom-1 right-1 p-2 bg-accent hover:bg-accent-dark rounded-full border-2 border-surface-1 transition-colors shadow-lg shadow-accent/20"
                            >
                                <Camera className="w-3.5 h-3.5 text-surface-1" />
                            </button>
                        )}
                    </div>

                    {/* Desktop action buttons */}
                    <div className="hidden sm:flex gap-2.5 ml-auto pb-1">
                        {isOwnProfile ? (
                            <>
                                <button
                                    onClick={onEditProfile}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-surface-1 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-2/60 hover:bg-surface-3/70 text-zinc-300 rounded-xl border border-white/[0.08] hover:border-white/[0.15] text-sm transition-all">
                                    <Settings className="w-4 h-4" />
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

                {/* Name & Handle */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h1 className="text-2xl font-bold text-white tracking-tight">{user.name}</h1>
                        {user.isVerified && (
                            <CheckCircle className="w-5 h-5 text-accent fill-accent/20" />
                        )}
                    </div>
                    <p className="text-muted-subtle text-sm">{user.handle}</p>
                </div>

                {/* Bio */}
                {user.bio && (
                    <p className="text-zinc-300 text-[15px] leading-relaxed mb-4 max-w-lg">{user.bio}</p>
                )}

                {/* Meta info row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-5 text-sm text-muted-subtle">
                    {user.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {user.location}
                        </span>
                    )}
                    {user.website && (
                        <a
                            href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {user.website.replace(/^https?:\/\//, '')}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                        </a>
                    )}
                    {user.memberSince && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Joined {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                    )}
                </div>

                {/* Social Links */}
                {(user.socialMedia?.facebook || user.socialMedia?.twitter || user.socialMedia?.instagram) && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {user.socialMedia?.twitter && (
                            <a
                                href={user.socialMedia.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-surface-2/60 hover:bg-surface-3/70 text-zinc-400 hover:text-white rounded-lg text-xs font-medium border border-white/[0.06] hover:border-white/[0.12] transition-all"
                            >
                                @Twitter
                            </a>
                        )}
                        {user.socialMedia?.instagram && (
                            <a
                                href={user.socialMedia.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-surface-2/60 hover:bg-surface-3/70 text-zinc-400 hover:text-white rounded-lg text-xs font-medium border border-white/[0.06] hover:border-white/[0.12] transition-all"
                            >
                                Instagram
                            </a>
                        )}
                        {user.socialMedia?.facebook && (
                            <a
                                href={user.socialMedia.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-surface-2/60 hover:bg-surface-3/70 text-zinc-400 hover:text-white rounded-lg text-xs font-medium border border-white/[0.06] hover:border-white/[0.12] transition-all"
                            >
                                Facebook
                            </a>
                        )}
                    </div>
                )}

                {/* Follower / Following counts */}
                <div className="flex items-center gap-5 text-sm">
                    <span className="text-zinc-400">
                        <span className="text-white font-semibold">{user.followersCount ?? 0}</span> followers
                    </span>
                    <span className="text-zinc-400">
                        <span className="text-white font-semibold">{user.followingCount ?? 0}</span> following
                    </span>
                </div>

                {/* Mobile action buttons */}
                <div className="flex gap-2.5 mt-5 sm:hidden">
                    {isOwnProfile ? (
                        <>
                            <button
                                onClick={onEditProfile}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-dark text-surface-1 rounded-xl font-semibold text-sm transition-all"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-2/60 hover:bg-surface-3/70 text-zinc-300 rounded-xl border border-white/[0.08] text-sm transition-all">
                                <Settings className="w-4 h-4" />
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
    );
};

export default ProfileHeader;
