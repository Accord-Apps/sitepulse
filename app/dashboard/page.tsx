'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';
import { PricingModal } from '@/components/PricingModal';
import {
  Zap,
  Activity,
  Plus,
  Globe,
  ArrowUpRight,
  RefreshCw,
  Trash2,
  Download,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  PartyPopper,
  Lock,
  User,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonitoredSite {
  id: string;
  domain: string;
  url: string;
  overallScore: number;
  speedScore: number;
  seoScore: number;
  secScore: number;
  lastChecked: string;
  trend: 'up' | 'down' | 'steady';
  status: 'healthy' | 'warning' | 'critical';
}

export default function DashboardPage() {
  const { user, isLoading, login, logout, upgradePlan } = useAuth();

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  // Agency White-Label Branding State with LocalStorage
  const [agencyName, setAgencyName] = useState('My Web Studio');
  const [agencyTagline, setAgencyTagline] = useState('Website Maintenance & SEO Audits');

  // Monitored Sites State
  const [sites, setSites] = useState<MonitoredSite[]>([
    {
      id: '1',
      domain: 'shopify.com',
      url: 'https://shopify.com',
      overallScore: 91,
      speedScore: 88,
      seoScore: 94,
      secScore: 100,
      lastChecked: 'Today at 06:00 AM',
      trend: 'up',
      status: 'healthy',
    },
  ]);

  // Limits based on user plan
  const planLimits = {
    free: 1,
    starter: 3,
    pro: 10,
  };
  const currentLimit = user ? planLimits[user.plan] : 1;
  const isPro = user?.plan === 'pro';
  const isPaid = user?.plan === 'starter' || user?.plan === 'pro';

  // Load saved sites & branding from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSites = localStorage.getItem('sitepulse_monitored_sites');
        if (savedSites) {
          const parsed = JSON.parse(savedSites);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSites(parsed);
          }
        }
        const savedBranding = localStorage.getItem('sitepulse_agency_branding');
        if (savedBranding) {
          const parsedB = JSON.parse(savedBranding);
          if (parsedB.name) setAgencyName(parsedB.name);
          if (parsedB.tagline) setAgencyTagline(parsedB.tagline);
        }

        // Check for payment success redirect params
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');
        const plan = params.get('plan') as 'starter' | 'pro' | null;

        if (paymentStatus === 'success' || paymentStatus === 'demo_success') {
          setShowSuccessBanner(true);
          upgradePlan(plan || 'pro');
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        }
      } catch (e) {
        console.error('Failed to load local storage:', e);
      }
    }
  }, []);

  const saveSitesToStorage = (updatedSites: MonitoredSite[]) => {
    setSites(updatedSites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sitepulse_monitored_sites', JSON.stringify(updatedSites));
    }
  };

  const saveBrandingToStorage = (name: string, tagline: string) => {
    setAgencyName(name);
    setAgencyTagline(tagline);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sitepulse_agency_branding', JSON.stringify({ name, tagline }));
    }
  };

  const handleOpenAddModal = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (sites.length >= currentLimit) {
      setPaywallReason(
        `You have reached the ${user.plan.toUpperCase()} plan limit of ${currentLimit} monitored site${
          currentLimit > 1 ? 's' : ''
        }. Upgrade to track more websites!`
      );
      setIsPricingOpen(true);
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    let cleanUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;

    try {
      const parsed = new URL(cleanUrl);
      const newSite: MonitoredSite = {
        id: Date.now().toString(),
        domain: parsed.hostname,
        url: cleanUrl,
        overallScore: Math.floor(Math.random() * 20) + 75,
        speedScore: Math.floor(Math.random() * 25) + 70,
        seoScore: Math.floor(Math.random() * 20) + 80,
        secScore: 90,
        lastChecked: 'Just now',
        trend: 'steady',
        status: 'healthy',
      };
      const updated = [newSite, ...sites];
      saveSitesToStorage(updated);
      setNewUrl('');
      setIsAddModalOpen(false);
    } catch {
      alert('Please enter a valid URL.');
    }
  };

  const handleDelete = (id: string) => {
    const updated = sites.filter((s) => s.id !== id);
    saveSitesToStorage(updated);
  };

  const handleWhiteLabelClick = () => {
    if (!isPro) {
      setPaywallReason(
        'White-Label Agency Branding is exclusive to Pro Agency subscribers ($39/mo). Put your own agency logo & name on client reports.'
      );
      setIsPricingOpen(true);
      return;
    }
    setIsSettingsOpen(true);
  };

  const handleDownloadReport = (site: MonitoredSite) => {
    if (!isPaid) {
      setPaywallReason(
        'Client-ready PDF reports are available on paid plans ($19 Starter or $39 Pro). Upgrade to download and deliver reports to your clients.'
      );
      setIsPricingOpen(true);
      return;
    }
    window.open(
      `/report?url=${encodeURIComponent(site.url)}&agency=${encodeURIComponent(
        agencyName
      )}&tagline=${encodeURIComponent(agencyTagline)}`,
      '_blank'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400 text-sm">
          <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
          <span>Loading SitePulse Fleet...</span>
        </div>
      </div>
    );
  }

  const avgScore = Math.round(
    sites.reduce((acc, s) => acc + s.overallScore, 0) / (sites.length || 1)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20">
                <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                SitePulse
              </span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold text-slate-300">Monitored Fleet</span>
          </div>

          <div className="flex items-center gap-3">
            {/* White-Label Button with Pro Lock (Only visible when logged in) */}
            {user && (
              <button
                onClick={handleWhiteLabelClick}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isPro
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-amber-950/20 hover:bg-amber-900/30 text-amber-300 border-amber-500/30'
                }`}
              >
                {isPro ? (
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="hidden sm:inline">White-Label Branding</span>
                {!isPro && <span className="text-[10px] uppercase font-bold bg-amber-500/20 px-1 rounded">Pro</span>}
              </button>
            )}

            {/* User Profile / Auth State */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span className="font-semibold text-white max-w-[100px] truncate">{user.name}</span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                      user.plan === 'pro'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : user.plan === 'starter'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {user.plan}
                  </span>
                </div>

                {user.plan === 'free' && (
                  <button
                    onClick={() => {
                      setPaywallReason(null);
                      setIsPricingOpen(true);
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Upgrade</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="text-slate-300 hover:text-white font-medium px-2 py-1 text-xs transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {!user ? (
          /* Unauthenticated Gate: Clean Private Dashboard Screen */
          <div className="max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in duration-300">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <Lock className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Private Fleet Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Sign In to Access Your Fleet
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Continuous Core Web Vitals tracking, automated drift alerts, and client-ready white-label reports require an authenticated account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In or Create Account</span>
                </button>
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                >
                  View Subscription Plans
                </button>
              </div>

              {/* 1-Click Fast Preview Options */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                  Or Test Dashboard Features Instantly
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => {
                      login('free_trial@sitepulse.app', 'Alex (Free Trial)', 'free');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-left transition-all group"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                      <span>⚡ Free Account (1 Site)</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Monitor 1 site. Extra slots &amp; white-label branding are paywalled.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      login('agency_owner@sitepulse.app', 'Summit Web Agency', 'pro');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group"
                  >
                    <div className="font-bold text-emerald-400 flex items-center justify-between">
                      <span>👑 Pro Agency (10 Sites)</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-60 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Unlock custom agency branding &amp; client PDF report exports.
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="text-center">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <span>← Return to Free Instant Audit Tool</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <>

        {/* Free Plan Upgrade Banner */}
        {user && user.plan === 'free' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">You are on the Free Preview Plan (1 Site Limit).</span>
                <p className="text-slate-400">
                  Upgrade to <strong>Pro Agency ($39/mo)</strong> to monitor 10 client sites and unlock custom White-Label PDF reports.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPaywallReason(null);
                setIsPricingOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Upgrade to Pro ($39/mo)
            </button>
          </div>
        )}

        {/* Payment Success Welcome Banner */}
        {showSuccessBanner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Welcome to {user?.plan === 'starter' ? 'Starter Owner' : 'Pro Agency'}! 🎉
                </h4>
                <p className="text-xs text-slate-300">
                  Your subscription is active. You have unlocked {currentLimit} monitored website slots and automated audits.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Website Monitoring Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Automated weekly drift checks and client-ready health reports.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website to Track</span>
          </button>
        </div>

        {/* Fleet KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Active Monitored Properties
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{sites.length}</span>
              <span className="text-xs text-slate-500">/ {currentLimit} allowed</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{user ? `${user.plan.toUpperCase()} tier active` : 'Sign in to sync'}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Average Fleet Score
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-black ${
                  avgScore >= 85 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {avgScore}/100
              </span>
              <span className="text-xs text-slate-500">Fleet Health</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Health score steady</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              White-Label Export
            </span>
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-bold ${isPro ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPro ? 'Unlocked (Pro)' : 'Locked'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              {isPro ? 'Custom logo & agency name active' : 'Requires Pro Agency plan'}
            </div>
          </div>
        </div>

        {/* Sites List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Monitored Domains</span>
            </h2>
            <span className="text-xs text-slate-500">Next automated scan in 18 hours</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sites.map((site) => (
              <div
                key={site.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Domain & Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{site.domain}</span>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        site.status === 'healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : site.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {site.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Last audited: {site.lastChecked}</span>
                  </div>
                </div>

                {/* Scores Row */}
                <div className="flex items-center gap-4 sm:gap-6 text-center">
                  <div className="p-2 sm:px-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Overall
                    </span>
                    <span
                      className={`text-lg font-black ${
                        site.overallScore >= 90
                          ? 'text-emerald-400'
                          : site.overallScore >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {site.overallScore}
                    </span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Speed
                    </span>
                    <span className="text-sm font-bold text-slate-300">{site.speedScore}</span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      SEO
                    </span>
                    <span className="text-sm font-bold text-slate-300">{site.seoScore}</span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Security
                    </span>
                    <span className="text-sm font-bold text-slate-300">{site.secScore}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/?url=${encodeURIComponent(site.url)}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Run Scan</span>
                  </Link>

                  {/* PDF Download Button with Gatekeeper */}
                  <button
                    onClick={() => handleDownloadReport(site)}
                    className={`p-2 rounded-xl text-xs transition-all border flex items-center gap-1 ${
                      isPaid
                        ? 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border-slate-700'
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-amber-400'
                    }`}
                    title={isPaid ? 'Export Branded Client PDF' : 'Unlock PDF Export (Paid Plans)'}
                  >
                    {isPaid ? <Download className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => handleDelete(site.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 hover:text-rose-400 text-slate-500 text-xs transition-all border border-slate-800"
                    title="Delete site"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}
      </main>

      {/* Add Website Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Add Website to Track</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              SitePulse will automatically monitor this domain weekly and email you if speed or
              SEO health degrades. ({sites.length}/{currentLimit} slots used)
            </p>
            <form onSubmit={handleAddSite} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Website URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  Add Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* White-Label Branding Settings Modal (Pro only) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Agency White-Label Branding</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Customize the header on all PDF exports so your clients see your agency name instead
              of SitePulse.
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Agency / Business Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={agencyTagline}
                  onChange={(e) => setAgencyTagline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Preview Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Report Header Preview:
                </span>
                <div className="font-bold text-emerald-400 text-xs">{agencyName}</div>
                <div className="text-[11px] text-slate-400">{agencyTagline}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  saveBrandingToStorage(agencyName, agencyTagline);
                  setIsSettingsOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Save Branding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal with Paywall Reason */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => {
          setIsPricingOpen(false);
          setPaywallReason(null);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Footer with Compliance Links */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 space-y-2 bg-slate-950 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          <a href="mailto:accordapps@hotmail.com" className="hover:text-emerald-400 transition-colors">Support</a>
        </div>
        <div className="text-[11px] text-slate-600">
          SitePulse &copy; {new Date().getFullYear()} Accord Apps • Payments powered by Paddle.com
        </div>
      </footer>
    </div>
  );
}
