'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { normalizeImageUrl, isLikelyBrokenImage } from '@/lib/imageUtils';

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt,
  name,
  size = 40,
  className = '',
  style = {}
}) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate background color based on name
  const getBackgroundColor = (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    
    // Use name to consistently pick a color
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const normalizedSrc = normalizeImageUrl(src);
  const initials = getInitials(name);
  const bgColor = getBackgroundColor(name);
  const isBrokenImage = isLikelyBrokenImage(src);

  // If image failed to load or is known to be broken, render initials
  if (imageError || isBrokenImage) {
    return (
      <div
        className={`${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(12, size * 0.4),
          ...style
        }}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={style}
      onError={() => setImageError(true)}
    />
  );
};

export default AvatarWithFallback;
