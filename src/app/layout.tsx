import React from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <title>Tipster Arena - Free Sports Tips with Verified Track Records</title>
        <meta
          name="description"
          content="Free sports tipping platform with verified track records. Share betting tips, track your win rate automatically, and follow proven tipsters. No fees, no fake records."
        />
        <meta
          name="keywords"
          content="sports tips, betting tips, tipster, free tipster, verified track record, sports betting community, horse racing tips, football tips, betting picks"
        />
        <link rel="canonical" href="https://tipster-arena.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tipster-arena.com" />
        <meta
          property="og:title"
          content="Tipster Arena - Free Sports Tips with Verified Track Records"
        />
        <meta
          property="og:description"
          content="The only sports tipping platform where every record is transparent. Share tips, track performance, follow winning tipsters - 100% free."
        />
        <meta property="og:image" content="https://tipster-arena.com/og-image.png" />
        <meta property="og:site_name" content="Tipster Arena" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tipsterarena1" />
        <meta name="twitter:creator" content="@tipsterarena1" />
        <meta
          name="twitter:title"
          content="Tipster Arena - Free Sports Tips with Verified Track Records"
        />
        <meta
          name="twitter:description"
          content="Share tips, track performance, follow winning tipsters - 100% free with transparent records."
        />
        <meta name="twitter:image" content="https://tipster-arena.com/og-image.png" />

        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Tipster Arena',
              description:
                'Free sports tip sharing platform with transparent, verified track records. Share betting tips, track your win rate automatically, and follow proven tipsters.',
              url: 'https://tipster-arena.com',
              applicationCategory: 'SportsApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Free sports tip sharing',
                'Verified track records',
                'Real-time performance tracking',
                'Community chat',
                'Tipster leaderboards',
              ],
            }),
          }}
        />

        {/* Critical resource preloading for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />

        {/* Preload critical assets - only preload what's immediately visible */}
        <link rel="preload" as="image" href="/tipster-logo2.svg" />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />

        {/* Performance hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark" />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/profile" />
        <link rel="prefetch" href="/chat" />
        <link rel="prefetch" href="/following" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
