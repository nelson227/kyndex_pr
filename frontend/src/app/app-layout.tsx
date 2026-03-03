'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/');
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Chargement...</h1>
          <p className="text-blue-100 mt-2">Préparation de votre profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
