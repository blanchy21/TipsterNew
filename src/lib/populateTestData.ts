import {
  addDocument,
  updateDocument,
  getDocuments,
  followUser,
  unfollowUser
} from './firebase/firebaseUtils';
import { normalizeImageUrl } from './imageUtils';

// Test users data
const testUsers = [
  {
    displayName: 'Alex Thompson',
    email: 'alex.thompson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face'),
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
    createdAt: new Date()
  },
  {
    displayName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face'),
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
    createdAt: new Date()
  },
  {
    displayName: 'Mike Rodriguez',
    email: 'mike.rodriguez@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'),
    bio: 'Tennis coach and analyst. Former ATP player with deep insights into the game.',
    handle: '@mikerodriguez',
    specializations: ['Tennis', 'ATP', 'WTA'],
    location: 'Miami, FL',
    website: 'https://mikerodriguez.com',
    socialMedia: {
      twitter: 'mikerodriguez_tennis',
      instagram: 'mikerodriguez_tennis'
    },
    isVerified: false,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=face'),
    bio: 'Cricket analyst and former international player. Expert in all formats of the game.',
    handle: '@emmawilson',
    specializations: ['Cricket', 'Test Cricket', 'T20'],
    location: 'Melbourne, Australia',
    website: 'https://emmawilson.com',
    socialMedia: {
      twitter: 'emmawilson_cricket',
      instagram: 'emmawilson_cricket'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'David Chen',
    email: 'david.chen@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=96&h=96&fit=crop&crop=face'),
    bio: 'Golf instructor and course designer. PGA certified with expertise in course strategy.',
    handle: '@davidchen',
    specializations: ['Golf', 'PGA', 'Course Design'],
    location: 'Augusta, GA',
    website: 'https://davidchen.com',
    socialMedia: {
      twitter: 'davidchen_golf',
      instagram: 'davidchen_golf'
    },
    isVerified: false,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  },
  {
    displayName: 'Lisa Martinez',
    email: 'lisa.martinez@example.com',
    photoURL: normalizeImageUrl('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&fit=crop&crop=face'),
    bio: 'Horse racing expert and handicapper. 15+ years of experience in thoroughbred racing.',
    handle: '@lisamartinez',
    specializations: ['Horse Racing', 'Thoroughbred', 'Handicapping'],
    location: 'Lexington, KY',
    website: 'https://lisamartinez.com',
    socialMedia: {
      twitter: 'lisamartinez_racing',
      instagram: 'lisamartinez_racing'
    },
    isVerified: true,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date()
  }
];

