'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Calendar, Shield, UserCheck, UserX, Mail, MapPin, Globe, Star, Clock, Eye, MoreVertical, RefreshCw, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { User } from '@/lib/types';
import { getDocuments, deleteUser, deleteTestUsers } from '@/lib/firebase/firebaseUtils';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface UserManagementProps {
    onUserSelect?: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUserSelect }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'new' | 'verified' | 'unverified'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'followers'>('newest');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Load all users
    const loadUsers = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching users from Firebase...');

            // Force fresh data by querying directly
            if (!db) {
                throw new Error('Firebase not initialized');
            }

            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log('Raw Firebase data:', usersData);

            // Transform the data to match User interface
            const transformedUsers: User[] = usersData.map((userData: any) => ({
                id: userData.id,
                name: userData.displayName || userData.name || 'Anonymous User',
                displayName: userData.displayName,
                handle: userData.handle || `@user${userData.id.slice(0, 8)}`,
                avatar: userData.photoURL || userData.avatar || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face',
                followers: userData.followers || [],
                following: userData.following || [],
                followersCount: userData.followersCount || 0,
                followingCount: userData.followingCount || 0,
                bio: userData.bio || '',
                location: userData.location || '',
                website: userData.website || '',
                socialMedia: userData.socialMedia || {},
                profilePhotos: userData.profilePhotos || [],
                coverPhoto: userData.coverPhoto || '',
                specializations: userData.specializations || [],
                memberSince: userData.memberSince || userData.createdAt || new Date().toISOString(),
                isVerified: userData.isVerified || false,
                privacy: userData.privacy || {
                    showEmail: false,
                    showPhone: false,
                    showLocation: false,
                    showSocialMedia: false
                },
                preferences: userData.preferences || {
                    notifications: {
                        likes: true,
                        comments: true,
                        follows: true,
                        mentions: true,
                        system: true
                    },
                    theme: 'dark',
                    language: 'en'
                }
            }));

            console.log('Loaded users from Firebase:', transformedUsers.length, 'users');
            console.log('User names:', transformedUsers.map(u => u.name));
            setUsers(transformedUsers);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Refresh function
    const handleRefresh = () => {
        loadUsers();
    };

    // Filter and sort users
    useEffect(() => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.bio.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        switch (filterType) {
            case 'new':
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                filtered = filtered.filter(user =>
                    new Date(user.memberSince || '') > oneWeekAgo
                );
                break;
            case 'verified':
                filtered = filtered.filter(user => user.isVerified);
                break;
            case 'unverified':
                filtered = filtered.filter(user => !user.isVerified);
                break;
            default:
                // 'all' - no additional filtering
                break;
        }

        // Apply sorting
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) =>
                    new Date(b.memberSince || '').getTime() - new Date(a.memberSince || '').getTime()
                );
                break;
            case 'oldest':
                filtered.sort((a, b) =>
                    new Date(a.memberSince || '').getTime() - new Date(b.memberSince || '').getTime()
                );
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'followers':
                filtered.sort((a, b) => (b.followersCount || 0) - (a.followersCount || 0));
                break;
        }

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterType, sortBy]);

    const getNewUserCount = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return users.filter(user =>
            new Date(user.memberSince || '') > oneWeekAgo
        ).length;
    };

    const getVerifiedUserCount = () => {
        return users.filter(user => user.isVerified).length;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isNewUser = (user: User) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(user.memberSince || '') > oneWeekAgo;
    };

    // Delete user functions
    const handleDeleteUser = async (user: User) => {
        setIsDeleting(true);
        setDeleteMessage(null);

        try {
            const result = await deleteUser(user.id);
            if (result.success) {
                setDeleteMessage({ type: 'success', text: `User ${user.name} deleted successfully!` });
                setDeleteConfirmUser(null);
                // Refresh the users list
                await loadUsers();
            } else {
                setDeleteMessage({ type: 'error', text: `Failed to delete user: ${result.error}` });
            }
        } catch (error: any) {
            setDeleteMessage({ type: 'error', text: `Error deleting user: ${error.message}` });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkDeleteTestUsers = async () => {
        setIsBulkDeleting(true);
        setDeleteMessage(null);

        const testUserNames = [
            'David Chen',
            'Mike Rodriguez',
            'Test User',
            'Emma Wilson',
            'Sarah Johnson',
            'Alex Thompson',
            'Lisa Martinez'
        ];

        try {
            const result = await deleteTestUsers(testUserNames);
            if (result.success) {
                setDeleteMessage({
                    type: 'success',
                    text: `Successfully deleted ${result.deletedUsers.length} test users: ${result.deletedUsers.join(', ')}`
                });
                setShowBulkDelete(false);
                // Refresh the users list
                await loadUsers();
            } else {
                setDeleteMessage({
                    type: 'error',
                    text: `Bulk delete completed with errors. Deleted: ${result.deletedUsers.join(', ')}. Errors: ${result.errors.join(', ')}`
                });
            }
        } catch (error: any) {
            setDeleteMessage({ type: 'error', text: `Error during bulk delete: ${error.message}` });
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const isTestUser = (user: User) => {
        const testUserNames = [
            'David Chen',
            'Mike Rodriguez',
            'Test User',
            'Emma Wilson',
            'Sarah Johnson',
            'Alex Thompson',
            'Lisa Martinez'
        ];
        return testUserNames.some(testName =>
            user.name.toLowerCase().includes(testName.toLowerCase()) ||
            testName.toLowerCase().includes(user.name.toLowerCase())
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-300">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-slate-400">Manage all platform users and view analytics</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400">
                        Last updated: {lastRefresh.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => setShowBulkDelete(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Test Users
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Delete Message */}
            {deleteMessage && (
                <div className={`mb-6 p-4 rounded-xl ${deleteMessage.type === 'success'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {deleteMessage.text}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Total Users</p>
                            <p className="text-xl font-semibold text-white">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">New This Week</p>
                            <p className="text-xl font-semibold text-white">{getNewUserCount()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Verified</p>
                            <p className="text-xl font-semibold text-white">{getVerifiedUserCount()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <UserX className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Unverified</p>
                            <p className="text-xl font-semibold text-white">{users.length - getVerifiedUserCount()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, handle, or bio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {[
                            { key: 'all', label: 'All Users', count: users.length },
                            { key: 'new', label: 'New Users', count: getNewUserCount() },
                            { key: 'verified', label: 'Verified', count: getVerifiedUserCount() },
                            { key: 'unverified', label: 'Unverified', count: users.length - getVerifiedUserCount() }
                        ].map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setFilterType(filter.key as any)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${filterType === filter.key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name A-Z</option>
                        <option value="followers">Most Followers</option>
                    </select>
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
                        <p className="text-slate-400">No users match the current filter criteria.</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer ${isNewUser(user) ? 'ring-2 ring-green-500/30' : ''} ${isTestUser(user) ? 'ring-2 ring-red-500/30' : ''}`}
                            onClick={() => {
                                setSelectedUser(user);
                                onUserSelect?.(user);
                            }}
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {isNewUser(user) && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <Clock className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white truncate">{user.name}</h3>
                                        {user.isVerified && (
                                            <Shield className="w-4 h-4 text-blue-400" />
                                        )}
                                        {isNewUser(user) && (
                                            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-md">
                                                New
                                            </span>
                                        )}
                                        {isTestUser(user) && (
                                            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-md">
                                                Test User
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-slate-400 text-sm mb-2">{user.handle}</p>

                                    {user.bio && (
                                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">{user.bio}</p>
                                    )}

                                    {/* User Stats */}
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {user.followersCount || 0} followers
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <UserCheck className="w-4 h-4" />
                                            {user.followingCount || 0} following
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {formatDate(user.memberSince || '')}
                                        </span>
                                    </div>

                                    {/* Specializations */}
                                    {user.specializations && user.specializations.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {user.specializations.map((spec, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-md"
                                                >
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Location and Social */}
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        {user.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {user.location}
                                            </span>
                                        )}
                                        {user.website && (
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-4 h-4" />
                                                Website
                                            </span>
                                        )}
                                        {user.socialMedia && Object.keys(user.socialMedia).length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4" />
                                                Social Media
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirmUser(user);
                                        }}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete user"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle user actions
                                        }}
                                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">User Details</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* User Header */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                                    <p className="text-slate-400">{selectedUser.handle}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {selectedUser.isVerified && (
                                            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-md">
                                                Verified
                                            </span>
                                        )}
                                        {isNewUser(selectedUser) && (
                                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md">
                                                New User
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-400">Followers</p>
                                    <p className="text-lg font-semibold text-white">{selectedUser.followersCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Following</p>
                                    <p className="text-lg font-semibold text-white">{selectedUser.followingCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Member Since</p>
                                    <p className="text-lg font-semibold text-white">{formatDate(selectedUser.memberSince || '')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Location</p>
                                    <p className="text-lg font-semibold text-white">{selectedUser.location || 'Not specified'}</p>
                                </div>
                            </div>

                            {selectedUser.bio && (
                                <div>
                                    <p className="text-sm text-slate-400 mb-2">Bio</p>
                                    <p className="text-white">{selectedUser.bio}</p>
                                </div>
                            )}

                            {selectedUser.specializations && selectedUser.specializations.length > 0 && (
                                <div>
                                    <p className="text-sm text-slate-400 mb-2">Specializations</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.specializations.map((spec, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-lg"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Confirmation Modal */}
            {deleteConfirmUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Delete User</h2>
                        </div>

                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete <strong className="text-white">{deleteConfirmUser.name}</strong>?
                            This action will permanently remove the user and all their associated data including:
                        </p>

                        <ul className="text-sm text-slate-400 mb-6 space-y-1">
                            <li>• All posts and comments</li>
                            <li>• Profile and images</li>
                            <li>• Following/follower relationships</li>
                            <li>• Notifications and activity</li>
                        </ul>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmUser(null)}
                                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteUser(deleteConfirmUser)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                {isDeleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Test Users Confirmation Modal */}
            {showBulkDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Delete Test Users</h2>
                        </div>

                        <p className="text-slate-300 mb-4">
                            This will delete all test users matching these names:
                        </p>

                        <div className="bg-slate-700/50 rounded-lg p-3 mb-6">
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• David Chen</li>
                                <li>• Mike Rodriguez</li>
                                <li>• Test User</li>
                                <li>• Emma Wilson</li>
                                <li>• Sarah Johnson</li>
                                <li>• Alex Thompson</li>
                                <li>• Lisa Martinez</li>
                            </ul>
                        </div>

                        <p className="text-red-400 text-sm mb-6">
                            ⚠️ This action cannot be undone and will permanently delete all associated data.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowBulkDelete(false)}
                                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDeleteTestUsers}
                                disabled={isBulkDeleting}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isBulkDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                {isBulkDeleting ? 'Deleting...' : 'Delete All Test Users'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
