import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

interface UseRealtimeDataOptions {
    collectionName: string;
    queryConstraints?: QueryConstraint[];
    transform?: (data: any) => any;
    enabled?: boolean;
}

export function useRealtimeData<T>(
    options: UseRealtimeDataOptions
) {
    const { collectionName, queryConstraints = [], transform, enabled = true } = options;
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled || !db) {
            setData([]);
            setLoading(false);
            return;
        }

        console.log(`🔄 Setting up real-time listener for ${collectionName}`);
        setLoading(true);
        setError(null);

        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...queryConstraints);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                console.log(`📡 Real-time update received for ${collectionName}:`, snapshot.size, 'documents');

                const newData = snapshot.docs.map(doc => {
                    const docData = doc.data();
                    const transformedData = {
                        id: doc.id,
                        ...docData,
                        // Handle Firestore timestamps
                        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : docData.createdAt,
                        updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate().toISOString() : docData.updatedAt,
                        editedAt: docData.editedAt?.toDate ? docData.editedAt.toDate().toISOString() : docData.editedAt,
                    };

                    return transform ? transform(transformedData) : transformedData;
                });

                setData(newData as T[]);
                setLoading(false);
            },
            (error) => {
                console.error(`❌ Real-time listener error for ${collectionName}:`, error);
                setError(error);
                setLoading(false);
            }
        );

        return () => {
            console.log(`🧹 Cleaning up real-time listener for ${collectionName}`);
            unsubscribe();
        };
    }, [collectionName, enabled, JSON.stringify(queryConstraints)]);

    return { data, loading, error };
}

// Specific hooks for common use cases
export function useRealtimePosts() {
    return useRealtimeData({
        collectionName: 'posts',
        queryConstraints: [orderBy('createdAt', 'desc')],
        enabled: true
    });
}

export function useRealtimeComments(postId: string) {
    return useRealtimeData({
        collectionName: 'comments',
        queryConstraints: [
            where('postId', '==', postId),
            orderBy('createdAt', 'asc')
        ],
        enabled: !!postId
    });
}

export function useRealtimeNotifications(userId: string) {
    return useRealtimeData({
        collectionName: 'notifications',
        queryConstraints: [
            where('recipientId', '==', userId),
            orderBy('createdAt', 'desc')
        ],
        enabled: !!userId
    });
}
