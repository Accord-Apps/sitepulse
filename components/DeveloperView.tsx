'use client';

import React from 'react';
import { AuditResult } from '@/types/audit';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Code,
  FileText,
  Server,
  Shield,
  Image as ImageIcon,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface DeveloperViewProps {
  audit: AuditResult;
}

export const DeveloperView: React.FC<DeveloperViewProps> = ({ audit }) => {
  return (
    <div className="space-y-6">
      {/* 1. Network & Server Payload */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Server Performance & Network Payload</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">HTTP Status</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {audit.performance.responseCode} {audit.performance.responseStatusText}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Response TTFB</span>
            <span
              className={`font-mono font-bold text-sm ${
                audit.timings.ttfbMs < 400
                  ? 'text-emerald-400'
                  : audit.timings.ttfbMs < 800
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {audit.timings.ttfbMs} ms
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">HTML Payload Size</span>
            <span className="font-mono font-bold text-white text-sm">
              {(audit.performance.htmlSizeBytes / 1024).toFixed(1)} KB
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Compression</span>
            <span
              className={`font-mono font-bold text-sm ${
                audit.performance.isCompressed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {audit.performance.compressionType || 'None / Uncompressed'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400 font-medium block mb-1">Cache-Control Header:</span>
            <span className="font-mono text-slate-300 break-all">
              {audit.performance.cacheControl || 'None configured (Browser cannot cache effectively)'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-slate-400 font-medium block mb-1">DOM Script & Style Tags:</span>
            <span className="font-mono text-slate-300">
              {audit.performance.scriptCount} &lt;script&gt; tags |{' '}
              {audit.performance.stylesheetCount} &lt;link rel="stylesheet"&gt; tags
            </span>
          </div>
        </div>
      </div>

      {/* 2. On-Page Technical SEO Elements */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>HTML Meta Tags & Crawl Directives</span>
        </h3>

        <div className="space-y-4">
          {/* Title */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span>&lt;title&gt;</span>
                <span className="text-slate-400 font-mono">({audit.seo.title.length} characters)</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  audit.seo.title.status === 'good'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {audit.seo.title.status}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-200 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/60 font-mono">
              {audit.seo.title.text || '<No title tag found>'}
            </div>
            <div className="text-xs text-slate-400">{audit.seo.title.recommendation}</div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span>&lt;meta name="description"&gt;</span>
                <span className="text-slate-400 font-mono">
                  ({audit.seo.description.length} characters)
                </span>
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  audit.seo.description.status === 'good'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {audit.seo.description.status}
              </span>
            </div>
            <div className="text-sm text-slate-200 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/60">
              {audit.seo.description.text || '<No meta description found>'}
            </div>
            <div className="text-xs text-slate-400">{audit.seo.description.recommendation}</div>
          </div>

          {/* Canonical & Robots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Canonical Tag:</span>
              <span className="font-mono text-slate-200 break-all">
                {audit.seo.canonical.url || 'Not set (May cause duplicate content issues)'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 font-medium block mb-1">Robots Tag & Indexability:</span>
              <span
                className={`font-semibold ${
                  audit.seo.robots.isIndexable ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {audit.seo.robots.isIndexable
                  ? 'Indexable (Google allowed to crawl)'
                  : 'NOINDEX (Blocked from Google index!)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Heading Structure (H1 - H3) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Heading Hierarchy (&lt;H1&gt; - &lt;H3&gt;)</span>
        </h3>

        <div className="flex gap-4 text-xs mb-3">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            H1 Count: <strong className="text-white">{audit.seo.headings.h1Count}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            H2 Count: <strong className="text-white">{audit.seo.headings.h2Count}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            H3 Count: <strong className="text-white">{audit.seo.headings.h3Count}</strong>
          </span>
        </div>

        {audit.seo.headings.h1List.length > 0 ? (
          <div className="space-y-2 mt-2">
            <span className="text-xs text-slate-400">Detected H1 Content:</span>
            {audit.seo.headings.h1List.map((h1, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200 font-mono"
              >
                &lt;h1&gt; {h1} &lt;/h1&gt;
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs">
            No &lt;h1&gt; tags were found in the HTML source.
          </div>
        )}
      </div>

      {/* 4. Image Alt Tag Audit */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Image Audit ({audit.seo.images.total} Total Images)</span>
          </h3>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              audit.seo.images.missingAltCount === 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {audit.seo.images.missingAltCount} Missing Alt Attributes
          </span>
        </div>

        {audit.seo.images.issues.length > 0 ? (
          <div className="space-y-2">
            <span className="text-xs text-slate-400">Sample Images Missing Alt:</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {audit.seo.images.issues.map((img, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex items-center justify-between gap-3"
                >
                  <span className="font-mono text-slate-300 truncate max-w-lg">{img.src}</span>
                  <span className="text-[11px] text-rose-400 font-medium whitespace-nowrap">
                    No Alt
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All detected images contain descriptive alt text.</span>
          </div>
        )}
      </div>

      {/* 5. Security Headers Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Security & HTTP Protection Headers</span>
        </h3>

        <div className="space-y-2.5">
          {audit.security.headers.map((h, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                h.present
                  ? 'bg-slate-950/50 border-emerald-500/20'
                  : 'bg-slate-950/30 border-slate-800/80'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-mono font-semibold text-slate-200">
                  {h.present ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                  <span>{h.name}</span>
                </div>
                <div className="text-slate-400 text-[11px] pl-6">{h.description}</div>
                {h.value && (
                  <div className="text-slate-500 font-mono text-[10px] pl-6 truncate max-w-xl">
                    Value: {h.value}
                  </div>
                )}
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  h.present
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
              >
                {h.present ? 'Active' : 'Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
