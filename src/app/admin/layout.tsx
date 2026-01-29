'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';

const ADMIN_EMAILS = ['paulblanche@gmail.com', 'admin@tipsterarena.com'];

function isAdminUser(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-0 to-surface-2 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-0 to-surface-2">
      {children}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </AuthProvider>
  );
}
