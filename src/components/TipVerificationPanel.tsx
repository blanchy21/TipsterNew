'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Trophy,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Eye,
    User,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    Target,
    Award,
    RefreshCw
} from 'lucide-react';
import { Post, TipStatus, User as UserType } from '@/lib/types';
import { getPosts, updatePost, getUserProfile } from '@/lib/firebase/firebaseUtils';
import { useAuth } from '@/lib/hooks/useAuth';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface TipVerificationPanelProps {
    onTipVerified?: (postId: string, status: TipStatus) => void;
}

interface VerificationStats {
    total: number;
    pending: number;
    wins: number;
    losses: number;
    voids: number;
    places: number;
    winRate: number;
    avgOdds: number;
}

export default function TipVerificationPanel({ onTipVerified }: TipVerificationPanelProps) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<TipStatus | 'all'>('all');
    const [filterSport, setFilterSport] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'createdAt' | 'gameDate' | 'likes' | 'views'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [verifying, setVerifying] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Real-time posts listener
    useEffect(() => {
        if (!db) {
            setPosts([]);
            setLoading(false);
            return;
        }

        console.log('🔄 Setting up real-time tip verification listener');
        setLoading(true);

        const postsRef = collection(db, 'posts');
        const q = query(postsRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                console.log('📡 Real-time tip verification update received');
                const postsData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
                    } as Post;
                });

                setPosts(postsData);
                setLoading(false);
            },
            (error) => {
                console.error('❌ Real-time tip verification listener error:', error);
                setLoading(false);
            }
        );

        return () => {
            console.log('🧹 Cleaning up tip verification listener');
            unsubscribe();
        };
    }, []);

    // Calculate verification statistics
    const stats: VerificationStats = useMemo(() => {
        const total = posts.length;
        const pending = posts.filter(p => p.tipStatus === 'pending').length;
        const wins = posts.filter(p => p.tipStatus === 'win').length;
        const losses = posts.filter(p => p.tipStatus === 'loss').length;
        const voids = posts.filter(p => p.tipStatus === 'void').length;
        const places = posts.filter(p => p.tipStatus === 'place').length;
        const verified = wins + losses + voids + places;
        const winRate = verified > 0 ? Math.round((wins / verified) * 100) : 0;

        const oddsValues = posts
            .filter(p => p.odds)
            .map(p => {
                const odds = p.odds || '0';
                // Convert fractional odds to decimal for calculation
                if (odds.includes('/')) {
                    const [numerator, denominator] = odds.split('/').map(Number);
                    return (numerator / denominator) + 1;
                }
                return parseFloat(odds) || 0;
            });

        const avgOdds = oddsValues.length > 0
            ? Math.round(oddsValues.reduce((sum, odds) => sum + odds, 0) / oddsValues.length * 100) / 100
            : 0;

        return { total, pending, wins, losses, voids, places, winRate, avgOdds };
    }, [posts]);

    // Get unique sports for filter
    const sports = useMemo(() => {
        const uniqueSports = Array.from(new Set(posts.map(p => p.sport)));
        return uniqueSports.sort();
    }, [posts]);

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(post => post.tipStatus === filterStatus);
        }

        // Filter by sport
        if (filterSport !== 'all') {
            filtered = filtered.filter(post => post.sport === filterSport);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.user.name.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sort posts
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                case 'gameDate':
                    aValue = a.gameDate ? new Date(a.gameDate).getTime() : 0;
                    bValue = b.gameDate ? new Date(b.gameDate).getTime() : 0;
                    break;
                case 'likes':
                    aValue = a.likes || 0;
                    bValue = b.likes || 0;
                    break;
                case 'views':
                    aValue = a.views || 0;
                    bValue = b.views || 0;
                    break;
                default:
                    aValue = 0;
                    bValue = 0;
            }

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });

        return filtered;
    }, [posts, filterStatus, filterSport, searchQuery, sortBy, sortOrder]);

    const handleVerifyTip = async (postId: string, status: TipStatus) => {
        setVerifying(postId);
        setMessage(null);

        try {
            await updatePost(postId, {
                tipStatus: status,
                verifiedAt: new Date().toISOString(),
                verifiedBy: 'admin',
                isGameFinished: true
            });

            setMessage({ type: 'success', text: `Tip successfully marked as ${status}!` });
            onTipVerified?.(postId, status);
        } catch (error) {
            console.error('Error verifying tip:', error);
            setMessage({ type: 'error', text: 'Failed to verify tip. Please try again.' });
        } finally {
            setVerifying(null);
        }
    };

    const getStatusIcon = (status: TipStatus) => {
        const iconConfig = {
            pending: { icon: Clock, className: 'text-yellow-400' },
            win: { icon: CheckCircle, className: 'text-green-400' },
            loss: { icon: XCircle, className: 'text-red-400' },
            void: { icon: AlertCircle, className: 'text-gray-400' },
            place: { icon: Trophy, className: 'text-blue-400' }
        };
        const config = iconConfig[status];
        const Icon = config.icon;
        return <Icon className={`w-4 h-4 ${config.className}`} />;
    };

    const getStatusColor = (status: TipStatus) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
            win: 'bg-green-500/20 text-green-300 border-green-500/30',
            loss: 'bg-red-500/20 text-red-300 border-red-500/30',
            void: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
            place: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
        };
        return colors[status];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-slate-300">Loading tips for verification...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Tips</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Win Rate</p>
                            <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Avg Odds</p>
                            <p className="text-2xl font-bold text-purple-400">{stats.avgOdds}</p>
                        </div>
                        <Target className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tips..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as TipStatus | 'all')}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="win">Win</option>
                            <option value="loss">Loss</option>
                            <option value="void">Void</option>
                            <option value="place">Place</option>
                        </select>
                    </div>

                    {/* Sport Filter */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sport</label>
                        <select
                            value={filterSport}
                            onChange={(e) => setFilterSport(e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value="all">All Sports</option>
                            {sports.map(sport => (
                                <option key={sport} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                            >
                                <option value="createdAt">Date Created</option>
                                <option value="gameDate">Game Date</option>
                                <option value="likes">Likes</option>
                                <option value="views">Views</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-xl ${message.type === 'success'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Tips List */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                        <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Tips Found</h3>
                        <p className="text-slate-400">No tips match the current filter criteria.</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-sm text-sky-300/90 bg-sky-500/10 ring-1 ring-sky-500/20 px-3 py-1 rounded-full">
                                            {post.sport}
                                        </span>
                                        {post.tipStatus && (
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.tipStatus)}`}>
                                                {getStatusIcon(post.tipStatus)}
                                                {post.tipStatus.charAt(0).toUpperCase() + post.tipStatus.slice(1)}
                                            </span>
                                        )}
                                        {post.odds && (
                                            <span className="text-sm text-emerald-300 bg-emerald-500/10 ring-1 ring-emerald-500/20 px-3 py-1 rounded-full">
                                                Odds: {post.odds}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-3">{post.title}</h3>
                                    <p className="text-slate-300 mb-4 line-clamp-3">{post.content}</p>

                                    <div className="flex items-center gap-6 text-sm text-slate-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>{post.user.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {post.gameDate && (
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>Game: {new Date(post.gameDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{post.views || 0} views</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4" />
                                            <span>{post.likes || 0} likes</span>
                                        </div>
                                    </div>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Verification Actions */}
                            <div className="flex flex-wrap gap-3">
                                {post.tipStatus === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleVerifyTip(post.id, 'win')}
                                            disabled={verifying === post.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {verifying === post.id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            Mark as Win
                                        </button>
                                        <button
                                            onClick={() => handleVerifyTip(post.id, 'loss')}
                                            disabled={verifying === post.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {verifying === post.id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            Mark as Loss
                                        </button>
                                        <button
                                            onClick={() => handleVerifyTip(post.id, 'void')}
                                            disabled={verifying === post.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {verifying === post.id ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4" />
                                            )}
                                            Mark as Void
                                        </button>
                                        {(post.sport === 'Horse Racing' || post.sport === 'Greyhound Racing' || post.sport === 'Golf') && (
                                            <button
                                                onClick={() => handleVerifyTip(post.id, 'place')}
                                                disabled={verifying === post.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {verifying === post.id ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trophy className="w-4 h-4" />
                                                )}
                                                Mark as Place
                                            </button>
                                        )}
                                    </>
                                )}
                                {post.tipStatus && post.tipStatus !== 'pending' && (
                                    <div className="text-sm text-slate-400 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Verified on {post.verifiedAt ? new Date(post.verifiedAt).toLocaleDateString() : 'Unknown date'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
