// Mobile-specific Firebase debugging and fallback
import { getFirebaseFirestore, getFirestoreFunctions, getFirebaseAuth, getAuthFunctions } from './firebase-optimized';

// Mobile detection
export const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Mobile-specific Firebase loading with fallbacks
export const getMobileFirebaseFirestore = async () => {
    const startTime = performance.now();

    try {
        console.log('[Mobile Debug] Starting Firestore load...');
        const db = await getFirebaseFirestore();
        const loadTime = performance.now() - startTime;
        console.log(`[Mobile Debug] Firestore loaded in ${loadTime.toFixed(2)}ms`);

        if (!db) {
            console.warn('[Mobile Debug] Firestore returned null');
            return null;
        }

        return db;
    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error(`[Mobile Debug] Firestore load failed after ${loadTime.toFixed(2)}ms:`, error);
        return null;
    }
};

export const getMobileFirestoreFunctions = async () => {
    const startTime = performance.now();

    try {
        console.log('[Mobile Debug] Starting Firestore functions load...');
        const functions = await getFirestoreFunctions();
        const loadTime = performance.now() - startTime;
        console.log(`[Mobile Debug] Firestore functions loaded in ${loadTime.toFixed(2)}ms`);

        return functions;
    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error(`[Mobile Debug] Firestore functions load failed after ${loadTime.toFixed(2)}ms:`, error);
        return null;
    }
};

export const getMobileFirebaseAuth = async () => {
    const startTime = performance.now();

    try {
        console.log('[Mobile Debug] Starting Auth load...');
        const auth = await getFirebaseAuth();
        const loadTime = performance.now() - startTime;
        console.log(`[Mobile Debug] Auth loaded in ${loadTime.toFixed(2)}ms`);

        return auth;
    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error(`[Mobile Debug] Auth load failed after ${loadTime.toFixed(2)}ms:`, error);
        return null;
    }
};

export const getMobileAuthFunctions = async () => {
    const startTime = performance.now();

    try {
        console.log('[Mobile Debug] Starting Auth functions load...');
        const functions = await getAuthFunctions();
        const loadTime = performance.now() - startTime;
        console.log(`[Mobile Debug] Auth functions loaded in ${loadTime.toFixed(2)}ms`);

        return functions;
    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error(`[Mobile Debug] Auth functions load failed after ${loadTime.toFixed(2)}ms:`, error);
        return null;
    }
};

// Test Firebase connectivity on mobile
export const testMobileFirebaseConnectivity = async () => {
    console.log('[Mobile Debug] Testing Firebase connectivity...');

    const results = {
        isMobile: isMobile(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
        firestore: false,
        firestoreFunctions: false,
        auth: false,
        authFunctions: false,
        errors: [] as string[]
    };

    try {
        // Test Firestore
        const db = await getMobileFirebaseFirestore();
        results.firestore = !!db;

        // Test Firestore functions
        const firestoreFunctions = await getMobileFirestoreFunctions();
        results.firestoreFunctions = !!firestoreFunctions;

        // Test Auth
        const auth = await getMobileFirebaseAuth();
        results.auth = !!auth;

        // Test Auth functions
        const authFunctions = await getMobileAuthFunctions();
        results.authFunctions = !!authFunctions;

    } catch (error) {
        results.errors.push(error instanceof Error ? error.message : String(error));
    }

    console.log('[Mobile Debug] Connectivity test results:', results);
    return results;
};

// Fallback to synchronous imports if dynamic imports fail on mobile
export const getMobileFirebaseFallback = async () => {
    console.log('[Mobile Debug] Attempting Firebase fallback...');

    try {
        // Try synchronous imports as fallback
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getFirestore } = await import('firebase/firestore');
        const { getAuth } = await import('firebase/auth');

        // Use the same config as the optimized version
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "demo-app-id",
        };

        const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        console.log('[Mobile Debug] Fallback successful');

        return { app, db, auth };
    } catch (error) {
        console.error('[Mobile Debug] Fallback failed:', error);
        return null;
    }
};
