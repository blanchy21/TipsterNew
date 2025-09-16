// Optimized Firebase configuration with tree shaking and dynamic imports
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
    app = null;
}

// Dynamic imports for Firebase services - only load when needed
export const getFirebaseAuth = async () => {
    if (!app) return null;
    const { getAuth } = await import("firebase/auth");
    return getAuth(app);
};

export const getFirebaseFirestore = async () => {
    if (!app) return null;
    const { getFirestore } = await import("firebase/firestore");
    return getFirestore(app);
};

export const getFirebaseStorage = async () => {
    if (!app) return null;
    const { getStorage } = await import("firebase/storage");
    return getStorage(app);
};

// Specific Firestore functions - tree shaken imports
export const getFirestoreFunctions = async () => {
    const [
        { collection, query, onSnapshot, where, orderBy, limit, doc, getDoc, addDoc, updateDoc, deleteDoc, getDocs, writeBatch, serverTimestamp },
        { orderBy: orderByQuery, where: whereQuery }
    ] = await Promise.all([
        import("firebase/firestore"),
        import("firebase/firestore")
    ]);

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
        serverTimestamp,
        orderByQuery,
        whereQuery
    };
};

// Specific Auth functions - tree shaken imports
export const getAuthFunctions = async () => {
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
};

// Specific Storage functions - tree shaken imports
export const getStorageFunctions = async () => {
    const { ref, uploadBytes, getDownloadURL, deleteObject } = await import("firebase/storage");

    return {
        ref,
        uploadBytes,
        getDownloadURL,
        deleteObject
    };
};

// Suppress Firebase console warnings in development
if (process.env.NODE_ENV === 'development' && app) {
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string' &&
            (message.includes('heartbeats') ||
                message.includes('undefined') ||
                message.includes('WebChannelConnection') ||
                message.includes('Firebase') && message.includes('heartbeat'))) {
            return;
        }
        originalConsoleWarn.apply(console, args);
    };
}

export { app };
