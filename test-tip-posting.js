// Test script to verify tip posting functionality
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } = require('firebase/firestore');

// Firebase configuration (you'll need to add your actual config)
const firebaseConfig = {
    // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testTipPosting() {
    try {
        console.log('Testing tip posting...');

        // Create a test tip
        const testTip = {
            sport: 'Football',
            title: 'Test Tip - Arsenal vs Chelsea',
            content: 'This is a test tip to verify the posting functionality works correctly.',
            tags: ['test', 'football', 'arsenal', 'chelsea'],
            odds: '2/1',
            gameDate: '2024-01-15T15:00:00',
            tipStatus: 'pending',
            isGameFinished: false,
            user: {
                id: 'test-user-123',
                name: 'Test User',
                handle: '@testuser',
                avatar: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
            },
            createdAt: new Date(),
            likes: 0,
            comments: 0,
            views: 0,
            likedBy: []
        };

        // Add the tip to Firestore
        const docRef = await addDoc(collection(db, 'posts'), testTip);
        console.log('✅ Test tip posted successfully with ID:', docRef.id);

        // Fetch all posts to verify it appears
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5));
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt
        }));

        console.log('📋 Recent posts:');
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ${post.title} (${post.sport}) - ${post.createdAt}`);
        });

        // Check if our test tip is in the results
        const testTipFound = posts.find(post => post.title === 'Test Tip - Arsenal vs Chelsea');
        if (testTipFound) {
            console.log('✅ Test tip found in feed!');
        } else {
            console.log('❌ Test tip not found in feed');
        }

    } catch (error) {
        console.error('❌ Error testing tip posting:', error);
    }
}

// Run the test
testTipPosting();
