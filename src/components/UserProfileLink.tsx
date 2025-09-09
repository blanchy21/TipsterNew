'use client';

import React from 'react';
import { User } from '@/lib/types';

interface UserProfileLinkProps {
  user: User;
  onNavigateToProfile: (userId: string) => void;
  className?: string;
  children: React.ReactNode;
}

export default function UserProfileLink({ 
  user, 
  onNavigateToProfile, 
  className = '', 
  children 
}: UserProfileLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNavigateToProfile(user.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`hover:text-blue-400 transition-colors duration-200 ${className}`}
      title={`View ${user.name}'s profile`}
    >
      {children}
    </button>
  );
}
