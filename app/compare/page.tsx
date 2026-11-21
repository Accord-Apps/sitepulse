'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuditResult } from '@/types/audit';
import { ScoreDial } from '@/components/ScoreDial';
import {
  Swords,
  Zap,
  Activity,
  ArrowLeft,
  Trophy,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ShieldCheck,
  Share2,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ComparePage() {
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [auditA, setAuditA] = useState<AuditResult | null>(null);
  const [auditB, setAuditB] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAuditA(null);
    setAuditB(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlA }),
        }),
        fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlB }),
        }),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      if (!resA.ok) throw new Error(`Failed to audit ${urlA}: ${dataA.error || 'Check URL'}`);
      if (!resB.ok) throw new Error(`Failed to audit ${urlB}: ${dataB.error || 'Check URL'}`);

      setAuditA(dataA);
      setAuditB(dataB);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Comparison failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const setPreset = (presetA: string, presetB: string) => {
    setUrlA(presetA);
    setUrlB(presetB);
  };

  const getWinner = () => {
    if (!auditA || !auditB) return null;
    if (auditA.overallScore > auditB.overallScore) return { winner: 'A', audit: auditA, margin: auditA.overallScore - auditB.overallScore };
    if (auditB.overallScore > auditA.overallScore) return { winner: 'B', audit: auditB, margin: auditB.overallScore - auditA.overallScore };
    return { winner: 'tie', audit: auditA, margin: 0 };
  };

  const winnerData = getWinner();

  const handleCopyBattleCard = () => {
    if (!auditA || !auditB) return;
    const speedWinner = auditA.timings.ttfbMs < auditB.timings.ttfbMs ? auditA.domain : auditB.domain;
    const speedDiff = Math.abs(auditA.timings.ttfbMs - auditB.timings.ttfbMs);

    const text = `
⚔️ SitePulse Competitor Battle Card: ${auditA.domain} vs ${auditB.domain}
-----------------------------------------------------------
🏆 Overall Winner: ${winnerData?.winner === 'tie' ? 'Tie' : winnerData?.audit.domain} (${winnerData?.audit.overallScore}/100)

⚡ Speed (TTFB):
- ${auditA.domain}: ${auditA.timings.ttfbMs}ms
- ${auditB.domain}: ${auditB.timings.ttfbMs}ms
=> ${speedWinner} is ${speedDiff}ms faster!

🔍 On-Page SEO:
- ${auditA.domain}: Score ${auditA.scores.seo}/100 (Missing alt tags: ${auditA.seo.images.missingAltCount})
- ${auditB.domain}: Score ${auditB.scores.seo}/100 (Missing alt tags: ${auditB.seo.images.missingAltCount})

🛡️ Security:
- ${auditA.domain}: ${auditA.scores.security}/100
- ${auditB.domain}: ${auditB.scores.security}/100

Generated with SitePulse: https://sitepulse-blond.vercel.app/compare
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
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
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Competitor Battle</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="text-slate-400 hover:text-white px-2 py-1 transition-colors"
            >
              Single Audit
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2 pt-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Swords className="w-3.5 h-3.5" />
            <span>Head-to-Head Benchmark</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Competitor Speed &amp; SEO Battle
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare your website side-by-side with your rival. See who is faster, who ranks
            better, and where you have the upper hand.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <form onSubmit={handleCompare} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Your Website (or Site A)</span>
                </label>
                <input
                  type="text"
                  value={urlA}
                  onChange={(e) => setUrlA(e.target.value)}
                  placeholder="https://mysite.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>Competitor (or Site B)</span>
                </label>
                <input
                  type="text"
                  value={urlB}
                  onChange={(e) => setUrlB(e.target.value)}
                  placeholder="https://competitor.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !urlA.trim() || !urlB.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Both Sites in Parallel...</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>Fight! Compare Both Sites</span>
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap pt-2">
            <span>Try sample battle:</span>
            <button
              type="button"
              onClick={() => setPreset('https://stripe.com', 'https://paypal.com')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              Stripe vs PayPal
            </button>
            <button
              type="button"
              onClick={() => setPreset('https://nike.com', 'https://adidas.com')}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              Nike vs Adidas
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Comparison Results */}
        {auditA && auditB && (
          <div className="space-y-6 pt-2 animate-in fade-in duration-300">
            {/* Winner Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                    Battle Verdict
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {winnerData?.winner === 'tie'
                      ? 'It is a dead tie!'
                      : `🏆 ${winnerData?.audit.domain} takes the crown (+${winnerData?.margin} pts)`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {auditA.timings.ttfbMs < auditB.timings.ttfbMs
                      ? `${auditA.domain} responds ${auditB.timings.ttfbMs - auditA.timings.ttfbMs}ms faster than ${auditB.domain}.`
                      : `${auditB.domain} responds ${auditA.timings.ttfbMs - auditB.timings.ttfbMs}ms faster than ${auditA.domain}.`}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyBattleCard}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 whitespace-nowrap self-start sm:self-auto"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Card Copied!' : 'Copy Battle Card'}</span>
              </button>
            </div>

            {/* Side-by-Side Overall Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site A Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Site A</span>
                    <h4 className="text-lg font-bold text-white truncate max-w-xs">{auditA.domain}</h4>
                  </div>
                  <ScoreDial
                    score={auditA.overallScore}
                    grade={auditA.overallGrade}
                    label="Overall"
                    size="md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Speed</span>
                    <span className="text-sm font-bold text-white">{auditA.scores.performance}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">SEO</span>
                    <span className="text-sm font-bold text-white">{auditA.scores.seo}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Security</span>
                    <span className="text-sm font-bold text-white">{auditA.scores.security}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Response (TTFB):</span>
                    <span className="font-mono font-bold text-white">{auditA.timings.ttfbMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Missing Alt Tags:</span>
                    <span className="font-bold text-white">{auditA.seo.images.missingAltCount} tags</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">H1 Headings:</span>
                    <span className="font-bold text-white">{auditA.seo.headings.h1Count}</span>
                  </div>
                </div>
              </div>

              {/* Site B Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400">Site B</span>
                    <h4 className="text-lg font-bold text-white truncate max-w-xs">{auditB.domain}</h4>
                  </div>
                  <ScoreDial
                    score={auditB.overallScore}
                    grade={auditB.overallGrade}
                    label="Overall"
                    size="md"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Speed</span>
                    <span className="text-sm font-bold text-white">{auditB.scores.performance}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">SEO</span>
                    <span className="text-sm font-bold text-white">{auditB.scores.seo}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Security</span>
                    <span className="text-sm font-bold text-white">{auditB.scores.security}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Response (TTFB):</span>
                    <span className="font-mono font-bold text-white">{auditB.timings.ttfbMs} ms</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">Missing Alt Tags:</span>
                    <span className="font-bold text-white">{auditB.seo.images.missingAltCount} tags</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                    <span className="text-slate-400">H1 Headings:</span>
                    <span className="font-bold text-white">{auditB.seo.headings.h1Count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500 space-y-3 bg-slate-950">
        <div className="flex flex-wrap items-center justify-center gap-5 text-slate-400">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          <a href="mailto:accordapps@hotmail.com" className="hover:text-emerald-400 transition-colors">Support</a>
        </div>
        <div className="text-[11px] text-slate-600">
          SitePulse Competitor Battle • Powered by Paddle.com • &copy; {new Date().getFullYear()} Accord Apps
        </div>
      </footer>
    </div>
  );
}
