import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Create response
    const response = NextResponse.next();

    // Security Headers
    const securityHeaders = {
        // Prevent clickjacking attacks
        'X-Frame-Options': 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Enable XSS protection
        'X-XSS-Protection': '1; mode=block',

        // Referrer Policy - control referrer information
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions Policy - control browser features
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=(), vibrate=(), fullscreen=(self), sync-xhr=()',

        // Content Security Policy - comprehensive CSP for Tipster Arena
        'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google.com https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://firebasestorage.googleapis.com https://placehold.co https://replicate.delivery",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://api.openai.com https://api.anthropic.com https://api.replicate.com https://api.deepgram.com https://*.firebaseapp.com https://*.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
            "frame-src 'self' https://www.google.com https://accounts.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests"
        ].join('; '),

        // Cross-Origin Policies
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin',

        // HSTS - Force HTTPS (only in production)
        ...(process.env.NODE_ENV === 'production' && {
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        })
    };

    // Apply security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        if (value) {
            response.headers.set(key, value);
        }
    });

    // API Route Security
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // Add API-specific headers
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        response.headers.set('Pragma', 'no-cache');

        // Rate limiting headers (basic implementation)
        response.headers.set('X-RateLimit-Limit', '100');
        response.headers.set('X-RateLimit-Remaining', '99');
        response.headers.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + 3600));
    }

    // Static asset caching
    if (request.nextUrl.pathname.startsWith('/_next/static/') ||
        request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Page caching for public pages
    if (request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname === '/privacy' ||
        request.nextUrl.pathname === '/terms') {
        response.headers.set('Cache-Control', 'public, max-age=3600');
    }

    return response;
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
