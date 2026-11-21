'use client';

import React, { useState } from 'react';
import { AuditResult } from '@/types/audit';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  TrendingDown,
  Clock,
  Search,
  ShieldCheck,
  Printer,
  Smartphone,
} from 'lucide-react';

interface ExecutiveViewProps {
  audit: AuditResult;
}

export const ExecutiveView: React.FC<ExecutiveViewProps> = ({ audit }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(audit.executive.developerHandoffNote);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const riskColors = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Severe: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/60 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Business Health Summary
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                  riskColors[audit.executive.conversionRisk]
                }`}
              >
                Conversion Risk: {audit.executive.conversionRisk}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {audit.executive.headline}
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              {audit.executive.revenueImpactNote}
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <a
              href={`/report?url=${encodeURIComponent(audit.url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Open full branded printable report"
            >
              <Printer className="w-4 h-4" />
              <span>Client PDF Report</span>
            </a>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Ticket Copied!' : 'Copy Dev Ticket'}</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers Bar for Business Owners */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Server Response</span>
            </div>
            <div className="text-xl font-bold text-white">
              {(audit.timings.ttfbMs / 1000).toFixed(2)}s
            </div>
            <div className="text-[11px] text-slate-500">
              {audit.timings.ttfbMs < 400 ? 'Instant response' : 'Slow response'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Readability</span>
            </div>
            <div className="text-xl font-bold text-white">
              {audit.seo.title.status === 'good' && audit.seo.description.status === 'good'
                ? 'Optimal'
                : 'Needs Fixes'}
            </div>
            <div className="text-[11px] text-slate-500">
              {audit.seo.headings.h1Count === 1 ? '1 Main Headline' : 'Missing/Multiple H1'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mobile Ready</span>
            </div>
            <div className="text-xl font-bold text-white">
              {audit.seo.mobile.hasViewport ? 'Yes' : 'No'}
            </div>
            <div className="text-[11px] text-slate-500">
              {audit.seo.mobile.hasViewport ? 'Responsive viewport configured' : 'Broken on mobile screens'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Trust</span>
            </div>
            <div className="text-xl font-bold text-white">
              {audit.security.isHttps ? 'HTTPS Secure' : 'Insecure (HTTP)'}
            </div>
            <div className="text-[11px] text-slate-500">
              {audit.security.headers.filter((h) => h.present).length} of 5 security shields
            </div>
          </div>
        </div>
      </div>

      {/* Top 3-5 Priorities in Plain English */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Actionable Priorities (Plain English)</span>
          </h3>
          <span className="text-xs text-slate-400">Zero tech jargon required</span>
        </div>

        <div className="space-y-3">
          {audit.executive.topPriorities.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
                item.severity === 'critical'
                  ? 'bg-rose-950/15 border-rose-500/20 text-rose-200'
                  : item.severity === 'warning'
                  ? 'bg-amber-950/15 border-amber-500/20 text-amber-200'
                  : 'bg-emerald-950/15 border-emerald-500/20 text-emerald-200'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {item.severity === 'critical' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : item.severity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm text-white">{item.title}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ready-to-Send Developer Ticket Box */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-white">
              Ready-to-Send Developer Ticket
            </h4>
            <p className="text-xs text-slate-400">
              Copy-paste this directly into an email, Upwork message, or Slack to your developer.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-60 leading-relaxed">
          {audit.executive.developerHandoffNote}
        </pre>
      </div>
    </div>
  );
};
