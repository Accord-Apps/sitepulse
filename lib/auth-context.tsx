'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserSession {
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  subscriptionId?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, name?: string, plan?: 'free' | 'starter' | 'pro') => void;
  logout: () => void;
  upgradePlan: (plan: 'starter' | 'pro', subscriptionId?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sitepulse_user_session');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load user session', e);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const login = (email: string, name?: string, plan: 'free' | 'starter' | 'pro' = 'free') => {
    const newUser: UserSession = {
      email,
      name: name || email.split('@')[0],
      plan,
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sitepulse_user_session', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sitepulse_user_session');
    }
  };

  const upgradePlan = (plan: 'starter' | 'pro', subscriptionId?: string) => {
    if (!user) {
      // If user upgraded before logging in, create session from upgrade
      login('customer@example.com', 'Valued Customer', plan);
      return;
    }
    const updatedUser: UserSession = {
      ...user,
      plan,
      subscriptionId: subscriptionId || user.subscriptionId,
    };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sitepulse_user_session', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
