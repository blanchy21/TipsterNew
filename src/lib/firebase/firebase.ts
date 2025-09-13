import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
  // Fallback configuration for development (will not work for auth but prevents errors)
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

try {
  // Initialize Firebase only if we have valid config
  if (hasFirebaseConfig) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Reduce Firebase console warnings in development
    if (process.env.NODE_ENV === 'development') {
      // Suppress Firebase heartbeats warnings and other noise
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (typeof message === 'string' &&
          (message.includes('heartbeats') ||
            message.includes('undefined') ||
            message.includes('WebChannelConnection') ||
            message.includes('Firebase') && message.includes('heartbeat'))) {
          return; // Suppress Firebase noise
        }
        originalConsoleWarn.apply(console, args);
      };

      // Also suppress console.log for heartbeats and Firebase noise
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        const message = args[0];
        if (typeof message === 'string' &&
          (message.includes('heartbeats') ||
            message.includes('WebChannelConnection') ||
            (message.includes('Firebase') && message.includes('heartbeat')) ||
            message.includes('undefined'))) {
          return; // Suppress Firebase noise and heartbeats
        }
        originalConsoleLog.apply(console, args);
      };

      // Also suppress console.error for Firebase heartbeats
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string' &&
          (message.includes('heartbeats') ||
            message.includes('undefined'))) {
          return; // Suppress Firebase heartbeats errors
        }
        originalConsoleError.apply(console, args);
      };
    }
  } else {

    // Create mock objects to prevent errors
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { app, auth, db, storage };
