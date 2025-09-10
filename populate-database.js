const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Test data
const testUsers = [
    {
        displayName: 'Alex Thompson',
        email: 'alex.thompson@example.com',
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
        bio: 'Professional football analyst with 10+ years experience. Specializing in Premier League and Champions League.',
        handle: '@alexthompson',
        specializations: ['Football', 'Premier League', 'Champions League'],
        location: 'London, UK',
        website: 'https://alexthompson.com',
        socialMedia: {
            twitter: 'alexthompson',
            instagram: 'alexthompson_football'
        },
        isVerified: true,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        displayName: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
        bio: 'Basketball expert and former WNBA player. Now providing analysis and insights.',
        handle: '@sarahjohnson',
        specializations: ['Basketball', 'WNBA', 'NBA'],
        location: 'Los Angeles, CA',
        website: 'https://sarahjohnson.com',
        socialMedia: {
            twitter: 'sarahjohnson_bb',
            instagram: 'sarahjohnson_basketball'
        },
        isVerified: true,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        displayName: 'Mike Chen',
        email: 'mike.chen@example.com',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
        bio: 'Tennis coach and analyst. Former college player with deep knowledge of the game.',
        handle: '@mikechen',
        specializations: ['Tennis', 'ATP', 'WTA'],
        location: 'Melbourne, Australia',
        website: 'https://mikechen.com',
        socialMedia: {
            twitter: 'mikechen_tennis',
            instagram: 'mikechen_tennis'
        },
        isVerified: true,
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date().toISOString()
    }
];

const testPosts = [
    {
        title: 'Manchester United vs Liverpool - Premier League',
        content: 'United looking strong at home. Liverpool\'s away form has been inconsistent. Backing United to win this one.',
        sport: 'Football',
        odds: '2/1',
        tipStatus: 'pending',
        userId: '', // Will be filled with actual user ID
        user: {
            id: '', // Will be filled
            name: 'Alex Thompson',
            handle: '@alexthompson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'
        },
        likes: [],
        comments: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        title: 'Lakers vs Warriors - NBA',
        content: 'Lakers at home with LeBron in form. Warriors struggling on the road. Lakers to cover the spread.',
        sport: 'Basketball',
        odds: '5/2',
        tipStatus: 'pending',
        userId: '', // Will be filled with actual user ID
        user: {
            id: '', // Will be filled
            name: 'Sarah Johnson',
            handle: '@sarahjohnson',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face'
        },
        likes: [],
        comments: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
    },
    {
        title: 'Djokovic vs Nadal - French Open',
        content: 'Classic matchup. Nadal\'s clay court record is incredible, but Djokovic is in great form. Going with Nadal.',
        sport: 'Tennis',
        odds: '4/5',
        tipStatus: 'pending',
        userId: '', // Will be filled with actual user ID
        user: {
            id: '', // Will be filled
            name: 'Mike Chen',
            handle: '@mikechen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'
        },
        likes: [],
        comments: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString()
    }
];

async function populateDatabase() {
    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('🚀 Starting to populate database...');

        // Check if user is signed in
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.log('❌ No user signed in. Please sign in to the app first.');
            return;
        }

        console.log('👤 User signed in:', currentUser.email);

        // Add test users
        const userIds = [];
        for (let i = 0; i < testUsers.length; i++) {
            const userData = testUsers[i];
            const docRef = await addDoc(collection(db, 'users'), userData);
            userIds.push(docRef.id);
            console.log(`✅ Added user: ${userData.displayName} with ID: ${docRef.id}`);
        }

        // Add test posts with correct user IDs
        for (let i = 0; i < testPosts.length; i++) {
            const postData = {
                ...testPosts[i],
                userId: userIds[i],
                user: {
                    ...testPosts[i].user,
                    id: userIds[i]
                }
            };
            const docRef = await addDoc(collection(db, 'posts'), postData);
            console.log(`✅ Added post: ${postData.title} with ID: ${docRef.id}`);
        }

        // Create some following relationships
        if (userIds.length >= 3) {
            // User 0 follows users 1, 2
            await addDoc(collection(db, 'following'), {
                followerId: userIds[0],
                followingId: userIds[1],
                createdAt: new Date().toISOString()
            });
            await addDoc(collection(db, 'following'), {
                followerId: userIds[0],
                followingId: userIds[2],
                createdAt: new Date().toISOString()
            });

            // User 1 follows user 0
            await addDoc(collection(db, 'following'), {
                followerId: userIds[1],
                followingId: userIds[0],
                createdAt: new Date().toISOString()
            });

            console.log('✅ Created following relationships');
        }

        console.log('🎉 Database population completed successfully!');
        console.log(`📊 Added ${testUsers.length} users and ${testPosts.length} posts`);

    } catch (error) {
        console.error('❌ Error populating database:', error);
    }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

populateDatabase();
