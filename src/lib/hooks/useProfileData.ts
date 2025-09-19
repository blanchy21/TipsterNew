import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import { getUserVerificationStats } from '@/lib/firebase/tipVerification';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface ProfileStats {
    totalTips: number;
    totalWins: number;
    winRate: number;
    averageOdds: number;
    verifiedTips: number;
    pendingTips: number;
    followers: number;
    following: number;
    currentWinStreak: number;
    longestWinStreak: number;
    leaderboardPosition: number;
}

interface UseProfileDataProps {
    userId?: string;
    followers: User[];
    following: User[];
}

export function useProfileData({ userId, followers, following }: UseProfileDataProps) {
    const [userStats, setUserStats] = useState<ProfileStats>({
        totalTips: 0,
        totalWins: 0,
        winRate: 0,
        averageOdds: 0,
        verifiedTips: 0,
        pendingTips: 0,
        followers: 0,
        following: 0,
        currentWinStreak: 0,
        longestWinStreak: 0,
        leaderboardPosition: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const loadUserStats = useCallback(async (profileUserId: string) => {
        setStatsLoading(true);
        try {
            const verificationStats = await getUserVerificationStats(profileUserId);
            setUserStats({
                totalTips: verificationStats.totalTips,
                totalWins: verificationStats.totalWins,
                winRate: verificationStats.winRate,
                averageOdds: verificationStats.avgOdds,
                verifiedTips: verificationStats.verifiedTips,
                pendingTips: verificationStats.pendingTips,
                followers: followers.length,
                following: following.length,
                currentWinStreak: verificationStats.currentWinStreak,
                longestWinStreak: verificationStats.longestWinStreak,
                leaderboardPosition: Math.floor(Math.random() * 50 + 1) // Random position between 1-50
            });
        } catch (error) {
            // Console statement removed for production
        } finally {
            setStatsLoading(false);
        }
    }, [followers.length, following.length]);

    // Load user stats when userId changes
    useEffect(() => {
        if (userId) {
            loadUserStats(userId);
        }
    }, [userId, followers.length, following.length, loadUserStats]);

    // Real-time listener for verification updates
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onSnapshot(
            query(collection(db, 'tipVerifications'), where('tipsterId', '==', userId)),
            (snapshot) => {
                // Reload stats when verifications change
                loadUserStats(userId);
            },
            (error) => {
                // Console statement removed for production
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId, loadUserStats]);

    return {
        userStats,
        statsLoading,
        loadUserStats
    };
}

export default useProfileData;
