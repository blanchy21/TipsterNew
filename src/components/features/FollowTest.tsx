'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FollowButton from './FollowButton';
import { User } from '@/lib/types';

// Test component to demonstrate follow functionality
const FollowTest: React.FC = () => {
  const [testUser] = useState<User>({
    id: 'test-user-123',
    name: 'Test User',
    handle: '@testuser',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face',
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0
  });

  const handleFollowChange = (isFollowing: boolean) => {

  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Follow Functionality Test</h1>
        
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <Image 
              src={testUser.avatar} 
              alt={testUser.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div>
              <h3 className="text-white font-semibold">{testUser.name}</h3>
              <p className="text-slate-400 text-sm">{testUser.handle}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <FollowButton 
              targetUser={testUser} 
              variant="default"
              onFollowChange={handleFollowChange}
            />
            <FollowButton 
              targetUser={testUser} 
              variant="compact"
              onFollowChange={handleFollowChange}
            />
            <FollowButton 
              targetUser={testUser} 
              variant="minimal"
              onFollowChange={handleFollowChange}
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Follow Button Variants</h3>
          <div className="space-y-4">
            <div>
              <p className="text-slate-300 text-sm mb-2">Default variant:</p>
              <FollowButton targetUser={testUser} variant="default" />
            </div>
            <div>
              <p className="text-slate-300 text-sm mb-2">Compact variant:</p>
              <FollowButton targetUser={testUser} variant="compact" />
            </div>
            <div>
              <p className="text-slate-300 text-sm mb-2">Minimal variant:</p>
              <FollowButton targetUser={testUser} variant="minimal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowTest;
