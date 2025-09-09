'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Trophy, 
  Award, 
  TrendingUp,
  Camera,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Zap,
  Wind,
  Lock,
  Car,
  Square,
  Droplets,
  Wifi,
  CalendarDays,
  CalendarPlus,
  ArrowRight,
  ExternalLink,
  UserPlus,
  Edit3,
  Settings
} from 'lucide-react';
import FollowButton from './FollowButton';
import ProfileEditModal from './ProfileEditModal';
import { useAuth } from '@/lib/hooks/useAuth';
import { useProfile } from '@/lib/contexts/ProfileContext';
import { useFollowing } from '@/lib/contexts/FollowingContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { getUserStats } from '@/lib/firebase/firebaseUtils';

interface ProfileStats {
  totalPosts: number;
  engagementRate: number;
  followers: number;
  following: number;
  totalLikes: number;
  totalComments: number;
  streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  date: string;
}

interface RecentPost {
  id: string;
  sport: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
}

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
  userId?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, userId }) => {
  const { user: currentUser } = useAuth();
  const { profile, loading: profileLoading, loadUserProfile } = useProfile();
  const { following, followers } = useFollowing();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userStats, setUserStats] = useState<ProfileStats>({
    totalPosts: 0,
    engagementRate: 0,
    followers: 0,
    following: 0,
    totalLikes: 0,
    totalComments: 0,
    streak: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Use real user data or fallback to current user
  const profileUser = profile || (currentUser ? {
    id: currentUser.uid,
    name: currentUser.displayName || 'User',
    handle: `@${currentUser.email?.split('@')[0] || 'user'}`,
    avatar: normalizeImageUrl(currentUser.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'),
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0
  } : null);

  // Load user profile when userId changes
  useEffect(() => {
    if (userId && userId !== currentUser?.uid) {
      loadUserProfile(userId);
    }
  }, [userId, currentUser?.uid, loadUserProfile]);

  // Load user stats when profileUser changes
  useEffect(() => {
    const loadUserStats = async () => {
      if (!profileUser?.id) return;
      
      setStatsLoading(true);
      try {
        const stats = await getUserStats(profileUser.id);
        setUserStats({
          totalPosts: stats.totalPosts,
          engagementRate: stats.engagementRate,
          followers: followers.length,
          following: following.length,
          totalLikes: stats.totalLikes,
          totalComments: stats.totalComments,
          streak: 12 // Keep streak as static for now
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadUserStats();
  }, [profileUser?.id, followers.length, following.length]);

  if (!profileUser) {
    return (
      <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Stats are now loaded dynamically via useEffect

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Sports Analysis Expert',
      description: 'Premier League Analysis Competition Winner 2024',
      icon: <Trophy className="w-4 h-4" />,
      color: 'amber',
      date: '2024'
    },
    {
      id: '2',
      title: 'Elite Sports Analyst',
      description: 'Verified Expert Status - High Engagement Rate',
      icon: <Award className="w-4 h-4" />,
      color: 'emerald',
      date: '2024'
    },
    {
      id: '3',
      title: 'Community Leader',
      description: '2,500+ Followers - Top Sports Discussion Contributor',
      icon: <Users className="w-4 h-4" />,
      color: 'indigo',
      date: '2024'
    }
  ];

  const recentPosts: RecentPost[] = [
    {
      id: '1',
      sport: 'Football',
      title: 'Arsenal vs Chelsea Analysis',
      content: 'Tactical breakdown of the London derby...',
      likes: 245,
      comments: 32,
      date: '2 days ago'
    },
    {
      id: '2',
      sport: 'Basketball',
      title: 'Lakers vs Warriors Game Review',
      content: 'Key moments and player performances...',
      likes: 189,
      comments: 28,
      date: '3 days ago'
    },
    {
      id: '3',
      sport: 'Tennis',
      title: 'Djokovic vs Medvedev Preview',
      content: 'Match analysis and predictions...',
      likes: 156,
      comments: 19,
      date: 'Today'
    }
  ];

  const getEngagementColor = (likes: number) => {
    if (likes >= 200) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (likes >= 100) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
  };

  const getEngagementText = (likes: number) => {
    if (likes >= 200) return 'Viral';
    if (likes >= 100) return 'Popular';
    return 'Trending';
  };

  return (
    <div className="w-full text-gray-100 font-[Inter] bg-gradient-to-br from-slate-900 to-[#2c1376]/70">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-16 opacity-0 translate-y-8 blur-sm" style={{animation: 'fadeInSlideUp 1.2s ease-out 0.3s forwards'}}>
        {/* GRID */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <aside className="space-y-8 opacity-0 translate-x-[-50px] blur-sm" style={{animation: 'fadeInSlideRight 1s ease-out 0.6s forwards'}}>
            {/* PROFILE */}
            <article className="rounded-3xl shadow-2xl overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02] hover:shadow-3xl">
              <div className="grid grid-cols-2 h-48 relative overflow-hidden">
                {profileUser.coverPhoto ? (
                  <Image 
                    src={profileUser.coverPhoto} 
                    alt="cover photo" 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <Image 
                    src={normalizeImageUrl("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop")} 
                    alt="football stadium" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                )}
                <div className="relative overflow-hidden">
                  {profileUser.profilePhotos && profileUser.profilePhotos.length > 0 ? (
                    <Image 
                      src={profileUser.profilePhotos[0]} 
                      alt="profile gallery" 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <Image 
                      src={normalizeImageUrl("https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop")} 
                      alt="basketball court" 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150 border border-white/20">
                      <Camera className="w-3 h-3 text-black" />
                      <span className="text-sm font-semibold text-black">
                        {statsLoading ? '...' : `+${userStats.totalPosts}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="relative pt-16 pr-8 pb-8 pl-8 backdrop-blur-2xl">
                <Image 
                  src={normalizeImageUrl(profileUser.avatar)} 
                  alt="profile" 
                  width={96}
                  height={96}
                  className="absolute -top-12 left-8 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2 object-cover border-white/20 border-4 rounded-3xl shadow-2xl"
                />
                {profileUser.isVerified && (
                  <span className="absolute -top-6 left-28 rounded-full p-2 bg-emerald-400 shadow-lg ring-4 ring-emerald-400/20 transition-all duration-500 group-hover:ring-8 group-hover:ring-emerald-400/40" aria-label="verified">
                    <Check className="w-3 h-3 text-black transition-transform duration-300 group-hover:scale-125" style={{strokeWidth: 2.5}} />
                  </span>
                )}
                <div className="absolute -top-6 right-8 flex space-x-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-200">
                  {profileUser.socialMedia?.facebook && (
                    <a href={`https://facebook.com/${profileUser.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" aria-label="facebook" className="text-neutral-300 hover:text-blue-400 transition-all duration-300 p-2 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 hover:scale-110 backdrop-blur-sm">
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {profileUser.socialMedia?.twitter && (
                    <a href={`https://twitter.com/${profileUser.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" aria-label="twitter" className="text-neutral-300 hover:text-sky-400 transition-all duration-300 p-2 rounded-xl hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 hover:scale-110 backdrop-blur-sm">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {profileUser.socialMedia?.instagram && (
                    <a href={`https://instagram.com/${profileUser.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="instagram" className="text-neutral-300 hover:text-pink-400 transition-all duration-300 p-2 rounded-xl hover:bg-pink-500/10 border border-transparent hover:border-pink-500/20 hover:scale-110 backdrop-blur-sm">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {currentUser?.uid === profileUser.id && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-neutral-300 hover:text-blue-400 transition-all duration-300 p-2 rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 hover:scale-110 backdrop-blur-sm"
                      aria-label="edit profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1s forwards'}}>
                  {profileUser.name}
                </h2>
                <p className="text-neutral-400 text-sm mb-4 flex items-center gap-2 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.1s forwards'}}>
                  <Calendar className="w-4 h-4" />
                  {profileUser.handle} • {profileUser.memberSince ? `Member since ${new Date(profileUser.memberSince).getFullYear()}` : 'New Member'}
                </p>
                <div className="flex gap-3 mb-4 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.2s forwards'}}>
                  {profileUser.specializations?.slice(0, 2).map((sport, index) => (
                    <span key={sport} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg flex items-center gap-1.5 hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                      <Zap className="w-3 h-3" />
                      {sport.toUpperCase()}
                    </span>
                  ))}
                  {(!profileUser.specializations || profileUser.specializations.length === 0) && (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-neutral-300 border border-white/20 flex items-center gap-1.5 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                      <Wind className="w-3 h-3" />
                      SPORTS ANALYST
                    </span>
                  )}
                </div>
                <p className="text-neutral-300 leading-relaxed mb-6 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.3s forwards'}}>
                  {profileUser.bio || 'Professional sports analyst with a passion for data-driven insights and helping others understand the beautiful game through expert analysis.'}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 opacity-0 translate-y-4 blur-sm hover:bg-white/10 transition-all duration-500" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.4s forwards'}}>
                  <div className="text-center hover:scale-110 transition-transform duration-300">
                    <div className="text-xl font-bold text-white">
                      {statsLoading ? '...' : userStats.totalPosts.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-400">Posts</div>
                  </div>
                  <div className="text-center border-l border-r border-white/10 hover:scale-110 transition-transform duration-300">
                    <div className="text-xl font-bold text-white">
                      {statsLoading ? '...' : `${userStats.engagementRate}%`}
                    </div>
                    <div className="text-xs text-neutral-400">Engagement</div>
                  </div>
                  <div className="text-center hover:scale-110 transition-transform duration-300">
                    <div className="text-xl font-bold text-white">
                      {statsLoading ? '...' : userStats.totalComments}
                    </div>
                    <div className="text-xs text-neutral-400">Comments</div>
                  </div>
                </div>

                <div className="flex items-center font-medium mb-3 space-x-2 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.5s forwards'}}>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400 hover:scale-125 transition-transform duration-300" />
                    <span className="text-lg">4.9</span>
                  </div>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400">1,247 reviews</span>
                </div>
                <div className="flex items-center text-neutral-400 mb-8 space-x-2 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.6s forwards'}}>
                  {profileUser.location && (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>{profileUser.location}</span>
                      <span className="text-neutral-600">•</span>
                    </>
                  )}
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span className="text-xs">Online Now</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.7s forwards'}}>
                  <button className="flex items-center justify-center gap-2 font-medium border rounded-2xl py-3 px-4 border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 group backdrop-blur-md" aria-label="contact">
                    <Phone className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                    Contact
                  </button>
                  <FollowButton 
                    targetUser={profileUser} 
                    variant="default"
                    className="w-full"
                  />
                </div>
              </div>
            </article>

            {/* ACHIEVEMENTS */}
            <article className="rounded-3xl shadow-xl p-8 bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 flex items-center gap-2 opacity-0 translate-x-[-20px] blur-sm" style={{animation: 'fadeInSlideRight 0.8s ease-out 1.8s forwards'}}>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                Achievements & Awards
              </h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className={`p-4 rounded-2xl bg-gradient-to-r from-${achievement.color}-500/10 to-${achievement.color}-600/10 border border-${achievement.color}-500/20 hover:scale-105 transition-all duration-300 opacity-0 translate-y-4 blur-sm backdrop-blur-md`} style={{animation: `fadeInSlideUp 0.6s ease-out ${1.9 + index * 0.1}s forwards`}}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 bg-${achievement.color}-500/20 rounded-xl backdrop-blur-sm`}>
                        {achievement.icon}
                      </div>
                      <span className={`font-semibold text-${achievement.color}-400`}>{achievement.title}</span>
                    </div>
                    <p className="text-sm text-neutral-300">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* RECENT POSTS */}
            <article className="rounded-3xl shadow-xl p-8 bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 flex items-center gap-2 opacity-0 translate-x-[-20px] blur-sm" style={{animation: 'fadeInSlideRight 0.8s ease-out 2.4s forwards'}}>
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                Recent Posts
              </h3>
              <div className="space-y-4">
                {recentPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 opacity-0 translate-y-4 blur-sm" style={{animation: `fadeInSlideUp 0.6s ease-out ${2.5 + index * 0.1}s forwards`}}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 backdrop-blur-sm">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-medium block">{post.title}</span>
                        <span className="text-xs text-neutral-400">{post.content} • {post.likes} likes</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full backdrop-blur-sm border ${getEngagementColor(post.likes)}`}>
                      {getEngagementText(post.likes)}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 border rounded-2xl py-3 font-medium flex items-center justify-center gap-2 border-white/20 hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 group opacity-0 translate-y-4 blur-sm backdrop-blur-md" style={{animation: 'fadeInSlideUp 0.6s ease-out 2.8s forwards'}}>
                <Calendar className="w-4 h-4" />
                View All Posts
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </article>
          </aside>

          {/* CENTER */}
          <main className="space-y-8 opacity-0 translate-y-8 blur-sm" style={{animation: 'fadeInSlideUp 1s ease-out 0.8s forwards'}}>
            {/* HERO NOTICE */}
            <article className="rounded-3xl shadow-xl overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500/30 relative hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 group backdrop-blur-xl">
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"%3E%3C/g%3E%3C/svg%3E')"}}></div>
              <div className="p-8 relative backdrop-blur-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3 opacity-0 translate-x-[-20px] blur-sm" style={{animation: 'fadeInSlideRight 0.8s ease-out 1.2s forwards'}}>
                    <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 backdrop-blur-sm border border-white/30">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Featured Analysis</span>
                  </div>
                  <span className="text-xs text-blue-200 bg-white/20 px-3 py-1 rounded-full opacity-0 translate-x-4 blur-sm hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30" style={{animation: 'fadeInSlideLeft 0.8s ease-out 1.3s forwards'}}>2 hrs ago</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.4s forwards'}}>
                  Champions League Final Analysis
                </h3>
                <p className="text-blue-100 leading-relaxed mb-6 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.5s forwards'}}>
                  Exclusive tactical analysis for the biggest match of the season. Get my detailed breakdown and insights for the Champions League final.
                </p>
                <div className="flex items-center justify-between opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.6s forwards'}}>
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <Image src={normalizeImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face")} alt="profile" width={48} height={48} className="rounded-full border-2 border-white/30 group-hover/avatar:border-4 group-hover/avatar:border-white/50 group-hover/avatar:scale-110 transition-all duration-300 object-cover" style={{ width: 'auto', height: 'auto' }} />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-indigo-600 animate-pulse"></div>
                    </div>
                    <div>
                      <span className="font-semibold text-white">Alex Thompson</span>
                      <p className="text-sm text-blue-200">Elite Sports Analyst</p>
                    </div>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group/btn backdrop-blur-sm border border-white/30">
                    <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    View Analysis
                  </button>
                </div>
              </div>
            </article>

            {/* STATISTICS */}
            <article className="rounded-3xl shadow-xl p-8 bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.01] transition-all duration-500">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4 opacity-0 translate-x-[-20px] blur-sm" style={{animation: 'fadeInSlideRight 0.8s ease-out 1.7s forwards'}}>
                  <div className="p-2 bg-indigo-500/20 rounded-xl backdrop-blur-sm border border-indigo-500/30">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">Performance Statistics</h3>
                </div>
                <p className="text-neutral-300 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.8s forwards'}}>
                  Detailed breakdown of my content performance and engagement metrics.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 1.9s forwards'}}>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 hover:scale-105 transition-all duration-300 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Trophy className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="font-semibold text-emerald-400">Total Likes</span>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {statsLoading ? '...' : userStats.totalLikes.toLocaleString()}
                  </div>
                  <div className="text-sm text-emerald-300">Likes Received</div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:scale-105 transition-all duration-300 backdrop-blur-md">
                  <div className="flex items-start gap-1 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl flex-shrink-0">
                      <Award className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-blue-400">Total</span>
                      <span className="font-semibold text-blue-400">Comments</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {statsLoading ? '...' : userStats.totalComments.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-300">Comments Received</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 opacity-0 translate-y-4 blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 2s forwards'}}>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {statsLoading ? '...' : (profileUser.followersCount?.toLocaleString() || userStats.followers.toLocaleString())}
                  </div>
                  <div className="text-xs text-neutral-400">Followers</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {statsLoading ? '...' : (profileUser.followingCount || userStats.following)}
                  </div>
                  <div className="text-xs text-neutral-400">Following</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-white mb-1">
                    {statsLoading ? '...' : `${userStats.engagementRate}%`}
                  </div>
                  <div className="text-xs text-neutral-400">Engagement</div>
                </div>
              </div>
            </article>
          </main>

          {/* RIGHT */}
          <aside className="space-y-8 opacity-0 translate-x-[50px] blur-sm" style={{animation: 'fadeInSlideLeft 1s ease-out 1s forwards'}}>
            {/* SPECIALIZATIONS */}
            <article className="rounded-3xl shadow-xl p-8 bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 flex items-center gap-2 opacity-0 translate-x-4 blur-sm" style={{animation: 'fadeInSlideLeft 0.8s ease-out 2.6s forwards'}}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                Specializations
              </h3>
              
              <div className="space-y-4">
                {(profileUser.specializations || ['Sports Analysis']).map((sport, index) => (
                  <div key={sport} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group opacity-0 translate-x-8 blur-sm hover:scale-105 backdrop-blur-md" style={{animation: `fadeInSlideLeft 0.6s ease-out ${2.7 + index * 0.1}s forwards`}}>
                    <div className="relative">
                      <div className="w-16 h-16 group-hover:border-4 group-hover:border-emerald-400/50 group-hover:scale-110 transition-all duration-300 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-white/20 border-2 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" style={{strokeWidth: 3}} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{sport}</div>
                      <div className="text-sm text-emerald-400 mb-1">Expert Level</div>
                      <div className="text-xs text-neutral-400">Professional Analysis</div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* CONTACT INFO */}
            <article className="rounded-3xl shadow-xl p-8 bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-500">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6 flex items-center gap-2 opacity-0 translate-x-4 blur-sm" style={{animation: 'fadeInSlideLeft 0.8s ease-out 3.4s forwards'}}>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                Get in Touch
              </h3>
              
              <div className="space-y-4">
                {profileUser.website && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group opacity-0 translate-x-8 blur-sm hover:scale-105 backdrop-blur-md" style={{animation: 'fadeInSlideLeft 0.6s ease-out 3.5s forwards'}}>
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:text-purple-400 transition-colors">
                        {profileUser.website}
                      </a>
                      <div className="text-xs text-neutral-400">Personal Website</div>
                    </div>
                  </div>
                )}

                {profileUser.location && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group opacity-0 translate-x-8 blur-sm hover:scale-105 backdrop-blur-md" style={{animation: 'fadeInSlideLeft 0.6s ease-out 3.6s forwards'}}>
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{profileUser.location}</div>
                      <div className="text-xs text-neutral-400">Location</div>
                    </div>
                  </div>
                )}

                {currentUser?.uid === profileUser.id && (
                  <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group opacity-0 translate-x-8 blur-sm hover:scale-105 backdrop-blur-md" style={{animation: 'fadeInSlideLeft 0.6s ease-out 3.7s forwards'}}>
                      <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <button 
                          onClick={() => setIsEditModalOpen(true)}
                          className="font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          Edit Profile
                        </button>
                        <div className="text-xs text-neutral-400">Manage your profile settings</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 group opacity-0 translate-x-8 blur-sm hover:scale-105 backdrop-blur-md" style={{animation: 'fadeInSlideLeft 0.6s ease-out 3.8s forwards'}}>
                      <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <button 
                          onClick={() => onNavigate?.('admin')}
                          className="font-medium text-white hover:text-purple-400 transition-colors"
                        >
                          Admin Panel
                        </button>
                        <div className="text-xs text-neutral-400">Populate test data for development</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-2xl hover:from-cyan-600 hover:to-blue-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-cyan-500/25 opacity-0 translate-y-4 blur-sm backdrop-blur-sm" style={{animation: 'fadeInSlideUp 0.8s ease-out 3.8s forwards'}}>
                <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Contact Me
              </button>
            </article>
          </aside>
        </section>
      </div>

      
      {/* Profile Edit Modal */}
      <ProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfilePage;
