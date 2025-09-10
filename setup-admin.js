const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function setupAdmin() {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('🔍 Setting up admin user...');

        // First, let's check what user is currently signed in
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log('👤 Current user:', {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName
            });

            // Create/update user profile with admin flag
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, {
                id: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || 'Admin User',
                name: currentUser.displayName || 'Admin User',
                handle: '@admin',
                avatar: currentUser.photoURL || '',
                isAdmin: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Admin user profile created/updated');
            console.log('📧 User email:', currentUser.email);
            console.log('🔑 Admin status: true');

            // Note: Custom claims need to be set on the server side
            console.log('\n⚠️  Note: Custom claims need to be set on the server side.');
            console.log('For now, the admin detection will work based on email address.');
            console.log('Your email should be in the admin list in firestore.rules');

        } else {
            console.log('❌ No user currently signed in');
            console.log('Please sign in to the app first, then run this script');
        }

    } catch (error) {
        console.error('❌ Error setting up admin:', error);
    }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

setupAdmin();
