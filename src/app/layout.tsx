import React from 'react';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Tipster Arena - Your Sports Hub</title>
        <meta name="description" content="Tipster Arena - The ultimate platform for sports tipsters. Share tips, track performance, and connect with fellow sports fans." />

        {/* Critical resource preloading for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />

        {/* Preload critical assets */}
        <link rel="preload" as="image" href="/tipster-logo2.svg" />
        <link rel="preload" as="image" href="/hero-feed.png" />

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
      <body>{children}</body>
    </html>
  );
}
