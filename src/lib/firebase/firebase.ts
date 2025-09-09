import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if Firebase environment variables are available
const hasFirebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

console.log("Firebase config check:");
console.log("API Key present:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("Auth Domain present:", !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("Project ID present:", !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("Has Firebase config:", hasFirebaseConfig);

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

    console.log('✅ Firebase initialized successfully');
    console.log('📊 Firebase config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey
    });

    // Reduce Firebase console warnings in development
    if (process.env.NODE_ENV === 'development') {
      // Suppress Firebase heartbeats warnings
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string' &&
          (args[0].includes('heartbeats') || args[0].includes('undefined'))) {
          return; // Suppress heartbeats and undefined warnings
        }
        originalConsoleWarn.apply(console, args);
      };

      // Also suppress console.log for heartbeats
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('heartbeats')) {
          return; // Suppress heartbeats logs
        }
        originalConsoleLog.apply(console, args);
      };
    }
  } else {
    console.warn("Firebase configuration not found. Authentication features will be disabled.");
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
