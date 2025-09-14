'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

interface LandingPageProps {
  onGetStarted: () => void;
  onShowAuthModal?: (mode: 'login' | 'signup') => void;
}

export default function LandingPage({ onGetStarted, onShowAuthModal }: LandingPageProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Share Your Tips',
      description: 'Post your sports predictions and tips for any sport. Share your insights with the community and build your reputation.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '💬',
      title: 'Live Sports Chat',
      description: 'Join dedicated chat rooms for each sport - Football, Horse Racing, Golf, Tennis, Basketball & General. Real-time discussions with fellow tipsters during games.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: '📊',
      title: 'Transparent Tracking',
      description: 'Automatic win/loss tracking with transparent statistics. See real performance data including win rates and average odds.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: '🔍',
      title: 'Find Top Tipsters',
      description: 'Search user profiles to find the best performing tipsters. No more scrolling through message boards - find winners easily.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: '👥',
      title: 'Community Driven',
      description: 'Celebrate everyday punters who consistently find winners. No bookmaker bias or conflicts of interest - just pure community tips.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '🛡️',
      title: 'Sports Only',
      description: 'A politics-free zone focused purely on sports. No distractions from politics, religion, or drama - just sports discussion.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: '💰',
      title: '100% Free',
      description: 'Completely free forever with no hidden fees or premium tiers. Unlimited tips, real-time notifications, and full statistics.',
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const sports = [
    { name: 'Football', icon: '⚽', color: 'text-green-400' },
    { name: 'Horse Racing', icon: '🏇', color: 'text-amber-400' },
    { name: 'Golf', icon: '⛳', color: 'text-emerald-400' },
    { name: 'Tennis', icon: '🎾', color: 'text-yellow-400' },
    { name: 'Basketball', icon: '🏀', color: 'text-orange-400' },
    { name: 'Cricket', icon: '🏏', color: 'text-blue-400' }
  ];

  const stats = [
    { number: '10K+', label: 'Active Tipsters', color: 'text-emerald-400' },
    { number: '50+', label: 'Sports Covered', color: 'text-violet-400' },
    { number: '100%', label: 'Free Forever', color: 'text-orange-400' },
    { number: '4.9★', label: 'User Rating', color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <style>{`
        .glass-footer {
          background: rgba(11, 20, 38, 0.7);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 -1px 0 0 rgba(255, 255, 255, 0.05) inset,
            0 -20px 60px -10px rgba(245, 158, 11, 0.1);
        }
      `}</style>
      {/* Background Effects */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 rounded-full border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Image src="/tipster-logo2.svg" alt="Tipster Arena" width={120} height={30} className="h-8 w-auto" />
              </div>

              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
                <a href="#sports" className="text-white/70 hover:text-white transition-colors">Sports</a>
                <a href="#features" className="text-white/70 hover:text-white transition-colors">Community</a>
                <button
                  onClick={() => {
                    // Create a temporary popup element
                    const popup = document.createElement('div');
                    popup.innerHTML = '🎉 FREE FOREVER! 🎉';
                    popup.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-black text-2xl font-bold px-8 py-4 rounded-full shadow-2xl z-50 animate-bounce';
                    popup.style.animation = 'bounce 1s ease-in-out 3';
                    document.body.appendChild(popup);

                    // Remove popup after animation
                    setTimeout(() => {
                      popup.remove();
                    }, 3000);

                    // Also scroll to pricing section
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Pricing
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onShowAuthModal && (
                  <button
                    onClick={() => onShowAuthModal('login')}
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    Sign in
                  </button>
                )}
                <a
                  href="#"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 px-4 py-2 text-sm font-medium tracking-tight text-white shadow-[0_8px_30px_rgba(245,158,11,0.35)] ring-1 ring-white/10 hover:from-amber-500 hover:to-orange-500 transition-all duration-200 hover:shadow-[0_12px_40px_rgba(245,158,11,0.45)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                  Get started
                </a>
                <button data-testid="mobile-menu" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/80">
                    <path d="M4 12h16"></path>
                    <path d="M4 18h16"></path>
                    <path d="M4 6h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col sm:pt-16 lg:pt-20 text-center mr-auto ml-auto pt-12 items-center">
            {/* Badge */}
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Now with transparent tip tracking</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>

            <h1 className={`max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The world's premier platform for
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"> sports tip sharing</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              The ultimate platform for sports tipsters. Share tips, track performance, and connect with fellow sports fans. Built by sports fans for sports fans - completely free, with transparent statistics and no bookmaker bias.
            </p>

            {/* Stats */}
            <div className={`mt-8 flex flex-col sm:flex-row items-center gap-6 text-sm text-white/60 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} data-testid="stats-section">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-violet-400">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span>10K+ active tipsters</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-fuchsia-400">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span>100% free forever</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-400">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"></path>
                  <path d="M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                  <path d="M9 7h6"></path>
                </svg>
                <span>Transparent tracking</span>
              </div>
            </div>

            {/* CTA */}
            <div className={`flex flex-col gap-4 sm:flex-row transition-all duration-1000 delay-800 mt-16 items-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a
                href="#"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 ring-1 ring-white/10 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(245,158,11,0.8)] transition-all duration-300 relative overflow-hidden text-sm font-medium text-white tracking-tight bg-gradient-to-tr from-amber-600 to-orange-600 border-2 rounded-full pt-3 pr-6 pb-3 pl-6"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
                Start sharing tips now
              </a>
              <a href="#demo-video" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Watch product demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Dashboard Preview */}
      <section id="demo-video" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Where Sports Fans <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Share Tips</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              From living rooms to stadiums, see how sports fans around the world use Tipster Arena to share tips, track performance, and build their reputation.
            </p>
          </div>

          {/* Demo Video */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_120px_-20px_rgba(245,158,11,0.45)]">
              <video
                className="w-full h-auto object-cover"
                controls
                poster="/hero-feed.png"
                preload="metadata"
              >
                <source src="/demo.mov" type="video/quicktime" />
                <source src="/demo.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Optional overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Why We Built <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Tipster Arena</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                &ldquo;We were tired of traditional tipster services with hidden fees, bookmaker bias, and marketing hype.
                We wanted a platform where everyday punters could share their tips and track their performance transparently.
                No politics, no drama - just pure sports tip sharing.&rdquo;
              </p>
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
                <p className="text-white/80 text-lg italic">
                  &ldquo;Sports tip sharing should be about community, transparency, and celebrating those who consistently find winners.
                  We built Tipster Arena to give every sports fan a voice and a way to prove their expertise through real results.&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">TA</span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Tipster Arena Founders</div>
                    <div className="text-white/60 text-sm">Built by sports fans, for sports fans</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Tip Sharing</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features designed specifically for sports tip sharing, performance tracking, and community building. Built by sports fans for sports fans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${activeFeature === index ? 'ring-2 ring-amber-500/50' : ''
                  }`}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat Rooms Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Live Sports Chat</span> Rooms
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Join dedicated chat rooms for each sport and discuss tips, strategies, and live action with fellow tipsters.
              Each room is isolated so you only see relevant discussions for your sport.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'General Chat', icon: '💬', description: 'Discuss anything sports-related', users: '127 online', color: 'from-blue-500 to-cyan-600' },
              { name: 'Football', icon: '⚽', description: 'Premier League, Champions League & more', users: '89 online', color: 'from-green-500 to-emerald-600' },
              { name: 'Horse Racing', icon: '🏇', description: 'Flat Racing, Jump Racing & Major Festivals', users: '38 online', color: 'from-amber-500 to-yellow-600' },
              { name: 'Golf', icon: '⛳', description: 'Masters, PGA Championship & Ryder Cup', users: '31 online', color: 'from-emerald-500 to-teal-600' },
              { name: 'Tennis', icon: '🎾', description: 'Grand Slams, ATP & WTA Tours', users: '42 online', color: 'from-purple-500 to-pink-600' },
              { name: 'Basketball', icon: '🏀', description: 'NBA, EuroLeague & College Basketball', users: '64 online', color: 'from-orange-500 to-red-600' }
            ].map((room, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer hover:border-white/20"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${room.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {room.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{room.name}</h3>
                <p className="text-white/70 text-sm mb-3 leading-relaxed">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm font-medium">{room.users}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60 text-lg mb-6">
              Real-time messaging • Channel isolation • Live during games
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-amber-500/25"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Join Live Chat Now
            </button>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tips for <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">50+ Sports</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              From football to tennis, basketball to cricket - share your tips for any sport and help others discover winning strategies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <div
                key={index}
                className="group rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {sport.icon}
                </div>
                <div className={`font-semibold ${sport.color}`}>{sport.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Sharing Tips</span>?
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of sports fans who are sharing tips, tracking performance, and building their reputation in a community focused purely on sports success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-amber-500/25"
            >
              Start Sharing Tips Now
            </button>
            <button className="border border-white/20 bg-white/5 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              Browse Top Tipsters
            </button>
          </div>

          <p className="text-sm text-white/50 mt-6">
            Completely free forever • No hidden fees • No credit card required
          </p>
        </div>
      </section>

      {/* Call to Action Section */}

      {/* Footer */}
      <footer className="glass-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TA</span>
                </div>
                <span className="text-xl font-bold">Tipster Arena</span>
              </div>
              <p className="text-white/70 max-w-md mb-6">
                The world's premier platform for sports tip sharing. Share tips, track performance, and connect with fellow sports fans - completely free and transparent.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>


            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">© 2024 Tipster Arena. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms</a>
              <a href="/cookies" className="text-white/60 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
