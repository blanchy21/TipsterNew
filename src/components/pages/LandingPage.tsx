'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface LandingPageProps {
  onGetStarted: () => void;
  onShowAuthModal?: (mode: 'login' | 'signup') => void;
}

export default function LandingPage({ onGetStarted, onShowAuthModal }: LandingPageProps) {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-cycle features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/>
        </svg>
      ),
      title: 'Share Tips',
      description: 'Post predictions for any sport. Build your reputation through transparent results.',
      label: '01',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      title: 'Live Chat',
      description: 'Dedicated rooms for Football, Racing, Golf, Tennis, Basketball. Real-time during games.',
      label: '02',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 5-9"/>
        </svg>
      ),
      title: 'Track Record',
      description: 'Automatic win/loss tracking. Transparent statistics with real performance data.',
      label: '03',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      title: 'Find Winners',
      description: 'Search and follow the best performing tipsters. Filter by sport, win rate, and more.',
      label: '04',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Community',
      description: 'No bookmaker bias. No conflicts of interest. Just sports fans helping sports fans.',
      label: '05',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: 'Free Forever',
      description: 'No hidden fees. No premium tiers. Unlimited tips, notifications, and full statistics.',
      label: '06',
    },
  ];

  const sports = [
    { name: 'Football', icon: '\u26BD', color: '#22c55e', desc: 'Premier League, Champions League & more' },
    { name: 'Horse Racing', icon: '\uD83C\uDFC7', color: '#f59e0b', desc: 'Flat, Jump Racing & Major Festivals' },
    { name: 'Golf', icon: '\u26F3', color: '#10b981', desc: 'Masters, PGA & Ryder Cup' },
    { name: 'Tennis', icon: '\uD83C\uDFBE', color: '#eab308', desc: 'Grand Slams, ATP & WTA Tours' },
    { name: 'Basketball', icon: '\uD83C\uDFC0', color: '#f97316', desc: 'NBA, EuroLeague & College' },
    { name: 'Cricket', icon: '\uD83C\uDFCF', color: '#3b82f6', desc: 'Intl Tests, IPL & T20 World Cup' },
  ];

  const chatRooms = [
    { name: 'General Chat', icon: '\uD83D\uDCAC', members: '2.1k', color: '#6366f1' },
    { name: 'Football', icon: '\u26BD', members: '4.8k', color: '#22c55e' },
    { name: 'Horse Racing', icon: '\uD83C\uDFC7', members: '1.9k', color: '#f59e0b' },
    { name: 'Golf', icon: '\u26F3', members: '890', color: '#10b981' },
    { name: 'Tennis', icon: '\uD83C\uDFBE', members: '1.2k', color: '#a855f7' },
    { name: 'Basketball', icon: '\uD83C\uDFC0', members: '2.4k', color: '#f97316' },
  ];

  const ctaText = user ? 'Continue to App' : 'Get Started Free';

  return (
    <div className="min-h-screen bg-surface-0 text-white overflow-x-hidden grain-overlay font-body">
      {/* ═══════ BACKGROUND ATMOSPHERE ═══════ */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-0 via-surface-1 to-surface-0" />
        {/* Hero radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(232,145,58,0.08)_0%,transparent_70%)]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-3 rounded-2xl nav-glass">
            <div className="flex items-center justify-between px-5 py-3">
              {/* Logo */}
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/tipster-logo2.svg" alt="Tipster Arena" className="h-8 w-auto" />
              </div>

              {/* Desktop links */}
              <div className="hidden md:flex items-center gap-1">
                {['Features', 'Sports', 'Community'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                  >
                    {item}
                  </a>
                ))}
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                >
                  Pricing
                </button>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3">
                {!user && onShowAuthModal && (
                  <button
                    onClick={() => onShowAuthModal('login')}
                    className="hidden sm:inline-flex text-[13px] font-medium text-white/60 hover:text-white transition-colors px-4 py-2"
                  >
                    Sign in
                  </button>
                )}
                <button
                  onClick={onGetStarted}
                  className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold tracking-wide"
                >
                  <span>{ctaText}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>

                {/* Mobile menu */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {mobileMenuOpen ? (
                      <>
                        <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
                      </>
                    ) : (
                      <>
                        <path d="M4 8h16"/><path d="M4 16h16"/>
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/[0.06] px-4 pb-4 pt-2">
                <div className="flex flex-col gap-1">
                  {['Features', 'Sports', 'Community'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                  {!user && onShowAuthModal && (
                    <button
                      onClick={() => { onShowAuthModal('login'); setMobileMenuOpen(false); }}
                      className="px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors text-left"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative pt-20 sm:pt-28 lg:pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status pill */}
            <div
              className={`inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 text-[13px] text-accent-light mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="font-medium">Now with transparent tip tracking</span>
            </div>

            {/* Main headline */}
            <h1
              className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-[1.05] text-balance transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Where sports fans{' '}
              <span className="italic text-accent">prove</span>
              <br className="hidden sm:block" />
              {' '}their expertise
            </h1>

            {/* Subheadline */}
            <p
              className={`mt-6 max-w-xl mx-auto text-base sm:text-lg text-white/45 leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              Share tips, track your win rate, and build a real reputation.
              No bookmaker bias. No hidden fees. Just results.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-3 justify-center mt-10 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <button
                onClick={onGetStarted}
                className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wide"
              >
                <span>{ctaText}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
              <button
                onClick={onGetStarted}
                className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-white/70 hover:text-white"
              >
                Browse Top Tipsters
              </button>
            </div>

            {/* Social proof bar */}
            <div
              className={`mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {[
                { value: '12k+', label: 'Tips shared' },
                { value: '3.2k', label: 'Active tipsters' },
                { value: '67%', label: 'Avg win rate' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="stat-number text-3xl sm:text-4xl">{stat.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-white/30 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-xl mx-auto" />

      {/* ═══════ SOCIAL PROOF MARQUEE ═══════ */}
      <section className="py-16 overflow-hidden">
        <div className="relative">
          <div className="marquee-track">
            {[...Array(2)].map((_, setIdx) => (
              <React.Fragment key={setIdx}>
                {[
                  '"Finally a platform where results actually matter"',
                  '\u26BD Football \u2022 \uD83C\uDFC7 Racing \u2022 \u26F3 Golf \u2022 \uD83C\uDFBE Tennis \u2022 \uD83C\uDFC0 Basketball \u2022 \uD83C\uDFCF Cricket',
                  '"Best tipster community I\'ve found"',
                  'Transparent \u2022 Free forever \u2022 No bookmaker bias',
                  '"Love the live chat during games"',
                  'Win rate tracking \u2022 Real stats \u2022 No hidden fees',
                ].map((text, i) => (
                  <span key={`${setIdx}-${i}`} className="text-white/15 text-lg font-medium whitespace-nowrap">
                    {text}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-xl mx-auto" />

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="max-w-2xl mb-16 sm:mb-20">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">Features</div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Everything you need,{' '}
              <span className="italic text-white/40">nothing you don&apos;t</span>
            </h2>
          </div>

          {/* Feature grid: bento-style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glow-card rounded-2xl p-7 cursor-pointer group ${index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${activeFeature === index ? 'bg-accent/20 text-accent' : 'bg-white/[0.06] text-white/40'}`}>
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-mono text-white/20">{feature.label}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>

                {/* Active indicator bar */}
                <div className={`mt-6 h-[2px] rounded-full transition-all duration-700 ${activeFeature === index ? 'bg-accent/50 w-12' : 'bg-white/[0.06] w-8'}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LIVE CHAT ═══════ */}
      <section id="community" className="py-24 sm:py-32 relative">
        {/* Background texture shift */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-2/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">Live chat</div>
              <h2 className="font-display text-4xl sm:text-5xl tracking-tight mb-6">
                Six rooms,{' '}
                <span className="italic text-white/40">one community</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-10 max-w-lg">
                Dedicated chat rooms for every major sport. Discuss tips, strategies, and live action
                with fellow tipsters. Each room is isolated so you only see what matters to you.
              </p>

              <div className="flex flex-col gap-2">
                {chatRooms.map((room) => (
                  <div
                    key={room.name}
                    className="sport-card flex items-center gap-4 rounded-xl bg-white/[0.02] border border-white/[0.04] px-5 py-3.5 cursor-pointer"
                    style={{ '--sport-color': room.color } as React.CSSProperties}
                  >
                    <span className="text-2xl">{room.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white/80">{room.name}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] text-white/30 font-medium">{room.members} online</span>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/15">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual mockup */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Chat preview card */}
                <div className="rounded-2xl border border-white/[0.06] bg-surface-2/80 backdrop-blur-xl overflow-hidden shadow-2xl">
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                    <span className="text-lg">{'\u26BD'}</span>
                    <div>
                      <div className="text-sm font-semibold">Football</div>
                      <div className="text-[11px] text-white/30">4,831 members</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-white/30">Live</span>
                    </div>
                  </div>
                  {/* Mock messages */}
                  <div className="px-5 py-4 space-y-4">
                    {[
                      { user: 'JW', msg: 'Arsenal to win @ 1.85 looks solid', time: '2m ago', color: '#22c55e' },
                      { user: 'SK', msg: 'Liverpool over 2.5 goals at home, great odds', time: '5m ago', color: '#6366f1' },
                      { user: 'MT', msg: 'Both teams to score in the Chelsea match', time: '8m ago', color: '#f97316' },
                    ].map((m, i) => (
                      <div key={i} className="flex gap-3" style={{ opacity: 1 - i * 0.2 }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: `${m.color}20`, color: m.color }}>
                          {m.user}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white/70">{m.msg}</div>
                          <div className="text-[10px] text-white/20 mt-0.5">{m.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Mock input */}
                  <div className="px-5 pb-4">
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-4 py-3 text-sm text-white/20">
                      Type a message...
                    </div>
                  </div>
                </div>

                {/* Floating accent glow */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/[0.06] rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-xl mx-auto" />

      {/* ═══════ SPORTS ═══════ */}
      <section id="sports" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">Sports covered</div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight">
              Tips for <span className="italic text-white/40">every sport</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className="sport-card rounded-2xl bg-white/[0.02] border border-white/[0.04] px-6 py-5 cursor-pointer"
                style={{ '--sport-color': sport.color } as React.CSSProperties}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{sport.icon}</span>
                  <div>
                    <div className="font-semibold text-white/80">{sport.name}</div>
                    <div className="text-xs text-white/30 mt-0.5">{sport.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FOUNDER QUOTE ═══════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-2/30 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Large quote mark */}
          <div className="font-display text-[120px] sm:text-[160px] leading-none text-accent/[0.08] select-none mb-[-60px] sm:mb-[-80px]">
            &ldquo;
          </div>
          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl italic text-white/70 leading-snug tracking-tight">
            Sports tip sharing should be about community, transparency, and celebrating those who consistently find winners.
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
              <span className="text-white font-bold text-xs">TA</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white/60">Tipster Arena Founders</div>
              <div className="text-xs text-white/25">Built by sports fans, for sports fans</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-xl mx-auto" />

      {/* ═══════ PRICING / FREE SECTION ═══════ */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-4">Pricing</div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight mb-4">
              Free. <span className="italic text-white/40">Forever.</span>
            </h2>
            <p className="text-white/40 text-base max-w-md mx-auto">
              No hidden fees, no premium tiers, no credit card required. Every feature is available to everyone.
            </p>
          </div>

          {/* Pricing card */}
          <div className="glow-card rounded-2xl p-8 sm:p-10 text-center max-w-md mx-auto">
            <div className="stat-number text-6xl sm:text-7xl mb-2">$0</div>
            <div className="text-sm text-white/30 font-medium mb-8">per month, forever</div>

            <ul className="space-y-3 text-left mb-8">
              {[
                'Unlimited tips & predictions',
                'Full performance analytics',
                'All 6 live chat rooms',
                'Follow unlimited tipsters',
                'Real-time notifications',
                'Complete track record history',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={onGetStarted}
              className="btn-primary-glow w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
            >
              <span>{ctaText}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(232,145,58,0.1)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6">
            Ready to prove{' '}
            <span className="italic text-accent">your edge</span>?
          </h2>
          <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto mb-10">
            Join a community of sports fans who track their predictions with real data. Start building your reputation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onGetStarted}
              className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
            >
              <span>{ctaText}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={onGetStarted}
              className="btn-ghost inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-medium text-white/60 hover:text-white"
            >
              Browse Top Tipsters
            </button>
          </div>

          <p className="text-[11px] text-white/20 mt-8 uppercase tracking-[0.15em] font-medium">
            Free forever &middot; No credit card &middot; No bookmaker bias
          </p>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="glass-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">TA</span>
                </div>
                <span className="text-sm font-bold tracking-tight">Tipster Arena</span>
              </div>
              <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">
                The community-driven platform for sports tip sharing and performance tracking.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-white/50 mb-4">Product</h4>
              <ul className="space-y-2.5">
                {['Features', 'Live Chat', 'Sports', 'Top Tipsters'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-white/50 mb-4">Community</h4>
              <ul className="space-y-2.5">
                {['Help Center', 'Blog', 'Contact', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-white/50 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Cookies', href: '/cookies' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-white/30 hover:text-white/60 transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} Tipster Arena. All rights reserved.</p>
            <div className="flex gap-5">
              {/* Twitter / X */}
              <a href="#" className="text-white/20 hover:text-white/40 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Discord */}
              <a href="#" className="text-white/20 hover:text-white/40 transition-colors" aria-label="Discord">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" className="text-white/20 hover:text-white/40 transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
