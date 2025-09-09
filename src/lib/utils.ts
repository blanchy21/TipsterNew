import { normalizeImageUrl } from './imageUtils';

// Utility function for time ago
export function timeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
    { label: 's', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) return `${count}${interval.label}`;
  }
  return 'now';
}

// Sample data
export const initialPosts = [
  {
    id: 'p1',
    user: { 
      id: 'user-alex-morgan',
      name: 'Alex Morgan', 
      handle: '@alexm', 
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256&h=256&fit=crop&crop=face' 
    },
    sport: 'Football',
    title: 'Arsenal vs Man United: Key Matchup Analysis',
    content: 'This is going to be an incredible match! Arsenal\'s home form has been exceptional this season, but Man United\'s counter-attacking style could cause problems. The midfield battle between Rice and Casemiro will be crucial.',
    tags: ['arsenal', 'man-united', 'premier-league', 'analysis'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 45,
    comments: 12,
    views: 1234,
    likedBy: ['user-alex-morgan', 'user-jordan-lee']
  },
  {
    id: 'p2',
    user: { 
      id: 'user-jordan-lee',
      name: 'Jordan Lee', 
      handle: '@jordlee', 
      avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=256&h=256&fit=crop&crop=face' 
    },
    sport: 'Basketball',
    title: 'Lakers vs Warriors: LeBron vs Curry Rivalry Continues',
    content: 'The greatest rivalry in modern basketball continues! LeBron and Curry facing off once again. The Warriors\' small ball lineup vs Lakers\' size advantage - this tactical battle will be fascinating to watch.',
    tags: ['lakers', 'warriors', 'nba', 'rivalry'],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 38,
    comments: 8,
    views: 892,
    likedBy: ['user-alex-morgan']
  },
  {
    id: 'p3',
    user: { 
      id: 'user-samir-khan',
      name: 'Samir Khan', 
      handle: '@samk', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=face' 
    },
    sport: 'Tennis',
    title: 'Djokovic vs Medvedev: Experience vs Youth',
    content: 'Djokovic\'s experience in big matches vs Medvedev\'s recent form. The Serbian\'s mental toughness in crucial moments could be the deciding factor, but Medvedev\'s improved serve and court coverage makes this unpredictable.',
    tags: ['djokovic', 'medvedev', 'tennis', 'grand-slam'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes: 52,
    comments: 15,
    views: 2156,
    likedBy: ['user-jordan-lee', 'user-maria-silva']
  },
  {
    id: 'p4',
    user: { 
      id: 'user-maria-silva',
      name: 'Maria Silva', 
      handle: '@marias', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face' 
    },
    sport: 'Football',
    title: 'Champions League Final: Real Madrid vs Manchester City Tactical Preview',
    content: 'The ultimate clash of styles! Real Madrid\'s experience in finals vs City\'s possession-based approach. Ancelotti\'s tactical flexibility will be tested against Guardiola\'s system. Key battles in every area of the pitch.',
    tags: ['real-madrid', 'manchester-city', 'champions-league', 'final'],
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 78,
    comments: 23,
    views: 3456,
    likedBy: ['user-alex-morgan', 'user-samir-khan', 'user-david-kim']
  },
  {
    id: 'p5',
    user: { 
      id: 'user-david-kim',
      name: 'David Kim', 
      handle: '@davidk', 
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face') 
    },
    sport: 'Basketball',
    title: 'NBA Finals: Celtics vs Heat Game 7 Analysis',
    content: 'The most important game of the season! Both teams have shown incredible resilience. The Celtics\' defense vs Heat\'s three-point shooting will decide this series. Expect a physical, high-intensity battle.',
    tags: ['celtics', 'heat', 'nba-finals', 'game-7'],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: 95,
    comments: 31,
    views: 2789,
    likedBy: ['user-alex-morgan', 'user-jordan-lee', 'user-maria-silva']
  }
];

export const sampleFixtures = [
  { id: 'f1', time: '19:45', league: 'EPL', teams: 'Liverpool vs Newcastle', market: 'O/U 2.5', odds: 1.90 },
  { id: 'f2', time: '20:00', league: 'UCL', teams: 'PSG vs Milan', market: 'PSG -0.5', odds: 1.88 },
  { id: 'f3', time: '21:00', league: 'NBA', teams: 'Celtics @ Heat', market: 'Heat +3.5', odds: 1.92 },
  { id: 'f4', time: '21:30', league: 'ATP', teams: 'Sinner vs Zverev', market: 'Over 23.5', odds: 1.85 },
];

export const sampleFollowing = [
  { 
    id: 'u1', 
    name: 'Mia Park', 
    handle: '@miap', 
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=256&h=256&fit=crop&crop=face', 
    winRate: 64, 
    following: true 
  },
  { 
    id: 'u2', 
    name: 'Chris Young', 
    handle: '@cyoung', 
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=256&h=256&fit=crop&crop=face', 
    winRate: 58, 
    following: false 
  },
  { 
    id: 'u3', 
    name: 'Ivy Chen', 
    handle: '@ivy', 
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=256&h=256&fit=crop&crop=face', 
    winRate: 71, 
    following: true 
  },
  { 
    id: 'u4', 
    name: 'Diego Ruiz', 
    handle: '@druiz', 
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=256&h=256&fit=crop&crop=face', 
    winRate: 66, 
    following: false 
  },
];

export const sampleTrending = [
  { id: 'tr1', label: 'Arsenal vs Man United', volume: 1234, delta: '+12%' },
  { id: 'tr2', label: 'Lakers vs Warriors', volume: 980, delta: '+8%' },
  { id: 'tr3', label: 'Djokovic vs Medvedev', volume: 876, delta: '+5%' },
  { id: 'tr4', label: 'Real Madrid vs Barcelona', volume: 654, delta: '+3%' },
  { id: 'tr5', label: 'Celtics vs Heat', volume: 432, delta: '+2%' },
];

export const sampleNotifications = [
  {
    id: 'n1',
    type: 'like' as const,
    title: 'New Like',
    message: 'John Smith liked your tip on Manchester United vs Arsenal',
    user: {
      id: 'u1',
      name: 'John Smith',
      handle: '@johnsmith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face'
    },
    postId: 'p1',
    recipientId: 'current-user',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    actionUrl: '/post/p1'
  },
  {
    id: 'n2',
    type: 'comment' as const,
    title: 'New Comment',
    message: 'Sarah Johnson commented on your Liverpool vs Chelsea prediction',
    user: {
      id: 'u2',
      name: 'Sarah Johnson',
      handle: '@sarahj',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=face'
    },
    postId: 'p2',
    recipientId: 'current-user',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    actionUrl: '/post/p2'
  },
  {
    id: 'n3',
    type: 'follow' as const,
    title: 'New Follower',
    message: 'Mike Wilson started following you',
    user: {
      id: 'u3',
      name: 'Mike Wilson',
      handle: '@mikew',
      avatar: normalizeImageUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=face')
    },
    recipientId: 'current-user',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    actionUrl: '/profile/mikew'
  },
  {
    id: 'n4',
    type: 'tip' as const,
    title: 'New Tip Available',
    message: 'Emma Davis shared a new tip for the NBA Finals game',
    user: {
      id: 'u4',
      name: 'Emma Davis',
      handle: '@emmad',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face'
    },
    postId: 'p3',
    recipientId: 'current-user',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: '/post/p3'
  },
  {
    id: 'n5',
    type: 'match_result' as const,
    title: 'Match Result',
    message: 'Your prediction for Manchester United vs Arsenal was correct!',
    recipientId: 'current-user',
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    actionUrl: '/post/p1'
  },
  {
    id: 'n6',
    type: 'system' as const,
    title: 'Welcome to Tipster Arena!',
    message: 'Thanks for joining our community of sports analysts. Start sharing your insights!',
    recipientId: 'current-user',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  }
];
