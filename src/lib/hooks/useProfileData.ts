import { useState, useEffect, useCallback } from 'react';
import { User } from '@/lib/types';
import { getUserVerificationStats } from '@/lib/firebase/tipVerification';
import { getUserLeaderboardPosition } from '@/lib/leaderboardUtils';
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
        leaderboardPosition: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const loadUserStats = useCallback(async (profileUserId: string) => {
        setStatsLoading(true);
        try {
            const [verificationStats, leaderboardPosition] = await Promise.all([
                getUserVerificationStats(profileUserId),
                getUserLeaderboardPosition(profileUserId)
            ]);
            setUserStats({
                totalTips: verificationStats.totalTips,
                totalWins: verificationStats.totalWins,
                winRate: verificationStats.winRate,
                averageOdds: verificationStats.avgOdds,
                verifiedTips: verificationStats.verifiedTips,
                pendingTips: verificationStats.pendingTips,
                followers: followers.length,
                following: following.length,
                leaderboardPosition
            });
        } catch (error) {
            // Stats load failed silently
        } finally {
            setStatsLoading(false);
        }
    }, [followers.length, following.length]);

    useEffect(() => {
        if (userId) {
            loadUserStats(userId);
        }
    }, [userId, followers.length, following.length, loadUserStats]);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onSnapshot(
            query(collection(db, 'tipVerifications'), where('tipsterId', '==', userId)),
            () => {
                loadUserStats(userId);
            },
            () => {
                // Listener error, silent
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
