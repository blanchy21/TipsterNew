import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sports Arena - Your Sports Hub</title>
        <meta name="description" content="Sports Arena - Connect with sports fans, share insights, and stay updated with the latest sports news and discussions." />
      </head>
      <body>{children}</body>
    </html>
  );
}
