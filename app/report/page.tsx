'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AuditResult } from '@/types/audit';
import {
  Printer,
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Search,
  ShieldCheck,
  Server,
  Layers,
  FileText,
  Loader2,
} from 'lucide-react';

function ReportContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url') || 'https://shopify.com';
  const agencyName = searchParams.get('agency') || 'My Web Agency';
  const agencyTagline = searchParams.get('tagline') || 'Website Maintenance & Performance Audits';

  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/audit?url=${encodeURIComponent(urlParam)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate report.');
        setAudit(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error fetching report.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReport();
  }, [urlParam]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold">Generating Branded Client Report...</h2>
        <p className="text-sm text-slate-400 mt-1">Analyzing {urlParam} for {agencyName}</p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 space-y-4">
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 max-w-md text-center">
          <p className="font-semibold text-sm">{error || 'Could not load report.'}</p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-black py-8 px-4 sm:px-6">
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href="/dashboard"
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Ready to deliver to client
          </span>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Report Container */}
      <div className="max-w-4xl mx-auto bg-slate-900 print:bg-white border border-slate-800 print:border-none rounded-3xl p-8 sm:p-12 shadow-2xl print:shadow-none space-y-8">
        {/* 1. White-Label Agency Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-emerald-400 print:text-emerald-700" />
              <h1 className="text-2xl font-black text-white print:text-black tracking-tight">
                {agencyName}
              </h1>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
              {agencyTagline}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600">
            <div>
              Client Property: <strong className="text-white print:text-black">{audit.domain}</strong>
            </div>
            <div>Generated: {new Date(audit.timestamp).toLocaleDateString()}</div>
          </div>
        </div>

        {/* 2. Executive Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 print:text-slate-600 font-bold block mb-1">
              Overall Health
            </span>
            <div className="text-4xl font-black text-emerald-400 print:text-emerald-700">
              {audit.overallScore}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 print:text-emerald-800 border border-emerald-500/20 mt-1 inline-block">
              Grade {audit.overallGrade}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 print:text-slate-600 font-bold block mb-1">
              Speed &amp; Server
            </span>
            <div className="text-3xl font-black text-white print:text-black">
              {audit.scores.performance}
            </div>
            <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-1">
              {audit.timings.ttfbMs}ms TTFB
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 print:text-slate-600 font-bold block mb-1">
              On-Page SEO
            </span>
            <div className="text-3xl font-black text-white print:text-black">
              {audit.scores.seo}
            </div>
            <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-1">
              Tags &amp; Headings
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 print:text-slate-600 font-bold block mb-1">
              Security
            </span>
            <div className="text-3xl font-black text-white print:text-black">
              {audit.scores.security}
            </div>
            <span className="text-[11px] text-slate-400 print:text-slate-600 block mt-1">
              {audit.security.isHttps ? 'HTTPS Secure' : 'Insecure'}
            </span>
          </div>
        </div>

        {/* 3. Plain English Business Executive Summary */}
        <div className="p-6 rounded-2xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white print:text-black">
              Executive Business Summary
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 print:text-emerald-800 border border-emerald-500/20">
              Risk: {audit.executive.conversionRisk}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            {audit.executive.revenueImpactNote}
          </p>

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">
              Top Actionable Priorities
            </h3>
            <div className="space-y-2">
              {audit.executive.topPriorities.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 print:bg-white border border-slate-800 print:border-slate-300 flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {item.severity === 'critical' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 print:text-rose-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 print:text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white print:text-black">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 leading-relaxed mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Technical Details Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            <span>Technical Audit Breakdown</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="font-bold text-white print:text-black block">SEO Tag Integrity</span>
              <div>
                Title ({audit.seo.title.length} chars):{' '}
                <span className="font-mono text-slate-300 print:text-slate-700">
                  {audit.seo.title.text || 'None'}
                </span>
              </div>
              <div>
                H1 Heading Count:{' '}
                <span className="font-bold text-white print:text-black">
                  {audit.seo.headings.h1Count}
                </span>
              </div>
              <div>
                Missing Image Alt Tags:{' '}
                <span className="font-bold text-white print:text-black">
                  {audit.seo.images.missingAltCount} of {audit.seo.images.total} images
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-2">
              <span className="font-bold text-white print:text-black block">Server &amp; Network</span>
              <div>
                Initial Response Time (TTFB):{' '}
                <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                  {audit.timings.ttfbMs} ms
                </span>
              </div>
              <div>
                HTML Payload Size:{' '}
                <span className="font-mono text-slate-300 print:text-slate-700">
                  {(audit.performance.htmlSizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
              <div>
                Compression:{' '}
                <span className="font-bold text-white print:text-black">
                  {audit.performance.compressionType || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Footer & Sign-off */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 print:text-slate-500 gap-2">
          <div>Prepared exclusively for <strong>{audit.domain}</strong></div>
          <div>Audit conducted by <strong>{agencyName}</strong></div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
