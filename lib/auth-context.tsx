'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserSession {
  id?: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'pro';
  subscriptionId?: string;
  agencyName?: string;
  agencyTagline?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isRecoveryMode: boolean;
  setIsRecoveryMode: (val: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string }>;
  login: (email: string, name?: string, plan?: 'free' | 'starter' | 'pro') => void;
  logout: () => void;
  upgradePlan: (plan: 'starter' | 'pro', subscriptionId?: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isRecoveryMode: false,
  setIsRecoveryMode: () => {},
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => {},
  resetPassword: async () => ({}),
  updatePassword: async () => ({}),
  login: () => {},
  logout: () => {},
  upgradePlan: () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Fetch full user profile from Supabase profiles table
  const fetchUserProfile = useCallback(async (authUserId: string, authEmail: string, userMetaName?: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('[Supabase Profile] Error fetching profile:', error.message);
      }

      const activePlan = (profile?.plan as 'free' | 'starter' | 'pro') || 'free';
      const sessionUser: UserSession = {
        id: authUserId,
        email: authEmail,
        name: profile?.name || userMetaName || authEmail.split('@')[0],
        plan: activePlan,
        subscriptionId: profile?.paddle_subscription_id || undefined,
        agencyName: profile?.agency_name || 'My Web Studio',
        agencyTagline: profile?.agency_tagline || 'Website Maintenance & SEO Audits',
        joinedAt: profile?.created_at || new Date().toISOString(),
      };

      setUser(sessionUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sitepulse_user_session', JSON.stringify(sessionUser));
      }
    } catch (e) {
      console.error('[Supabase Profile] Exception fetching profile:', e);
    }
  }, []);

  // Initialize Auth state on mount
  useEffect(() => {
    let isMounted = true;

    // Check if user landed from a password recovery link
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setIsRecoveryMode(true);
      }
    }

    const initAuth = async () => {
      try {
        // First check Supabase session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          await fetchUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
        } else if (typeof window !== 'undefined') {
          // Fallback to local storage (for quick demo mode)
          const saved = localStorage.getItem('sitepulse_user_session');
          if (saved && isMounted) {
            setUser(JSON.parse(saved));
          }
        }
      } catch (err) {
        console.error('[Auth Init Error]:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes (login, logout, password recovery)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      } else if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name
        );
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sitepulse_user_session');
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Real Supabase Sign In with email & password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email || email, data.user.user_metadata?.name);
      }

      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to sign in' };
    }
  };

  // Real Supabase Sign Up
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard`
        : 'https://sitepulse-blond.vercel.app/dashboard';

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        // Automatically create initial profile row
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email.trim(),
            name: name || email.split('@')[0],
            plan: 'free',
          });
        } catch {}

        await fetchUserProfile(data.user.id, data.user.email || email, name);
      }

      return {
        message: data.session
          ? 'Account created successfully!'
          : 'Confirmation email sent! Please check your inbox.',
      };
    } catch (err: any) {
      return { error: err?.message || 'Failed to create account' };
    }
  };

  // Real Supabase Password Reset Email
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/dashboard`
        : 'https://sitepulse-blond.vercel.app/dashboard';

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: error.message };
      }

      return { message: 'Password reset link sent! Please check your inbox.' };
    } catch (err: any) {
      return { error: err?.message || 'Failed to request password reset' };
    }
  };

  // Update user's password when coming from recovery link
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return { error: error.message };
      }
      setIsRecoveryMode(false);
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Failed to update password' };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sitepulse_user_session');
    }
  };

  // Demo / Local fast login helper
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
    signOut();
  };

  const refreshProfile = async () => {
    if (user?.id && user.email) {
      await fetchUserProfile(user.id, user.email, user.name);
    }
  };

  const upgradePlan = async (plan: 'starter' | 'pro', subscriptionId?: string) => {
    if (!user) {
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

    // Persist to Supabase if logged into real account
    if (user.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            plan,
            paddle_subscription_id: subscriptionId || user.subscriptionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (e) {
        console.error('[Supabase Upgrade Error]:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isRecoveryMode,
        setIsRecoveryMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        login,
        logout,
        upgradePlan,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
