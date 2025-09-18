'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Calendar,
    Mail,
    MapPin,
    Trophy,
    TrendingUp,
    Search,
    Filter,
    Loader2,
    Eye,
    UserCheck,
    UserX,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { getDocuments } from '@/lib/firebase/firebaseUtils';
import { User } from '@/lib/types';

interface UserStats {
    totalUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    verifiedUsers: number;
    unverifiedUsers: number;
}

const UserManagementPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified' | 'new'>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
    const [stats, setStats] = useState<UserStats>({
        totalUsers: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0
    });

    // Load users and calculate stats
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoading(true);
                const usersData = await getDocuments('users');
                setUsers(usersData as User[]);

                // Calculate statistics
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

                const newUsersToday = usersData.filter((user: User) =>
                    new Date(user.memberSince || '') >= today
                ).length;

                const newUsersThisWeek = usersData.filter((user: User) =>
                    new Date(user.memberSince || '') >= weekAgo
                ).length;

                const newUsersThisMonth = usersData.filter((user: User) =>
                    new Date(user.memberSince || '') >= monthAgo
                ).length;

                const verifiedUsers = usersData.filter((user: User) => user.isVerified).length;
                const unverifiedUsers = usersData.length - verifiedUsers;

                setStats({
                    totalUsers: usersData.length,
                    newUsersToday,
                    newUsersThisWeek,
                    newUsersThisMonth,
                    verifiedUsers,
                    unverifiedUsers
                });
            } catch (error) {
                // Error loading users - handled silently
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, []);

    // Filter and sort users
    useEffect(() => {
        let filtered = [...users];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply status filter
        switch (filterStatus) {
            case 'verified':
                filtered = filtered.filter(user => user.isVerified);
                break;
            case 'unverified':
                filtered = filtered.filter(user => !user.isVerified);
                break;
            case 'new':
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(user =>
                    new Date(user.memberSince || '') >= weekAgo
                );
                break;
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.memberSince || '').getTime() -
                        new Date(a.memberSince || '').getTime();
                case 'oldest':
                    return new Date(a.memberSince || '').getTime() -
                        new Date(b.memberSince || '').getTime();
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                default:
                    return 0;
            }
        });

        setFilteredUsers(filtered);
    }, [users, searchTerm, filterStatus, sortBy]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isNewUser = (user: User) => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(user.memberSince || '') >= weekAgo;
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                        <p className="text-slate-400">Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">New This Week</p>
                            <p className="text-3xl font-bold text-green-400">{stats.newUsersThisWeek}</p>
                        </div>
                        <UserPlus className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Verified Users</p>
                            <p className="text-3xl font-bold text-purple-400">{stats.verifiedUsers}</p>
                        </div>
                        <UserCheck className="w-8 h-8 text-purple-400" />
                    </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">Unverified</p>
                            <p className="text-3xl font-bold text-yellow-400">{stats.unverifiedUsers}</p>
                        </div>
                        <UserX className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Users</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                            <option value="new">New (This Week)</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
                        <p className="text-slate-400">No users match the current filter criteria.</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold text-white">{user.name || 'Unknown User'}</h3>
                                                {isNewUser(user) && (
                                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                                        New
                                                    </span>
                                                )}
                                                {user.isVerified ? (
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-yellow-400" />
                                                )}
                                            </div>
                                            <p className="text-slate-400 text-sm">@{user.handle}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        {user.specializations && user.specializations.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Trophy className="w-4 h-4 text-blue-400" />
                                                <span className="text-slate-300">{user.specializations.join(', ')}</span>
                                            </div>
                                        )}
                                        {user.location && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-green-400" />
                                                <span className="text-slate-300">{user.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span className="text-slate-300">
                                                Joined {formatDate(user.memberSince || '')}
                                            </span>
                                        </div>
                                    </div>

                                    {user.bio && (
                                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{user.bio}</p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>ID: {user.id}</span>
                                        {user.socialMedia?.twitter && (
                                            <span>• Twitter: @{user.socialMedia.twitter}</span>
                                        )}
                                        {user.socialMedia?.instagram && (
                                            <span>• Instagram: @{user.socialMedia.instagram}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2 text-sm">
                                        <Eye className="w-4 h-4" />
                                        View Profile
                                    </button>
                                    {!user.isVerified && (
                                        <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2 text-sm">
                                            <UserCheck className="w-4 h-4" />
                                            Verify
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination could be added here if needed */}
            {filteredUsers.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <p className="text-slate-400">
                        Showing {filteredUsers.length} of {users.length} users
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserManagementPanel;
