import { db } from './firebase/firebase';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { User } from './types';
import { getUserVerificationStats } from './firebase/tipVerification';

export interface LeaderboardEntry {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    totalTips: number;
    totalWins: number;
    totalLosses: number;
    winRate: number;
    averageOdds: number;
    verifiedTips: number;
    pendingTips: number;
    isVerified: boolean;
    specializations: string[];
    position: number;
    previousPosition?: number;
    positionChange?: number;
}

export interface LeaderboardStats {
    totalUsers: number;
    totalTips: number;
    totalWins: number;
    totalLosses: number;
    totalPending: number;
    averageWinRate: number;
    averageOdds: number;
}

// Get all users with their tip statistics
export const getAllUsersWithStats = async (): Promise<LeaderboardEntry[]> => {
    if (!db) {
        console.warn('Firebase not initialized');
        return [];
    }

    try {
        // Get all users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
        console.log(`👥 Found ${users.length} users`);

        // Get stats for each user
        const leaderboardEntries: LeaderboardEntry[] = [];

        for (const user of users) {
            try {
                const verificationStats = await getUserVerificationStats(user.id);

                // Only include users who have made tips
                if (verificationStats.totalTips > 0) {
                    const entry: LeaderboardEntry = {
                        id: user.id,
                        name: user.displayName || user.name || 'Unknown User',
                        handle: user.handle || `@user${user.id.slice(0, 8)}`,
                        avatar: user.photoURL || user.avatar || '/default-avatar.png',
                        totalTips: verificationStats.totalTips,
                        totalWins: verificationStats.totalWins,
                        totalLosses: verificationStats.totalLosses,
                        winRate: verificationStats.winRate,
                        averageOdds: verificationStats.avgOdds,
                        verifiedTips: verificationStats.verifiedTips,
                        pendingTips: verificationStats.pendingTips,
                        isVerified: user.isVerified || false,
                        specializations: user.specializations || [],
                        position: 0 // Will be set after sorting
                    };

                    leaderboardEntries.push(entry);
                    console.log(`✅ Added ${user.displayName || user.name || user.id} to leaderboard with ${verificationStats.totalTips} tips`);
                } else {
                    console.log(`❌ User ${user.displayName || user.name || user.id} has no tips (${verificationStats.totalTips})`);
                }
            } catch (error) {
                console.error(`Error getting stats for user ${user.id}:`, error);
                // Continue with other users even if one fails
            }
        }

        // Sort by win rate (primary) and total tips (secondary)
        leaderboardEntries.sort((a, b) => {
            if (b.winRate !== a.winRate) {
                return b.winRate - a.winRate;
            }
            return b.totalTips - a.totalTips;
        });

        // Set positions
        leaderboardEntries.forEach((entry, index) => {
            entry.position = index + 1;
        });

        return leaderboardEntries;
    } catch (error) {
        console.error('Error getting all users with stats:', error);
        return [];
    }
};

// Get leaderboard statistics
export const getLeaderboardStats = async (): Promise<LeaderboardStats> => {
    if (!db) {
        return {
            totalUsers: 0,
            totalTips: 0,
            totalWins: 0,
            totalLosses: 0,
            totalPending: 0,
            averageWinRate: 0,
            averageOdds: 0
        };
    }

    try {
        const entries = await getAllUsersWithStats();

        const totalUsers = entries.length;
        const totalTips = entries.reduce((sum, entry) => sum + entry.totalTips, 0);
        const totalWins = entries.reduce((sum, entry) => sum + entry.totalWins, 0);
        const totalLosses = entries.reduce((sum, entry) => sum + entry.totalLosses, 0);
        const totalPending = entries.reduce((sum, entry) => sum + entry.pendingTips, 0);
        const averageWinRate = totalUsers > 0 ?
            Math.round(entries.reduce((sum, entry) => sum + entry.winRate, 0) / totalUsers * 100) / 100 : 0;
        const averageOdds = totalUsers > 0 ?
            Math.round(entries.reduce((sum, entry) => sum + entry.averageOdds, 0) / totalUsers * 100) / 100 : 0;

        return {
            totalUsers,
            totalTips,
            totalWins,
            totalLosses,
            totalPending,
            averageWinRate,
            averageOdds
        };
    } catch (error) {
        console.error('Error getting leaderboard stats:', error);
        return {
            totalUsers: 0,
            totalTips: 0,
            totalWins: 0,
            totalLosses: 0,
            totalPending: 0,
            averageWinRate: 0,
            averageOdds: 0
        };
    }
};

// Get top tipsters (limited number)
export const getTopTipsters = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const allEntries = await getAllUsersWithStats();
    return allEntries.slice(0, limit);
};

// Get user's position in leaderboard
export const getUserLeaderboardPosition = async (userId: string): Promise<number> => {
    const allEntries = await getAllUsersWithStats();
    const userEntry = allEntries.find(entry => entry.id === userId);
    return userEntry ? userEntry.position : 0;
};

// Sort leaderboard by different criteria
export const sortLeaderboard = (
    entries: LeaderboardEntry[],
    sortBy: 'winRate' | 'totalTips' | 'averageOdds' | 'totalWins' | 'totalLosses' | 'pendingTips'
): LeaderboardEntry[] => {
    const sorted = [...entries].sort((a, b) => {
        switch (sortBy) {
            case 'winRate':
                if (b.winRate !== a.winRate) return b.winRate - a.winRate;
                return b.totalTips - a.totalTips; // Secondary sort by total tips
            case 'totalTips':
                if (b.totalTips !== a.totalTips) return b.totalTips - a.totalTips;
                return b.winRate - a.winRate; // Secondary sort by win rate
            case 'averageOdds':
                if (b.averageOdds !== a.averageOdds) return b.averageOdds - a.averageOdds;
                return b.winRate - a.winRate; // Secondary sort by win rate
            case 'totalWins':
                if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
                return b.winRate - a.winRate; // Secondary sort by win rate
            case 'totalLosses':
                if (b.totalLosses !== a.totalLosses) return b.totalLosses - a.totalLosses;
                return b.winRate - a.winRate; // Secondary sort by win rate
            case 'pendingTips':
                if (b.pendingTips !== a.pendingTips) return b.pendingTips - a.pendingTips;
                return b.winRate - a.winRate; // Secondary sort by win rate
            default:
                return 0;
        }
    });

    // Update positions after sorting
    sorted.forEach((entry, index) => {
        entry.position = index + 1;
    });

    return sorted;
};

// Filter leaderboard by minimum tips threshold
export const filterLeaderboardByMinTips = (
    entries: LeaderboardEntry[],
    minTips: number
): LeaderboardEntry[] => {
    return entries.filter(entry => entry.totalTips >= minTips);
};

// Get leaderboard entries for a specific sport
export const getLeaderboardBySport = async (sport: string): Promise<LeaderboardEntry[]> => {
    const allEntries = await getAllUsersWithStats();
    return allEntries.filter(entry =>
        entry.specializations.includes(sport)
    );
};
