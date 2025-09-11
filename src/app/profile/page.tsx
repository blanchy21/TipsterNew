'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Profile() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setError('Please sign in to view your profile');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Access Required</h1>
          <p className="text-slate-400 mb-6">{error || 'Please sign in to view your profile'}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {user.displayName || 'User Profile'}
            </h1>
            <p className="text-slate-400">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm">Display Name</label>
                  <p className="text-white">{user.displayName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Email</label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">User ID</label>
                  <p className="text-white font-mono text-sm">{user.uid}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all">
                  Edit Profile
                </button>
                <button className="w-full border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                  View Stats
                </button>
                <button className="w-full border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}