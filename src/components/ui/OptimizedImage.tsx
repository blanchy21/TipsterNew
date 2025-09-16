import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Simple className utility function
const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    imageClassName?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    sizes?: string;
    fill?: boolean;
    onLoad?: () => void;
    onError?: () => void;
    fallbackSrc?: string;
    lazy?: boolean;
}

/**
 * Enhanced OptimizedImage component with advanced performance optimizations
 * - Automatic lazy loading with intersection observer
 * - WebP/AVIF format support
 * - Blur placeholder for better UX
 * - Error handling with fallback
 * - Responsive image sizing
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className,
    imageClassName,
    priority = false,
    quality = 85,
    placeholder = 'blur',
    blurDataURL,
    sizes,
    fill = false,
    onLoad,
    onError,
    fallbackSrc = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&h=400&fit=crop&crop=face&fm=webp&q=85',
    lazy = true,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority || !lazy);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || !lazy || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before the image comes into view
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, lazy, isInView]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    // Generate blur placeholder if not provided (client-side only)
    const generateBlurDataURL = (w: number, h: number) => {
        if (typeof window === 'undefined') return undefined;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, '#f3f4f6');
            gradient.addColorStop(1, '#e5e7eb');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        }
        return canvas.toDataURL();
    };

    // Check if it's an SVG file
    const isSvg = src.toLowerCase().endsWith('.svg');

    // For SVG files, don't use blur placeholder
    const shouldUseBlur = !isSvg && placeholder === 'blur';
    const defaultBlurDataURL = shouldUseBlur ? (blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined)) : undefined;

    // Don't render until in view (for lazy loading)
    if (!isInView) {
        return (
            <div
                ref={imgRef}
                className={cn(
                    'bg-gray-200 animate-pulse rounded',
                    className
                )}
                style={{ width, height }}
                aria-label={alt}
            />
        );
    }

    return (
        <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
            <Image
                src={hasError ? fallbackSrc : src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                quality={quality}
                placeholder={isSvg ? 'empty' : placeholder}
                blurDataURL={defaultBlurDataURL}
                sizes={sizes}
                className={cn(
                    'transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    imageClassName
                )}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
            />

            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
};

/**
 * Avatar-specific optimized image component
 */
export const OptimizedAvatar: React.FC<Omit<OptimizedImageProps, 'sizes' | 'quality'> & {
    width?: number;
    height?: number;
    quality?: number;
    sizes?: string;
}> = ({
    width = 40,
    height = 40,
    quality = 90,
    sizes = '40px',
    ...props
}) => {
        return (
            <OptimizedImage
                width={width}
                height={height}
                quality={quality}
                sizes={sizes}
                imageClassName="rounded-full object-cover"
                {...props}
            />
        );
    };

/**
 * Cover photo optimized image component
 */
export const OptimizedCoverPhoto: React.FC<Omit<OptimizedImageProps, 'sizes' | 'quality'> & {
    width?: number;
    height?: number;
    quality?: number;
    sizes?: string;
}> = ({
    width = 800,
    height = 400,
    quality = 80,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    ...props
}) => {
        return (
            <OptimizedImage
                width={width}
                height={height}
                quality={quality}
                sizes={sizes}
                imageClassName="object-cover"
                {...props}
            />
        );
    };

/**
 * Gallery image optimized component
 */
export const OptimizedGalleryImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'quality'> & {
    width?: number;
    height?: number;
    quality?: number;
    sizes?: string;
}> = ({
    width = 400,
    height = 400,
    quality = 85,
    sizes = '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
    ...props
}) => {
        return (
            <OptimizedImage
                width={width}
                height={height}
                quality={quality}
                sizes={sizes}
                imageClassName="object-cover rounded-lg"
                {...props}
            />
        );
    };

export default OptimizedImage;
