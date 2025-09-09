// Simple Firebase Auth test
const { initializeApp } = require('firebase/app');
const { getAuth } = require('firebase/auth');

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

console.log('Testing Firebase Auth after enabling Authentication...');

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('✅ Firebase app initialized successfully');
  console.log('✅ Firebase auth initialized successfully');
  console.log('Auth domain:', auth.config.authDomain);
  console.log('Project ID:', auth.config.apiKey ? 'API Key present' : 'API Key missing');
  
  // Test auth state listener (this should work now)
  const unsubscribe = auth.onAuthStateChanged((user) => {
    console.log('✅ Auth state listener working! User:', user ? 'Logged in' : 'Not logged in');
    unsubscribe(); // Clean up
  });
  
  console.log('✅ Authentication is properly configured!');
  
} catch (error) {
  console.error('❌ Firebase Auth test failed:', error.message);
  if (error.code === 'auth/internal-error') {
    console.log('💡 This usually means Authentication is not enabled in Firebase Console');
    console.log('💡 Please enable Authentication in your Firebase project first');
  }
}
