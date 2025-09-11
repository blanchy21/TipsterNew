'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Post, FollowingUser } from '@/lib/types';
import { sampleFollowing, sampleTrending } from '@/lib/utils';
import { createPost, togglePostLike, incrementPostViews } from '@/lib/firebase/firebaseUtils';
import { collection, query as firestoreQuery, orderBy as firestoreOrderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import PostModal from './PostModal';
import ProfilePage from './ProfilePage';
import MessagesPage from './MessagesPage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import FollowingPage from './FollowingPage';
import TopTipsters from './TopTipsters';
import LandingPage from './LandingPage';
import AuthModal from './AuthModal';
import { NotificationsProvider } from '@/lib/contexts/NotificationsContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ProfileProvider } from '@/lib/contexts/ProfileContext';
import { FollowingProvider } from '@/lib/contexts/FollowingContext';
import { useAuth } from '@/lib/hooks/useAuth';
import NotificationToastManager from './NotificationToastManager';
import RealtimeIndicator from './RealtimeIndicator';

function AppContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  // Following data is now managed by FollowingContext
  const [showPost, setShowPost] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  // Handler functions
  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handlePostUpdated = (postId: string, updatedPost: Post) => {
    setPosts(prev => prev.map(post =>
      post.id === postId ? updatedPost : post
    ));
  };

  useEffect(() => {
    // Check if user has seen landing page
    const hasSeenLandingPage = localStorage.getItem('hasSeenLandingPage');
    if (!hasSeenLandingPage && !user && !loading) {
      setShowLandingPage(true);
    }

    // Load entrance state
    const timer = setTimeout(() => {
      setIsLoaded(true);
      document.body.classList.add('loaded');
    }, 50);
    return () => clearTimeout(timer);
  }, [user, loading]);

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['home', 'messages', 'chat', 'notifications', 'following', 'top-tipsters', 'sports', 'profile'].includes(tab)) {
      setSelected(tab);
    }
  }, [searchParams]);

  // Close auth modal when user is successfully authenticated
  useEffect(() => {
    if (user && showAuthModal) {
      setShowAuthModal(false);
    }
  }, [user, showAuthModal]);

  // Handle URL hash navigation for admin panel
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setSelected('admin');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Real-time posts listener
  useEffect(() => {
    if (!user || !db) {
      console.log('❌ No user authenticated or Firebase not available, not setting up posts listener');
      setPosts([]);
      return;
    }

    console.log('🔄 Setting up real-time posts listener for user:', user.uid);

    const postsRef = collection(db, 'posts');
    const q = firestoreQuery(postsRef, firestoreOrderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        console.log('📡 Real-time posts update received');
        const postsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
          } as Post;
        });

        console.log('📋 Real-time posts updated:', postsData.length, 'posts');
        setPosts(postsData);
      },
      (error) => {
        console.error('❌ Real-time posts listener error:', error);
        // Fallback: Set empty posts array on error
        console.log('🔄 Fallback: Setting empty posts array due to error');
        setPosts([]);
      }
    );

    return () => {
      console.log('🧹 Cleaning up real-time posts listener');
      unsubscribe();
    };
  }, [user]);


  const filteredPosts = useMemo(() => {
    console.log('🔍 Filtering posts:', {
      totalPosts: posts.length,
      selected,
      selectedSport,
      query: query.trim()
    });

    let filtered = posts;

    // Filter by selected tab
    if (selected === 'top') {
      filtered = filtered.filter(post => post.likes >= 20);
      console.log('📊 Filtered by top tab:', filtered.length, 'posts');
    } else if (selected === 'top-articles') {
      // Sort by engagement (likes + comments) in descending order for trending tips
      filtered = filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
      console.log('📊 Sorted by engagement:', filtered.length, 'posts');
    }

    // Filter by selected sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter((post: Post) => post.sport === selectedSport);
      console.log('🏈 Filtered by sport:', selectedSport, filtered.length, 'posts');
    }

    // Filter by search query
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter((post: Post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.content.toLowerCase().includes(searchQuery) ||
        post.sport.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
        post.user.name.toLowerCase().includes(searchQuery) ||
        post.user.handle.toLowerCase().includes(searchQuery)
      );
      console.log('🔍 Filtered by search:', searchQuery, filtered.length, 'posts');
    }

    console.log('✅ Final filtered posts:', filtered.length, 'posts');
    return filtered;
  }, [posts, selected, selectedSport, query]);

  const handleSubmitPost = async (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => {
    if (!user) {
      console.error('❌ No user found when trying to create post');
      return;
    }

    try {
      console.log('📝 Creating new post:', postData);
      console.log('👤 User info:', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email
      });

      const newPostData = {
        ...postData,
        user: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`,
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face'
        }
      };

      console.log('📝 Post data with user info:', newPostData);
      const newPost = await createPost(newPostData);
      console.log('✅ Post created successfully in Firebase:', newPost);

      const formattedPost = { ...newPost, createdAt: newPost.createdAt.toISOString() } as Post;
      console.log('📋 Adding post to local state:', formattedPost);

      setPosts((prev: Post[]) => {
        const updated = [formattedPost, ...prev];
        console.log('📋 Updated local posts array:', updated.length, 'posts');
        console.log('📋 All posts in state:', updated);
        return updated;
      });

      console.log('✅ Post creation process completed successfully');
    } catch (error) {
      console.error('❌ Error creating post:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
    }
  };

  const handleLikeChange = (postId: string, newLikes: number, newLikedBy: string[]) => {
    // Update the posts state with the new like data
    setPosts((prev: Post[]) =>
      prev.map((post: Post) =>
        post.id === postId
          ? { ...post, likes: newLikes, likedBy: newLikedBy }
          : post
      )
    );
  };

  // Following functionality is now handled by FollowingContext

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setSelected('home');
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenLandingPage', 'true');
    setShowLandingPage(false);
    // Show sign up modal if user is not authenticated
    if (!user) {
      setAuthModalMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleShowAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleNavigateToProfile = (userId: string) => {
    if (userId === 'leaderboard') {
      setSelected('top-tipsters');
    } else {
      setViewingUserId(userId);
      setSelected('profile');
    }
  };

  const handleProfileNavigation = (page: string) => {
    if (page !== 'profile') {
      setViewingUserId(null);
    }
    setSelected(page);
  };

  const handleNavigation = (page: string) => {
    if (page === 'admin') {
      router.push('/admin');
    } else {
      setSelected(page);
    }
  };

  const handleShowLandingPage = () => {
    setShowLandingPage(true);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for new users or when explicitly requested
  if (showLandingPage) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} onShowAuthModal={handleShowAuthModal} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          initialMode={authModalMode}
        />
      </>
    );
  }

  // Require authentication for the main app
  if (!user) {
    return (
      <>
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">SA</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to Tipster Arena</h1>
            <p className="text-white/70 mb-8">Please sign in to access the sports discussion platform</p>
            <div className="space-y-4">
              <button
                onClick={() => handleShowAuthModal('login')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => handleShowAuthModal('signup')}
                className="w-full border border-white/20 bg-white/5 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Create Account
              </button>
              <button
                onClick={() => setShowLandingPage(true)}
                className="w-full text-white/60 hover:text-white transition-colors text-sm"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          initialMode={authModalMode}
        />
      </>
    );
  }

  return (
    <NotificationsProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <MobileHeader
          onOpenPost={() => setShowPost(true)}
          onMenu={() => { }}
          isLoaded={isLoaded}
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            selected={selected}
            onSelect={handleNavigation}
            onOpenPost={() => setShowPost(true)}
            isLoaded={isLoaded}
            selectedSport={selectedSport}
            onSportSelect={handleSportSelect}
            onShowLandingPage={handleShowLandingPage}
            onShowAuthModal={handleShowAuthModal}
          />

          {selected === 'profile' ? (
            <div className="flex-1 overflow-y-auto">
              <ProfilePage onNavigate={handleProfileNavigation} userId={viewingUserId || undefined} />
            </div>
          ) : selected === 'messages' ? (
            <div className="flex-1 overflow-y-auto">
              <MessagesPage />
            </div>
          ) : selected === 'chat' ? (
            <div className="flex-1">
              <ChatPage />
            </div>
          ) : selected === 'notifications' ? (
            <div className="flex-1 overflow-y-auto">
              <NotificationsPage />
            </div>
          ) : selected === 'following' ? (
            <div className="flex-1 overflow-y-auto">
              <FollowingPage onNavigateToProfile={handleNavigateToProfile} />
            </div>
          ) : selected === 'top-tipsters' ? (
            <div className="flex-1 overflow-y-auto">
              <TopTipsters onNavigateToProfile={handleNavigateToProfile} />
            </div>
          ) : selected === 'sports' ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <Feed
                posts={filteredPosts}
                isLoaded={isLoaded}
                query={query}
                onQueryChange={setQuery}
                selectedSport={selectedSport}
                selected={selected}
                onLikeChange={handleLikeChange}
                onNavigateToProfile={handleNavigateToProfile}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />
              <RightSidebar posts={posts} isLoaded={isLoaded} onNavigateToProfile={handleNavigateToProfile} />
            </div>
          ) : (
            <>
              <Feed
                posts={filteredPosts}
                isLoaded={isLoaded}
                query={query}
                onQueryChange={setQuery}
                selectedSport={selectedSport}
                selected={selected}
                onLikeChange={handleLikeChange}
                onNavigateToProfile={handleNavigateToProfile}
                onPostDeleted={handlePostDeleted}
                onPostUpdated={handlePostUpdated}
              />

              <RightSidebar
                posts={posts}
                isLoaded={isLoaded}
                onNavigateToProfile={handleNavigateToProfile}
              />
            </>
          )}
        </div>

        <PostModal
          open={showPost}
          onClose={() => setShowPost(false)}
          onSubmit={handleSubmitPost}
          selectedSport={selectedSport}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          initialMode={authModalMode}
        />

        <NotificationToastManager />
        <RealtimeIndicator isConnected={!!user} />
      </div>
    </NotificationsProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <FollowingProvider>
          <AppContent />
        </FollowingProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
