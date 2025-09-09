// Test Firebase Authentication
const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Testing Firebase Authentication...');
console.log('Config:', firebaseConfig);

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase app initialized');
  console.log('✅ Firebase auth initialized');
  console.log('Auth config:', auth.config);
  
  // Test if we can access auth methods
  console.log('Auth methods available:', Object.getOwnPropertyNames(auth.__proto__).filter(name => typeof auth[name] === 'function'));
  
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  console.error('Full error:', error);
}
