'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export type UserMode = 'client' | 'provider';

export function useUserMode() {
  const { user } = useAuth();
  const [mode, setMode] = useState<UserMode>('client');
  const [isLoading, setIsLoading] = useState(true);

  // Charger le mode sauvegardé au démarrage
  useEffect(() => {
    if (!user?.id) return;

    const savedMode = localStorage.getItem(`userMode_${user.id}`);
    if (savedMode === 'client' || savedMode === 'provider') {
      setMode(savedMode);
    } else {
      // Défaut : mode client
      setMode('client');
    }
    setIsLoading(false);
  }, [user?.id]);

  // Changer le mode et le sauvegarder
  const toggleMode = (newMode: UserMode) => {
    if (!user?.id) return;

    setMode(newMode);
    localStorage.setItem(`userMode_${user.id}`, newMode);
  };

  return {
    mode,
    toggleMode,
    isClient: mode === 'client',
    isProvider: mode === 'provider',
    isLoading,
  };
}
