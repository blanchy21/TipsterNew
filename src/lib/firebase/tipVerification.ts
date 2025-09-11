import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { createNotification } from './firebaseUtils';

export interface TipVerification {
    id: string;
    postId: string;
    tipsterId: string;
    adminId: string;
    status: 'pending' | 'win' | 'loss' | 'void' | 'place';
    verifiedAt: string;
    notes?: string;
    originalOdds?: string;
    finalOdds?: string;
}

export interface VerificationStats {
    totalTips: number;
    verifiedTips: number;
    pendingTips: number;
    winRate: number;
    totalWins: number;
    avgOdds: number;
    topSports: { sport: string; count: number; winRate: number }[];
}

// Create a tip verification record
export const createTipVerification = async (verificationData: Omit<TipVerification, 'id' | 'verifiedAt'>) => {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        const verification = {
            ...verificationData,
            verifiedAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'tipVerifications'), verification);

        // Get admin user profile for notification
        console.log('🔍 Getting admin profile for notification:', verificationData.adminId);
        const adminDoc = await getDoc(doc(db, 'users', verificationData.adminId));
        const adminData = adminDoc.data();
        console.log('👤 Admin data:', adminData);

        // Create notification for the tipster
        console.log('🔔 Creating notification for tipster:', verificationData.tipsterId);
        const notificationId = await createNotification({
            type: 'tip',
            title: 'Tip Verified',
            message: `Your tip has been marked as ${verificationData.status}`,
            user: adminData ? {
                id: verificationData.adminId,
                name: adminData.displayName || adminData.name || 'Admin',
                handle: adminData.handle || '@admin',
                avatar: adminData.photoURL || adminData.avatar || ''
            } : undefined,
            recipientId: verificationData.tipsterId,
            postId: verificationData.postId,
            actionUrl: `/post/${verificationData.postId}`
        });
        console.log('✅ Notification created with ID:', notificationId);

        return { id: docRef.id, ...verification };
    } catch (error) {
        console.error('Error creating tip verification:', error);
        throw error;
    }
};

// Get verification statistics for a user
export const getUserVerificationStats = async (userId: string): Promise<VerificationStats> => {
    if (!db) {
        return {
            totalTips: 0,
            verifiedTips: 0,
            pendingTips: 0,
            winRate: 0,
            totalWins: 0,
            avgOdds: 0,
            topSports: []
        };
    }

    try {
        // Get all posts by the user
        const postsQuery = query(
            collection(db, 'posts'),
            where('userId', '==', userId)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Get all verifications for the user's posts
        const verificationsQuery = query(
            collection(db, 'tipVerifications'),
            where('tipsterId', '==', userId)
        );
        const verificationsSnapshot = await getDocs(verificationsQuery);
        const verifications = verificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];

        // Only count posts that have a tipStatus (actual tips, not test posts)
        const actualTips = posts.filter(p => p.tipStatus !== undefined);
        const totalTips = actualTips.length;
        const verifiedTips = verifications.length;
        const pendingTips = actualTips.filter(p => p.tipStatus === 'pending').length;
        const wins = verifications.filter(v => v.status === 'win').length;
        const winRate = verifiedTips > 0 ? Math.round((wins / verifiedTips) * 100) : 0;


        // Calculate average odds
        const oddsValues = actualTips
            .filter(p => p.odds)
            .map(p => {
                const odds = p.odds || '0';
                if (odds.includes('/')) {
                    const [numerator, denominator] = odds.split('/').map(Number);
                    return (numerator / denominator) + 1;
                }
                return parseFloat(odds) || 0;
            });

        const avgOdds = oddsValues.length > 0
            ? Math.round(oddsValues.reduce((sum, odds) => sum + odds, 0) / oddsValues.length * 100) / 100
            : 0;

        // Calculate top sports
        const sportStats: { [key: string]: { count: number; wins: number } } = {};
        actualTips.forEach(post => {
            if (!sportStats[post.sport]) {
                sportStats[post.sport] = { count: 0, wins: 0 };
            }
            sportStats[post.sport].count++;
        });

        verifications.forEach(verification => {
            const post = posts.find(p => p.id === verification.postId);
            if (post && verification.status === 'win') {
                sportStats[post.sport].wins++;
            }
        });

        const topSports = Object.entries(sportStats)
            .map(([sport, stats]) => ({
                sport,
                count: stats.count,
                winRate: stats.count > 0 ? Math.round((stats.wins / stats.count) * 100) : 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalTips,
            verifiedTips,
            pendingTips,
            winRate,
            totalWins: wins,
            avgOdds,
            topSports
        };
    } catch (error) {
        console.error('Error getting user verification stats:', error);
        return {
            totalTips: 0,
            verifiedTips: 0,
            pendingTips: 0,
            winRate: 0,
            totalWins: 0,
            avgOdds: 0,
            topSports: []
        };
    }
};

// Get all tip verifications with real-time updates
export const getTipVerifications = (callback: (verifications: TipVerification[]) => void) => {
    if (!db) {
        callback([]);
        return () => { };
    }

    const verificationsQuery = query(
        collection(db, 'tipVerifications'),
        orderBy('verifiedAt', 'desc')
    );

    const unsubscribe = onSnapshot(verificationsQuery, (snapshot) => {
        const verifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as TipVerification[];

        callback(verifications);
    }, (error) => {
        console.error('Error listening to tip verifications:', error);
        callback([]);
    });

    return unsubscribe;
};

// Get verification history for a specific post
export const getPostVerificationHistory = async (postId: string): Promise<TipVerification[]> => {
    if (!db) {
        return [];
    }

    try {
        const verificationsQuery = query(
            collection(db, 'tipVerifications'),
            where('postId', '==', postId),
            orderBy('verifiedAt', 'desc')
        );

        const snapshot = await getDocs(verificationsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as TipVerification[];
    } catch (error) {
        console.error('Error getting post verification history:', error);
        return [];
    }
};

// Update tip verification
export const updateTipVerification = async (verificationId: string, updates: Partial<TipVerification>) => {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        const { updateDoc, doc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'tipVerifications', verificationId), updates);
    } catch (error) {
        console.error('Error updating tip verification:', error);
        throw error;
    }
};

// Delete tip verification
export const deleteTipVerification = async (verificationId: string) => {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        const { deleteDoc, doc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'tipVerifications', verificationId));
    } catch (error) {
        console.error('Error deleting tip verification:', error);
        throw error;
    }
};
