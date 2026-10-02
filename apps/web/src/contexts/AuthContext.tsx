import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, StudentProfile } from '../types';
import { authApi } from '../api/auth';

interface AuthState {
  user: User | null;
  profile: StudentProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const { user, profile } = await authApi.me();
      setState({ user, profile, isLoading: false, isAuthenticated: true });
    } catch {
      setState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshUser();
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const tokens = await authApi.login({ email, password });
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    await refreshUser();
  };

  const register = async (email: string, password: string) => {
    await authApi.register({ email, password });
    await login(email, password);
  };

  const logout = () => {
    authApi.logout();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setState({ user: null, profile: null, isLoading: false, isAuthenticated: false });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
