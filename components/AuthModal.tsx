'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Activity, Mail, Lock, User, ArrowRight, Sparkles, Loader2, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup' | 'update_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signup',
}) => {
  const { signIn, signUp, resetPassword, updatePassword, login } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'update_password'>(defaultMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'update_password') {
        if (!password.trim()) return;
        const res = await updatePassword(password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Password successfully updated! You are now logged in.');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else if (mode === 'forgot') {
        if (!email.trim()) return;
        const res = await resetPassword(email.trim());
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage(res.message || 'Password reset link sent to your email.');
        }
      } else if (mode === 'signup') {
        if (!email.trim()) return;
        const res = await signUp(email.trim(), password, name.trim());
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage(res.message || 'Account created successfully!');
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        // Sign In
        if (!email.trim()) return;
        const res = await signIn(email.trim(), password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (plan: 'free' | 'pro' = 'free') => {
    login(
      plan === 'pro' ? 'pro_agency@sitepulse.app' : 'founder@mybusiness.com',
      plan === 'pro' ? 'Apex Studio (Pro)' : 'John (Free Trial)',
      plan
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-emerald-500/20">
            {mode === 'update_password' ? (
              <KeyRound className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Activity className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <h3 className="text-xl font-black text-white">
            {mode === 'update_password'
              ? 'Choose a New Password'
              : mode === 'signup'
              ? 'Create Your SitePulse Account'
              : mode === 'forgot'
              ? 'Reset Your Password'
              : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'update_password'
              ? 'Enter your new password below to regain full access to your account.'
              : mode === 'signup'
              ? 'Start with a free account to track your websites & view reports.'
              : mode === 'forgot'
              ? 'Enter your account email to receive a password recovery link.'
              : 'Log in to access your monitored fleet.'}
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {mode !== 'update_password' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  {mode === 'update_password' ? 'New Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'update_password'
                    ? 'Save New Password'
                    : mode === 'signup'
                    ? 'Create Free Account'
                    : mode === 'forgot'
                    ? 'Send Reset Link'
                    : 'Sign In to Dashboard'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        {mode !== 'update_password' && (
          <div className="text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : mode === 'signin' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Register Free
                </button>
              </p>
            ) : (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        )}

        {/* 1-Click Fast Preview */}
        {mode !== 'update_password' && (
          <div className="pt-2 border-t border-slate-800/40">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block text-center mb-2">
              Instant Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('free')}
                className="py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-medium transition-all"
              >
                Demo as Free User
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('pro')}
                className="py-1.5 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 font-medium transition-all"
              >
                Demo as Pro Agency
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
