'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/endpoints';
import { useAuthStore } from '@/lib/auth-store';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const store = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      store.initialize();
      setIsInitialized(true);
    }
  }, [isInitialized, store]);

  const login = async (payload: LoginPayload) => {
    try {
      store.setLoading(true);
      store.setError(null);

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, payload);
      const { accessToken, refreshToken, user } = response.data;

      store.setUser(user);
      store.setTokens(accessToken, refreshToken);

      return { success: true, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      store.setError(message);
      return { success: false, error: message };
    } finally {
      store.setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      store.setLoading(true);
      store.setError(null);

      const response = await apiClient.post(API_ENDPOINTS.REGISTER, payload);
      const { accessToken, refreshToken, user } = response.data;

      store.setUser(user);
      store.setTokens(accessToken, refreshToken);

      return { success: true, data: response.data };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      store.setError(message);
      return { success: false, error: message };
    } finally {
      store.setLoading(false);
    }
  };

  const logout = () => {
    store.logout();
  };

  return {
    ...store,
    login,
    register,
    logout,
    isInitialized,
  };
}
