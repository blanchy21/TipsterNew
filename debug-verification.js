const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, doc, getDoc } = require('firebase/firestore');

// You'll need to add your actual Firebase config here
const firebaseConfig = {
    // Add your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugVerificationData() {
    try {
        console.log('🔍 Debugging verification data...\n');

        // Find Paul Blanche's user ID
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const paulBlanche = users.find(user =>
            user.displayName?.toLowerCase().includes('paul') ||
            user.name?.toLowerCase().includes('paul') ||
            user.email?.toLowerCase().includes('paul')
        );

        if (!paulBlanche) {
            console.log('❌ Paul Blanche not found in users collection');
            return;
        }

        console.log(`👤 Found Paul Blanche:`, {
            id: paulBlanche.id,
            displayName: paulBlanche.displayName,
            name: paulBlanche.name,
            email: paulBlanche.email
        });

        // Check posts by Paul Blanche
        console.log('\n📝 Checking posts by Paul Blanche...');
        const postsQuery = query(collection(db, 'posts'), where('userId', '==', paulBlanche.id));
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`📊 Found ${posts.length} posts:`);
        posts.forEach((post, index) => {
            console.log(`\n${index + 1}. Post ID: ${post.id}`);
            console.log(`   Title: ${post.title}`);
            console.log(`   Sport: ${post.sport}`);
            console.log(`   Tip Status: ${post.tipStatus || 'NOT SET'}`);
            console.log(`   Verified At: ${post.verifiedAt || 'NOT SET'}`);
            console.log(`   Verified By: ${post.verifiedBy || 'NOT SET'}`);
            console.log(`   Is Game Finished: ${post.isGameFinished || false}`);
            console.log(`   Created At: ${post.createdAt || 'NOT SET'}`);
        });

        // Check tip verifications for Paul Blanche
        console.log('\n✅ Checking tip verifications for Paul Blanche...');
        const verificationsQuery = query(collection(db, 'tipVerifications'), where('tipsterId', '==', paulBlanche.id));
        const verificationsSnapshot = await getDocs(verificationsQuery);
        const verifications = verificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`📊 Found ${verifications.length} verifications:`);
        verifications.forEach((verification, index) => {
            console.log(`\n${index + 1}. Verification ID: ${verification.id}`);
            console.log(`   Post ID: ${verification.postId}`);
            console.log(`   Status: ${verification.status}`);
            console.log(`   Admin ID: ${verification.adminId}`);
            console.log(`   Verified At: ${verification.verifiedAt}`);
            console.log(`   Notes: ${verification.notes || 'NONE'}`);
        });

        // Check if posts have correct tipStatus
        console.log('\n🔍 Checking post tipStatus values...');
        const pendingPosts = posts.filter(p => p.tipStatus === 'pending');
        const winPosts = posts.filter(p => p.tipStatus === 'win');
        const lossPosts = posts.filter(p => p.tipStatus === 'loss');
        const voidPosts = posts.filter(p => p.tipStatus === 'void');
        const placePosts = posts.filter(p => p.tipStatus === 'place');

        console.log(`Post Status Breakdown:`);
        console.log(`- Pending: ${pendingPosts.length}`);
        console.log(`- Win: ${winPosts.length}`);
        console.log(`- Loss: ${lossPosts.length}`);
        console.log(`- Void: ${voidPosts.length}`);
        console.log(`- Place: ${placePosts.length}`);

        // Check verification records
        const winVerifications = verifications.filter(v => v.status === 'win');
        const lossVerifications = verifications.filter(v => v.status === 'loss');
        const voidVerifications = verifications.filter(v => v.status === 'void');
        const placeVerifications = verifications.filter(v => v.status === 'place');

        console.log(`\nVerification Status Breakdown:`);
        console.log(`- Win: ${winVerifications.length}`);
        console.log(`- Loss: ${lossVerifications.length}`);
        console.log(`- Void: ${voidVerifications.length}`);
        console.log(`- Place: ${placeVerifications.length}`);

        // Check for mismatches
        console.log(`\n🔍 MISMATCH ANALYSIS:`);
        console.log('===================');

        if (winPosts.length !== winVerifications.length) {
            console.log(`❌ MISMATCH: ${winPosts.length} win posts but ${winVerifications.length} win verifications`);
        }
        if (lossPosts.length !== lossVerifications.length) {
            console.log(`❌ MISMATCH: ${lossPosts.length} loss posts but ${lossVerifications.length} loss verifications`);
        }

        // Check if any posts are missing tipStatus
        const postsWithoutStatus = posts.filter(p => !p.tipStatus);
        if (postsWithoutStatus.length > 0) {
            console.log(`\n⚠️  WARNING: ${postsWithoutStatus.length} posts have no tipStatus set`);
            postsWithoutStatus.forEach((post, index) => {
                console.log(`   ${index + 1}. Post ID: ${post.id}, Title: ${post.title}`);
            });
        }

        console.log(`\n✅ Database verification complete!`);

    } catch (error) {
        console.error('❌ Error debugging verification data:', error);
    }
}

debugVerificationData();
