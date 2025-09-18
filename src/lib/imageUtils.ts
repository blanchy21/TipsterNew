/**
 * Utility functions for handling images in the application
 */

/**
 * Normalizes Unsplash URLs to work better with Next.js Image optimization
 * @param url - The original image URL
 * @returns Normalized URL
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url || url === '') return getDefaultAvatar();

  // If it's an Unsplash URL, normalize it
  if (url.includes('images.unsplash.com')) {
    // Handle specific broken image IDs
    if (url.includes('photo-1494790108755-2616b612b786')) {
      // Replace broken Sarah Johnson image with working one
      return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face';
    }

    // If URL already has proper dimensions, keep them
    if (url.includes('?w=') && url.includes('&h=')) {
      return url;
    }

    // Add proper dimensions for Unsplash URLs
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?w=96&h=96&fit=crop&crop=face`;
  }

  return url;
};

/**
 * Checks if an image URL is likely to be broken
 * @param url - The image URL to check
 * @returns True if the URL is likely broken
 */
export const isLikelyBrokenImage = (url: string): boolean => {
  if (!url) return true;

  // Check for known broken image IDs
  const brokenImageIds = [
    'photo-1494790108755-2616b612b786', // Sarah Johnson's broken image
  ];

  return brokenImageIds.some(id => url.includes(id));
};

/**
 * Gets a default avatar URL
 * @returns Default avatar URL
 */
export const getDefaultAvatar = (): string => {
  return 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=96&h=96&fit=crop&crop=face';
};

/**
 * Gets a default cover photo URL
 * @returns Default cover photo URL
 */
export const getDefaultCoverPhoto = (): string => {
  return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop';
};

/**
 * Gets a default gallery photo URL
 * @returns Default gallery photo URL
 */
export const getDefaultGalleryPhoto = (): string => {
  return 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256';
};
