import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
    if (!db) {
        throw new Error('Firebase not initialized');
    }

    try {
        // Try to read a simple document to test connection
        const testDoc = doc(db, 'test', 'connection');
        const docSnap = await getDoc(testDoc);

        return {
            success: true,
            message: 'Firebase connection successful',
            data: docSnap.exists() ? docSnap.data() : null
        };
    } catch (error) {
        return {
            success: false,
            message: `Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            error: error
        };
    }
};
