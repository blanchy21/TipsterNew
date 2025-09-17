// Mobile-first Firebase configuration with synchronous imports for mobile devices
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
    console.error('[Mobile-First Firebase] Initialization failed:', error);
    app = null;
}

// Mobile detection with more comprehensive checks
const isMobile = () => {
    if (typeof window === 'undefined') return false;

    // Check user agent
    const userAgent = navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;

    // Check screen size
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const isSmallScreen = screenWidth <= 768 || screenHeight <= 1024;

    // Check touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return mobileRegex.test(userAgent) || (isSmallScreen && hasTouch);
};

// Mobile-first Firebase services - use synchronous imports for mobile
export const getMobileFirstFirebaseAuth = async () => {
    if (!app) return null;

    if (isMobile()) {
        // Use synchronous imports for mobile
        try {
            const { getAuth } = require("firebase/auth");
            return getAuth(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Auth synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
        try {
            const { getAuth } = await import("firebase/auth");
            return getAuth(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Auth dynamic import failed:', error);
            return null;
        }
    }
};

export const getMobileFirstFirebaseFirestore = async () => {
    if (!app) return null;

    if (isMobile()) {
        // Use synchronous imports for mobile
        try {
            const { getFirestore } = require("firebase/firestore");
            return getFirestore(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Firestore synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
        try {
            const { getFirestore } = await import("firebase/firestore");
            return getFirestore(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Firestore dynamic import failed:', error);
            return null;
        }
    }
};

export const getMobileFirstFirebaseStorage = async () => {
    if (!app) return null;

    if (isMobile()) {
        // Use synchronous imports for mobile
        try {
            const { getStorage } = require("firebase/storage");
            return getStorage(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Storage synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
        try {
            const { getStorage } = await import("firebase/storage");
            return getStorage(app);
        } catch (error) {
            console.error('[Mobile-First Firebase] Storage dynamic import failed:', error);
            return null;
        }
    }
};

// Mobile-first Firestore functions
export const getMobileFirstFirestoreFunctions = async () => {
    if (isMobile()) {
        // Use synchronous imports for mobile
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
        } catch (error) {
            console.error('[Mobile-First Firebase] Firestore functions synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
        try {
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
            console.error('[Mobile-First Firebase] Firestore functions dynamic import failed:', error);
            return null;
        }
    }
};

// Mobile-first Auth functions
export const getMobileFirstAuthFunctions = async () => {
    if (isMobile()) {
        // Use synchronous imports for mobile
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
        } catch (error) {
            console.error('[Mobile-First Firebase] Auth functions synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
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
            console.error('[Mobile-First Firebase] Auth functions dynamic import failed:', error);
            return null;
        }
    }
};

// Mobile-first Storage functions
export const getMobileFirstStorageFunctions = async () => {
    if (isMobile()) {
        // Use synchronous imports for mobile
        try {
            const { ref, uploadBytes, getDownloadURL, deleteObject } = require("firebase/storage");

            return {
                ref,
                uploadBytes,
                getDownloadURL,
                deleteObject
            };
        } catch (error) {
            console.error('[Mobile-First Firebase] Storage functions synchronous import failed:', error);
            return null;
        }
    } else {
        // Use dynamic imports for desktop
        try {
            const { ref, uploadBytes, getDownloadURL, deleteObject } = await import("firebase/storage");

            return {
                ref,
                uploadBytes,
                getDownloadURL,
                deleteObject
            };
        } catch (error) {
            console.error('[Mobile-First Firebase] Storage functions dynamic import failed:', error);
            return null;
        }
    }
};

// Export the app instance and mobile detection
export { app, isMobile };
