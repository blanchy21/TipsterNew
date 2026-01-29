'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { normalizeImageUrl, isLikelyBrokenImage } from '@/lib/imageUtils';

interface AvatarWithFallbackProps {
  src: string;
  alt: string;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
}

const AvatarWithFallback: React.FC<AvatarWithFallbackProps> = ({
  src,
  alt,
  name,
  size = 40,
  className = '',
  style = {},
  lazy = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px', threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-primary',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];

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

  if (imageError || isBrokenImage || !isInView) {
    return (
      <div
        ref={containerRef}
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
