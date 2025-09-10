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
        <meta name="description" content="Tipster Arena - Connect with sports fans, share insights, and stay updated with the latest sports news and discussions." />
      </head>
      <body>{children}</body>
    </html>
  );
}
