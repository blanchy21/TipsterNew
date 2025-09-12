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
      </head>
      <body>{children}</body>
    </html>
  );
}
