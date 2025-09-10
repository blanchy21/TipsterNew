const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

// Firebase config (you'll need to add your actual config)
const firebaseConfig = {
    // Add your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugLeaderboard() {
    try {
        console.log('🔍 Debugging leaderboard users...\n');

        // Get all users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`📊 Found ${users.length} users in database:`);
        console.log('=====================================');

        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User ID: ${user.id}`);
            console.log(`   Name: ${user.name || 'MISSING'}`);
            console.log(`   Handle: ${user.handle || 'MISSING'}`);
            console.log(`   Email: ${user.email || 'MISSING'}`);
            console.log(`   Display Name: ${user.displayName || 'MISSING'}`);
            console.log(`   Avatar: ${user.avatar || 'MISSING'}`);
            console.log(`   Is Verified: ${user.isVerified || false}`);
            console.log(`   Specializations: ${JSON.stringify(user.specializations || [])}`);
            console.log(`   Created At: ${user.createdAt || 'MISSING'}`);
        });

        // Check for posts by each user
        console.log('\n\n🔍 Checking posts for each user...');
        console.log('=====================================');

        for (const user of users) {
            const postsQuery = query(collection(db, 'posts'), where('userId', '==', user.id));
            const postsSnapshot = await getDocs(postsQuery);
            const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log(`\n👤 ${user.name || 'Unknown'} (${user.id}):`);
            console.log(`   Posts: ${posts.length}`);

            if (posts.length > 0) {
                posts.forEach((post, index) => {
                    console.log(`   ${index + 1}. "${post.title}" - ${post.sport} - Status: ${post.tipStatus || 'unknown'}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error debugging leaderboard:', error);
    }
}

debugLeaderboard();
