'use client';

import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '@/lib/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { loading } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4" data-testid="auth-modal">
        <div className="bg-[#0A0A14] border border-white/10 rounded-2xl p-8 shadow-2xl">
          {loading && (
            <div className="absolute inset-0 bg-[#0A0A14]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/70">Signing in...</p>
              </div>
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          {mode === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => setMode('signup')}
              onClose={onClose}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setMode('login')}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
