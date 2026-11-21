'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuditResult } from '@/types/audit';
import { UrlForm } from '@/components/UrlForm';
import { ScoreDial } from '@/components/ScoreDial';
import { ExecutiveView } from '@/components/ExecutiveView';
import { DeveloperView } from '@/components/DeveloperView';
import { PricingModal } from '@/components/PricingModal';
import {
  Sparkles,
  Zap,
  Activity,
  Briefcase,
  Code2,
  ExternalLink,
  RefreshCw,
  AlertOctagon,
  Gauge,
  Search,
  Shield,
  Layers,
  LayoutDashboard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'executive' | 'developer'>('executive');
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Auto-run if query param ?url= is passed in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryUrl = params.get('url');
      if (queryUrl) {
        runAudit(queryUrl);
      }
    }
  }, []);

  const runAudit = async (targetUrl: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete the audit.');
      }

      setAudit(data);

      // Trigger celebratory confetti for great score
      if (data.overallScore >= 90) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-sm">
              <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                SitePulse
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Dual-Lens
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-slate-300 hover:text-white font-medium px-2 py-1 transition-colors"
            >
              Pricing
            </button>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold flex items-center gap-1.5 transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Get Pro ($39/mo)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-emerald-400 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The only audit tool with zero tech jargon for business owners</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Speed &amp; SEO Audit with{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Dual-Lens Clarity
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Get plain-English business impact for non-technical founders, plus exact technical
            specs and ready-to-paste tickets for developers.
          </p>
        </div>

        {/* Input Form */}
        <UrlForm onAudit={runAudit} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* Audit Results View */}
        {audit && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Audited Domain Banner */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{audit.domain}</span>
                    <a
                      href={audit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Open website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Audited {new Date(audit.timestamp).toLocaleTimeString()} • Fast scan completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => runAudit(audit.url)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Re-audit</span>
                </button>
              </div>
            </div>

            {/* Scorecard Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="border-r border-slate-800/80">
                <ScoreDial
                  score={audit.overallScore}
                  grade={audit.overallGrade}
                  label="Overall Score"
                  size="lg"
                  subtext="Weighted Health"
                />
              </div>
              <div className="border-r border-slate-800/80">
                <ScoreDial
                  score={audit.scores.performance}
                  label="Speed & Server"
                  size="md"
                  subtext={`${audit.timings.ttfbMs}ms TTFB`}
                />
              </div>
              <div className="border-r border-slate-800/80">
                <ScoreDial
                  score={audit.scores.seo}
                  label="On-Page SEO"
                  size="md"
                  subtext="Tags & Indexing"
                />
              </div>
              <div>
                <ScoreDial
                  score={audit.scores.security}
                  label="Security Shield"
                  size="md"
                  subtext={audit.security.isHttps ? 'HTTPS Active' : 'No HTTPS'}
                />
              </div>
            </div>

            {/* Tab Navigation (Dual Lens) */}
            <div className="flex items-center justify-center p-1 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('executive')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'executive'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>👔 Executive View (Business)</span>
              </button>

              <button
                onClick={() => setActiveTab('developer')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'developer'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>💻 Developer Specs</span>
              </button>
            </div>

            {/* Active Lens Content */}
            {activeTab === 'executive' ? (
              <ExecutiveView audit={audit} />
            ) : (
              <DeveloperView audit={audit} />
            )}
            {/* Upgrade Banner for Audit Results */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="space-y-1">
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Never lose rankings to an unexpected slowdown</span>
                </div>
                <p className="text-xs text-slate-400">
                  Track <strong>{audit.domain}</strong> 24/7 with automated weekly alerts &amp; white-label agency reports.
                </p>
              </div>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Track This Site ($19/mo)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectPlan={(plan) => {
          alert(`Selected ${plan.toUpperCase()} plan! Connecting to Stripe Checkout next.`);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 space-y-2 mt-12 bg-slate-950">
        <div>
          SitePulse SaaS •{' '}
          <span className="text-slate-400">Starter: $19/mo (3 Sites)</span> •{' '}
          <span className="text-slate-400">Pro Agency: $39/mo (10 Sites + White Label)</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Continuous site health, speed &amp; SEO monitoring with plain-English clarity.
        </p>
      </footer>
    </div>
  );
}
