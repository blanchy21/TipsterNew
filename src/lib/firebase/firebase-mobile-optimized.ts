// Mobile-optimized Firebase configuration with fallback to synchronous imports
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";

// Check if Firebase environment variables are available
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const firebaseConfig = hasFirebaseConfig ? {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} : {
    // Fallback configuration for development
    apiKey: "demo-api-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "demo-app-id",
};

let app: FirebaseApp | null = null;

// Initialize Firebase app only once
try {
    if (hasFirebaseConfig) {
        app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    }
} catch (error) {
    console.error('[Mobile Firebase] Initialization failed:', error);
    app = null;
}

// Mobile detection
const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Mobile-optimized Firebase services with fallback
export const getMobileFirebaseAuth = async () => {
    if (!app) return null;

    try {
        // Try dynamic import first
        const { getAuth } = await import("firebase/auth");
        return getAuth(app);
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic auth import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const { getAuth } = require("firebase/auth");
            return getAuth(app);
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Auth fallback failed:', fallbackError);
            return null;
        }
    }
};

export const getMobileFirebaseFirestore = async () => {
    if (!app) return null;

    try {
        // Try dynamic import first
        const { getFirestore } = await import("firebase/firestore");
        return getFirestore(app);
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic firestore import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const { getFirestore } = require("firebase/firestore");
            return getFirestore(app);
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Firestore fallback failed:', fallbackError);
            return null;
        }
    }
};

export const getMobileFirebaseStorage = async () => {
    if (!app) return null;

    try {
        // Try dynamic import first
        const { getStorage } = await import("firebase/storage");
        return getStorage(app);
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic storage import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const { getStorage } = require("firebase/storage");
            return getStorage(app);
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Storage fallback failed:', fallbackError);
            return null;
        }
    }
};

// Mobile-optimized Firestore functions with fallback
export const getMobileFirestoreFunctions = async () => {
    try {
        // Try dynamic import first
        const {
            collection, query, onSnapshot, where, orderBy, limit, doc, getDoc,
            addDoc, updateDoc, deleteDoc, getDocs, writeBatch, serverTimestamp
        } = await import("firebase/firestore");

        return {
            collection,
            query,
            onSnapshot,
            where,
            orderBy,
            limit,
            doc,
            getDoc,
            addDoc,
            updateDoc,
            deleteDoc,
            getDocs,
            writeBatch,
            serverTimestamp
        };
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic firestore functions import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const {
                collection, query, onSnapshot, where, orderBy, limit, doc, getDoc,
                addDoc, updateDoc, deleteDoc, getDocs, writeBatch, serverTimestamp
            } = require("firebase/firestore");

            return {
                collection,
                query,
                onSnapshot,
                where,
                orderBy,
                limit,
                doc,
                getDoc,
                addDoc,
                updateDoc,
                deleteDoc,
                getDocs,
                writeBatch,
                serverTimestamp
            };
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Firestore functions fallback failed:', fallbackError);
            return null;
        }
    }
};

// Mobile-optimized Auth functions with fallback
export const getMobileAuthFunctions = async () => {
    try {
        // Try dynamic import first
        const {
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signInWithPopup,
            GoogleAuthProvider,
            signOut,
            onAuthStateChanged,
            updateProfile,
            sendPasswordResetEmail
        } = await import("firebase/auth");

        return {
            signInWithEmailAndPassword,
            createUserWithEmailAndPassword,
            signInWithPopup,
            GoogleAuthProvider,
            signOut,
            onAuthStateChanged,
            updateProfile,
            sendPasswordResetEmail
        };
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic auth functions import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const {
                signInWithEmailAndPassword,
                createUserWithEmailAndPassword,
                signInWithPopup,
                GoogleAuthProvider,
                signOut,
                onAuthStateChanged,
                updateProfile,
                sendPasswordResetEmail
            } = require("firebase/auth");

            return {
                signInWithEmailAndPassword,
                createUserWithEmailAndPassword,
                signInWithPopup,
                GoogleAuthProvider,
                signOut,
                onAuthStateChanged,
                updateProfile,
                sendPasswordResetEmail
            };
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Auth functions fallback failed:', fallbackError);
            return null;
        }
    }
};

// Mobile-optimized Storage functions with fallback
export const getMobileStorageFunctions = async () => {
    try {
        // Try dynamic import first
        const { ref, uploadBytes, getDownloadURL, deleteObject } = await import("firebase/storage");

        return {
            ref,
            uploadBytes,
            getDownloadURL,
            deleteObject
        };
    } catch (error) {
        console.warn('[Mobile Firebase] Dynamic storage functions import failed, using fallback:', error);

        // Fallback to synchronous import
        try {
            const { ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");

            return {
                ref,
                uploadBytes,
                getDownloadURL,
                deleteObject
            };
        } catch (fallbackError) {
            console.error('[Mobile Firebase] Storage functions fallback failed:', fallbackError);
            return null;
        }
    }
};

// Export the app instance
export { app, isMobile };
