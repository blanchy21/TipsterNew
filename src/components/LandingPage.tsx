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
      icon: '⚽',
      title: 'Live Sports Updates',
      description: 'Real-time scores, fixtures, and breaking news from all major sports leagues worldwide.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: '💬',
      title: 'Sports Discussion',
      description: 'Engage in meaningful conversations about your favorite teams, players, and games without politics or drama.',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: '📊',
      title: 'Sports Analytics',
      description: 'Dive deep into player stats, team performance, and game analysis with comprehensive data and insights.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: '👥',
      title: 'Fan Community',
      description: 'Connect with fellow sports enthusiasts who share your passion. No politics, no drama - just pure sports discussion.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: '🛡️',
      title: 'Safe Space',
      description: 'A politics-free zone where you can escape from the noise and focus on what matters - the games you love.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Optimized for mobile devices with push notifications for live updates and game alerts.',
      color: 'from-gray-500 to-slate-600'
    }
  ];

  const sports = [
    { name: 'Football', icon: '⚽', color: 'text-green-400' },
    { name: 'Basketball', icon: '🏀', color: 'text-orange-400' },
    { name: 'Tennis', icon: '🎾', color: 'text-yellow-400' },
    { name: 'Cricket', icon: '🏏', color: 'text-blue-400' },
    { name: 'Baseball', icon: '⚾', color: 'text-red-400' },
    { name: 'Hockey', icon: '🏒', color: 'text-cyan-400' }
  ];

  const stats = [
    { number: '2.5M+', label: 'Active Users', color: 'text-emerald-400' },
    { number: '50+', label: 'Sports Covered', color: 'text-violet-400' },
    { number: '99.9%', label: 'Uptime', color: 'text-orange-400' },
    { number: '4.8★', label: 'User Rating', color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white overflow-x-hidden">
      <style jsx>{`
        .glass-footer {
          background: rgba(10, 10, 20, 0.7);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 -1px 0 0 rgba(255, 255, 255, 0.05) inset,
            0 -20px 60px -10px rgba(139, 92, 246, 0.1);
        }
      `}</style>
      {/* Background Effects */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A14] via-[#1a0d2e] to-[#0A0A14]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-4 rounded-full border border-white/10 bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center ring-1 ring-white/20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white/90">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  </svg>
                </span>
                <span className="text-[17px] font-medium tracking-tight">Sports Arena</span>
              </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#sports" className="text-white/70 hover:text-white transition-colors">Sports</a>
              <a href="#community" className="text-white/70 hover:text-white transition-colors">Community</a>
              <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a>
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
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium tracking-tight text-white shadow-[0_8px_30px_rgba(139,92,246,0.35)] ring-1 ring-white/10 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 hover:shadow-[0_12px_40px_rgba(139,92,246,0.45)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                  Get started
                </a>
                <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
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
              <span>Now with live sports updates</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>

            <h1 className={`max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Your safe space for 
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">sports discussion</span>
            </h1>
            <p className={`mt-6 max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Connect with fellow sports fans, share insights, and discuss the sports you love. A politics-free zone where sports take center stage.
            </p>

            {/* Stats */}
            <div className={`mt-8 flex flex-col sm:flex-row items-center gap-6 text-sm text-white/60 transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-violet-400">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span>50K+ sports fans worldwide</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-fuchsia-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                  <path d="M2 12h20"></path>
                </svg>
                <span>120+ countries</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-400">
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                </svg>
                <span>4.9/5 rating</span>
              </div>
            </div>

            {/* CTA */}
            <div className={`flex flex-col gap-4 sm:flex-row transition-all duration-1000 delay-800 mt-16 items-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <a
                href="#"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 ring-1 ring-white/10 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(139,92,246,0.8)] transition-all duration-300 relative overflow-hidden text-sm font-medium text-white tracking-tight bg-gradient-to-tr from-violet-600 to-fuchsia-600 border-2 rounded-full pt-3 pr-6 pb-3 pl-6"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
                Start free 14-day trial
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors">
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
              Where Sports Fans <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Connect</span>
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              From living rooms to stadiums, see how sports fans around the world use Sports Arena to discuss, debate, and celebrate the games they love.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_120px_-20px_rgba(139,92,246,0.45)]">
              <Image 
                src="/hero.png" 
                alt="Sports Arena - Your Safe Space for Sports Discussion"
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Optional overlay for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Why We Built <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Sports Arena</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                &ldquo;We were tired of the constant political noise. X became too political and right-wing, 
                Bluesky was very left-wing. We said, &apos;Why the hell do we have to deal with this?&apos; 
                Let&apos;s create a sports-only social media and cut out all the rest.&rdquo;
              </p>
              <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-8 border border-violet-500/20">
                <p className="text-white/80 text-lg italic">
                  &ldquo;Sports should be our escape from the chaos of politics, religion, and social issues. 
                  We wanted to create a place where fans could just talk about the games they love 
                  without being bombarded with divisive content.&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SA</span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold">Sports Arena Founders</div>
                    <div className="text-white/60 text-sm">Built by sports fans, for sports fans</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Coverage Section */}
      <section className="py-20 bg-gradient-to-b from-black/40 to-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
              Every Sport <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Deserves Discussion</span>
            </h2>
            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              From mainstream favorites to niche competitions, we cover the sports that matter to you. 
              Find your community and discuss the games you love.
            </p>
          </div>

          {/* Covered Sports Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">Currently Covered Sports</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Football', 'Basketball', 'Tennis', 'Baseball', 'Hockey', 'Cricket',
                'Golf', 'Boxing', 'MMA', 'Esports', 'Rugby', 'Volleyball',
                'Badminton', 'Table Tennis', 'Snooker', 'Darts', 'Cycling',
                'Formula 1', 'MotoGP', 'American Football', 'NBA', 'MLB', 'NHL'
              ].map((sport, index) => (
                <div
                  key={sport}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <div className="text-white font-medium text-sm">{sport}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-2xl p-8 border border-violet-500/20">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                More Sports <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Coming Soon</span>
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                We&apos;re constantly expanding our coverage. Here are some sports we&apos;re working to add:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Gaelic Games', 'Aussie Rules', 'Lacrosse', 'Water Polo', 'Handball',
                  'Squash', 'Rowing', 'Sailing', 'Surfing', 'Snowboarding',
                  'Skiing', 'Wrestling', 'Judo', 'Taekwondo', 'Karate',
                  'Swimming', 'Track & Field', 'Gymnastics', 'Figure Skating',
                  'Curling', 'Bobsleigh', 'Skeleton', 'Luge'
                ].map((sport) => (
                  <span
                    key={sport}
                    className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm border border-white/20"
                  >
                    {sport}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-white/60 text-sm">
                  Don&apos;t see your sport? <span className="text-violet-400 font-medium">Let us know</span> and we&apos;ll prioritize adding it!
                </p>
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
              Everything You Need for <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Sports Discussion</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features designed specifically for sports fans who want to discuss, debate, and celebrate without the noise of politics or drama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-violet-500/50' : ''
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section id="sports" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Covering <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">50+ Sports</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              From football to tennis, basketball to cricket - we&apos;ve got every sport covered with live updates and expert analysis.
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
            Ready to Join a <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Politics-Free</span> Sports Community?
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of sports fans who have found their safe space to discuss, debate, and celebrate the games they love without the noise of politics, religion, or drama.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 rounded-full font-semibold text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-violet-500/25"
            >
              Start Your Free Trial
            </button>
            <button className="border border-white/20 bg-white/5 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
              View Pricing Plans
            </button>
          </div>

          <p className="text-sm text-white/50 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
                <span className="text-xl font-bold">Sports Arena</span>
              </div>
              <p className="text-white/70 max-w-md mb-6">
                The safe space for sports fans to discuss, debate, and celebrate without politics or drama. Built for fans who just want to talk sports.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
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
            <p className="text-white/60 text-sm">© 2024 Sports Arena. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