// Test posts data
const testPosts = [
  {
    user: {
      id: 'test-user-1',
      name: 'Alex Thompson',
      handle: '@alexthompson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Football',
    title: 'Arsenal vs Chelsea: Tactical Analysis',
    content: 'This London derby promises to be a tactical masterclass. Arsenal\'s high press against Chelsea\'s counter-attacking style will be fascinating to watch. Key battles: Rice vs Enzo, Saka vs Chilwell.',
    tags: ['arsenal', 'chelsea', 'premier-league', 'tactical-analysis'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '2.5',
    gameDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    isGameFinished: false
  },
  {
    user: {
      id: 'test-user-2',
      name: 'Sarah Johnson',
      handle: '@sarahjohnson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Basketball',
    title: 'Lakers vs Warriors: Key Matchups',
    content: 'The battle of the superstars continues. LeBron vs Curry in what could be their final playoff meeting. The Lakers\' size advantage vs Warriors\' shooting will decide this series.',
    tags: ['lakers', 'warriors', 'nba', 'playoffs'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '1.8',
    gameDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    isGameFinished: false
  },
  {
    user: {
      id: 'test-user-3',
      name: 'Mike Rodriguez',
      handle: '@mikerodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'
    },
    sport: 'Tennis',
    title: 'Djokovic vs Medvedev: French Open Preview',
    content: 'The clay court specialist vs the hard court master. Djokovic\'s experience vs Medvedev\'s power. This could be the match of the tournament.',
    tags: ['djokovic', 'medvedev', 'french-open', 'tennis'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '3.2',
    gameDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days from now
    isGameFinished: false
  },
  {
    user: {
      id: 'test-user-4',
      name: 'Emma Wilson',
      handle: '@emmawilson',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Football',
    title: 'Manchester City vs Liverpool: Premier League Clash',
    content: 'The title race heats up as City host Liverpool. Both teams need the win to stay in contention. Key players: Haaland vs Van Dijk, De Bruyne vs Salah.',
    tags: ['manchester-city', 'liverpool', 'premier-league', 'title-race'],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '2.1',
    gameDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    isGameFinished: false
  },
  {
    user: {
      id: 'test-user-5',
      name: 'David Chen',
      handle: '@davidchen',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Basketball',
    title: 'Celtics vs Heat: Eastern Conference Finals',
    content: 'The battle for the East continues. Celtics\' defense vs Heat\'s offense. This series could go the distance.',
    tags: ['celtics', 'heat', 'nba', 'eastern-conference'],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '1.9',
    gameDate: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    isGameFinished: false
  },
  {
    user: {
      id: 'test-user-6',
      name: 'Lisa Brown',
      handle: '@lisabrown',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face')
    },
    sport: 'Tennis',
    title: 'Swiatek vs Sabalenka: WTA Finals',
    content: 'The world number 1 vs the world number 2. This match will determine the year-end champion.',
    tags: ['swiatek', 'sabalenka', 'wta', 'finals'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 0,
    comments: 0,
    views: 0,
    likedBy: [],
    tipStatus: 'pending',
    odds: '2.3',
    gameDate: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
    isGameFinished: false
  }
];

export const populateTestData = async () => {
  try {

    // Check for existing users first to prevent duplicates
    const existingUsers = await getDocuments('users');
    const existingUserNames = new Set(existingUsers.map((user: any) => user.displayName || user.name));

    // Add test users only if they don't already exist
    const userIds: string[] = [];
    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i];

      // Check if user already exists by displayName
      if (existingUserNames.has(userData.displayName)) {

        // Find the existing user ID to use for posts
        const existingUser = existingUsers.find((user: any) =>
          (user.displayName || user.name) === userData.displayName
        );
        if (existingUser) {
          userIds.push(existingUser.id);
        }
        continue;
      }

      const docRef = await addDocument('users', userData);
      userIds.push(docRef.id);

    }

    // Add test posts
    for (let i = 0; i < testPosts.length; i++) {
      const userIndex = i % userIds.length; // Cycle through available users
      const postData = {
        ...testPosts[i],
        userId: userIds[userIndex], // Add userId field
        user: {
          ...testPosts[i].user,
          id: userIds[userIndex] // Use the actual user ID from Firebase
        }
      };
      const docRef = await addDocument('posts', postData);

    }

    // Create some following relationships
    if (userIds.length >= 3) {
      // User 0 follows users 1, 2, 3
      await followUser(userIds[0], userIds[1]);
      await followUser(userIds[0], userIds[2]);
      await followUser(userIds[0], userIds[3]);

      // User 1 follows users 0, 2
      await followUser(userIds[1], userIds[0]);
      await followUser(userIds[1], userIds[2]);

      // User 2 follows users 0, 1, 4
      await followUser(userIds[2], userIds[0]);
      await followUser(userIds[2], userIds[1]);
      await followUser(userIds[2], userIds[4]);

    }

    return { success: true, userIds };
  } catch (error) {
    // Console statement removed for production
    return { success: false, error };
  }
};

export const clearTestData = async () => {
  try {

    // Get all users and posts
    const users = await getDocuments('users');
    const posts = await getDocuments('posts');

    // Delete all users
    for (const user of users) {
      await updateDocument('users', user.id, { deleted: true });
    }

    // Delete all posts
    for (const post of posts) {
      await updateDocument('posts', post.id, { deleted: true });
    }

    return { success: true };
  } catch (error) {
    // Console statement removed for production
    return { success: false, error };
  }
};

export const removeDuplicateUsers = async () => {
  try {

    // Get all users
    const users = await getDocuments('users');

    // Group users by displayName to find duplicates
    const userGroups = new Map<string, any[]>();

    users.forEach((user: any) => {
      const displayName = user.displayName || user.name || 'Unknown';
      if (!userGroups.has(displayName)) {
        userGroups.set(displayName, []);
      }
      userGroups.get(displayName)!.push(user);
    });

    let removedCount = 0;

    // For each group, keep the oldest user and mark others as deleted
    for (const [displayName, userGroup] of Array.from(userGroups.entries())) {
      if (userGroup.length > 1) {

        // Sort by creation date, keep the oldest
        userGroup.sort((a, b) => {
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return aDate.getTime() - bDate.getTime();
        });

        // Mark all but the first (oldest) as deleted
        for (let i = 1; i < userGroup.length; i++) {
          await updateDocument('users', userGroup[i].id, { deleted: true });
          removedCount++;
          // Marked duplicate user as deleted
        }
      }
    }

    return { success: true, removedCount };
  } catch (error) {
    // Console statement removed for production
    return { success: false, error };
  }
};
