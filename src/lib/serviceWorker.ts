// Service Worker utilities for Tipster Arena
import { Workbox } from 'workbox-window';

let wb: Workbox | null = null;

// Initialize service worker
export const initializeServiceWorker = () => {
    // Only register service worker in production
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        wb = new Workbox('/sw.js');

        // Register service worker
        wb.register().then((registration) => {
            console.log('Service Worker registered successfully:', registration);
        }).catch((error) => {
            console.error('Service Worker registration failed:', error);
        });

        // Handle service worker updates
        wb.addEventListener('waiting', () => {
            if (confirm('New version available! Reload to update?')) {
                wb?.messageSkipWaiting();
            }
        });

        // Handle service worker controlling
        wb.addEventListener('controlling', () => {
            window.location.reload();
        });
    }
};

// Cache Firebase data manually
export const cacheFirebaseData = async (key: string, data: any) => {
    if (typeof window !== 'undefined' && 'caches' in window) {
        try {
            const cache = await caches.open('firestore-cache');
            const response = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await cache.put(key, response);
        } catch (error) {
            console.error('Failed to cache Firebase data:', error);
        }
    }
};

// Get cached Firebase data
export const getCachedFirebaseData = async (key: string) => {
    if (typeof window !== 'undefined' && 'caches' in window) {
        try {
            const cache = await caches.open('firestore-cache');
            const response = await cache.match(key);
            if (response) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get cached Firebase data:', error);
        }
    }
    return null;
};

// Cache tipster images
export const cacheTipsterImage = async (imageUrl: string) => {
    if (typeof window !== 'undefined' && 'caches' in window) {
        try {
            const cache = await caches.open('images-cache');
            const response = await fetch(imageUrl);
            if (response.ok) {
                await cache.put(imageUrl, response);
            }
        } catch (error) {
            console.error('Failed to cache tipster image:', error);
        }
    }
};

// Background sync for offline tip posting
export const registerBackgroundSync = () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            // Register background sync for tip posting (if supported)
            if ('sync' in registration) {
                (registration as any).sync.register('tip-post-sync');
            }
        });
    }
};

// Handle offline tip posting
export const handleOfflineTipPost = (tipData: any) => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        // Store tip data for background sync
        localStorage.setItem('pending-tip', JSON.stringify({
            ...tipData,
            timestamp: Date.now()
        }));

        // Register background sync
        registerBackgroundSync();
    }
};

// Get pending tips for sync
export const getPendingTips = () => {
    if (typeof window !== 'undefined') {
        const pendingTip = localStorage.getItem('pending-tip');
        if (pendingTip) {
            return JSON.parse(pendingTip);
        }
    }
    return null;
};

// Clear pending tips after successful sync
export const clearPendingTips = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('pending-tip');
    }
};

// Check if app is online
export const isOnline = () => {
    return typeof window !== 'undefined' ? navigator.onLine : true;
};

// Handle online/offline events
export const setupOfflineHandlers = () => {
    if (typeof window !== 'undefined') {
        window.addEventListener('online', () => {
            console.log('App is back online');
            // Trigger background sync for pending tips
            registerBackgroundSync();
        });

        window.addEventListener('offline', () => {
            console.log('App is offline');
        });
    }
};

const serviceWorkerUtils = {
    initializeServiceWorker,
    cacheFirebaseData,
    getCachedFirebaseData,
    cacheTipsterImage,
    registerBackgroundSync,
    handleOfflineTipPost,
    getPendingTips,
    clearPendingTips,
    isOnline,
    setupOfflineHandlers
};

export default serviceWorkerUtils;
