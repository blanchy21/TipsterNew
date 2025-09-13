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

        {/* Preload critical fonts - removed non-existent font */}

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://lh3.googleusercontent.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
