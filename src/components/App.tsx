'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Post, FollowingUser } from '@/lib/types';
import { sampleFollowing, sampleTrending } from '@/lib/utils';
import { getPosts, createPost, togglePostLike, incrementPostViews } from '@/lib/firebase/firebaseUtils';
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
import AdminPage from './AdminPage';
import LandingPage from './LandingPage';
import AuthModal from './AuthModal';
import { NotificationsProvider } from '@/lib/contexts/NotificationsContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ProfileProvider } from '@/lib/contexts/ProfileContext';
import { FollowingProvider } from '@/lib/contexts/FollowingContext';
import { useAuth } from '@/lib/hooks/useAuth';
import NotificationToastManager from './NotificationToastManager';

function AppContent() {
  const { user, loading } = useAuth();
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

  // Load posts from Firestore
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const firestorePosts = await getPosts();
        setPosts(firestorePosts as Post[]);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    if (user) {
      loadPosts();
    }
  }, [user]);


  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by selected tab
    if (selected === 'top') {
      filtered = filtered.filter(post => post.likes >= 20);
    } else if (selected === 'top-articles') {
      // Sort by views in descending order for top articles
      filtered = filtered.sort((a, b) => b.views - a.views);
    }
    
    // Filter by selected sport
    if (selectedSport !== 'All Sports') {
      filtered = filtered.filter((post: Post) => post.sport === selectedSport);
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
    }
    
    return filtered;
  }, [posts, selected, selectedSport, query]);

  const handleSubmitPost = async (postData: Omit<Post, 'id' | 'user' | 'createdAt' | 'likes' | 'comments' | 'views' | 'likedBy'>) => {
    if (!user) return;

    try {
      const newPostData = {
        ...postData,
        user: { 
          id: user.uid,
          name: user.displayName || 'Anonymous', 
          handle: `@${user.displayName?.toLowerCase().replace(/\s+/g, '') || 'user'}`, 
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face' 
        }
      };

      const newPost = await createPost(newPostData);
      setPosts((prev: Post[]) => [{ ...newPost, createdAt: newPost.createdAt.toISOString() } as Post, ...prev]);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikeChange = async (postId: string, newLikes: number, newLikedBy: string[]) => {
    if (!user) return;

    try {
      const isLiked = newLikedBy.includes(user.uid);
      await togglePostLike(postId, user.uid, isLiked);
      
      setPosts((prev: Post[]) => 
        prev.map((post: Post) => 
          post.id === postId 
            ? { ...post, likes: newLikes, likedBy: newLikedBy }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Following functionality is now handled by FollowingContext

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
    setSelected('top');
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
    setViewingUserId(userId);
    setSelected('profile');
  };

  const handleProfileNavigation = (page: string) => {
    if (page !== 'profile') {
      setViewingUserId(null);
    }
    setSelected(page);
  };

  const handleShowLandingPage = () => {
    setShowLandingPage(true);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A14]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <div className="h-screen flex items-center justify-center bg-[#0A0A14]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">SA</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to Sports Arena</h1>
            <p className="text-white/70 mb-8">Please sign in to access the sports discussion platform</p>
            <div className="space-y-4">
              <button
                onClick={() => handleShowAuthModal('login')}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200"
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
      <div className="h-screen flex flex-col overflow-hidden">
        <MobileHeader 
          onOpenPost={() => setShowPost(true)} 
          onMenu={() => {}} 
          isLoaded={isLoaded} 
        />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            selected={selected}
            onSelect={setSelected}
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
            <div className="flex-1">
              <MessagesPage />
            </div>
          ) : selected === 'chat' ? (
            <div className="flex-1">
              <ChatPage />
            </div>
          ) : selected === 'notifications' ? (
            <div className="flex-1">
              <NotificationsPage />
            </div>
          ) : selected === 'following' ? (
            <div className="flex-1">
              <FollowingPage onNavigateToProfile={handleNavigateToProfile} />
            </div>
          ) : selected === 'admin' ? (
            <div className="flex-1">
              <AdminPage />
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
