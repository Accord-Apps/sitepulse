'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Settings,
  Sparkles,
  TrendingUp,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PricingModal } from '@/components/PricingModal';

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
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [activePlan, setActivePlan] = useState<'starter' | 'pro' | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      const plan = params.get('plan') as 'starter' | 'pro' | null;

      if (paymentStatus === 'success' || paymentStatus === 'demo_success') {
        setShowSuccessBanner(true);
        setActivePlan(plan || 'pro');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  }, []);

  // Agency White-Label Branding State
  const [agencyName, setAgencyName] = useState('My Web Studio');
  const [agencyTagline, setAgencyTagline] = useState('Website Maintenance & SEO Audits');

  // Initial demo sites for the subscriber
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
    {
      id: '2',
      domain: 'client-bakery.com',
      url: 'https://client-bakery.com',
      overallScore: 68,
      speedScore: 54,
      seoScore: 72,
      secScore: 80,
      lastChecked: 'Yesterday at 04:30 PM',
      trend: 'down',
      status: 'critical',
    },
    {
      id: '3',
      domain: 'myportfoliostore.com',
      url: 'https://myportfoliostore.com',
      overallScore: 82,
      speedScore: 78,
      seoScore: 85,
      secScore: 90,
      lastChecked: '2 days ago',
      trend: 'steady',
      status: 'warning',
    },
  ]);

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
      setSites([newSite, ...sites]);
      setNewUrl('');
      setIsAddModalOpen(false);
    } catch {
      alert('Please enter a valid URL.');
    }
  };

  const handleDelete = (id: string) => {
    setSites(sites.filter((s) => s.id !== id));
  };

  const avgScore = Math.round(
    sites.reduce((acc, s) => acc + s.overallScore, 0) / (sites.length || 1)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Bar */}
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
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">White-Label Branding</span>
            </button>

            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro Plan ($39/mo)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Payment Success Welcome Banner */}
        {showSuccessBanner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-950/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Welcome to {activePlan === 'starter' ? 'Starter Owner' : 'Pro Agency'}! 🎉
                </h4>
                <p className="text-xs text-slate-300">
                  Your subscription is active. You have unlocked{' '}
                  {activePlan === 'starter' ? '3' : '10'} monitored website slots and weekly automated
                  audits.
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

        {/* Header with Title and Add Button */}
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
            onClick={() => setIsAddModalOpen(true)}
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
              <span className="text-xs text-slate-500">/ 10 sites allowed</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>All automated crawlers active</span>
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
              <span>+3 pts average gain this month</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              Pending Client Alerts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">1</span>
              <span className="text-xs text-slate-500">site needs attention</span>
            </div>
            <div className="text-[11px] text-amber-400/90 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>client-bakery.com mobile speed dropped</span>
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
                  <a
                    href={`/report?url=${encodeURIComponent(site.url)}&agency=${encodeURIComponent(
                      agencyName
                    )}&tagline=${encodeURIComponent(agencyTagline)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs transition-all border border-slate-700 flex items-center justify-center"
                    title="Export Branded Client PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
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
              SEO health degrades.
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

      {/* White-Label Branding Settings Modal */}
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
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Save Branding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={(plan) => {
          alert(`Selected ${plan.toUpperCase()} Plan! Connecting to Stripe Checkout next.`);
        }}
      />
    </div>
  );
}
