import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - SitePulse',
  description: 'Privacy Policy and data practices for SitePulse.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20">
              <Activity className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              SitePulse
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full space-y-8 text-slate-300 text-sm leading-relaxed">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: November 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            We collect minimal information necessary to deliver our services:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li><strong>Submitted Website URLs:</strong> Web addresses provided by you to run diagnostic speed and SEO audits.</li>
            <li><strong>Account &amp; Contact Details:</strong> Email address provided during checkout or customer support inquiries.</li>
            <li><strong>Technical Analytics:</strong> Anonymized usage data such as browser type, time spent, and pages visited to improve platform reliability.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Payment Processing (Paddle)</h2>
          <p>
            SitePulse does not store, process, or view your sensitive credit card or banking numbers.
            All payment transactions are handled directly and securely by our Merchant of Record,{' '}
            <strong>Paddle.com</strong>, which complies with PCI-DSS Level 1 security standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. How We Use Information</h2>
          <p>
            Information collected is strictly used to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
            <li>Execute requested website performance audits and generate downloadable PDF reports.</li>
            <li>Maintain customer accounts and notify subscribers of website performance drift.</li>
            <li>Respond to customer support and billing inquiries.</li>
          </ul>
          <p className="text-xs text-emerald-400 font-semibold pt-1">
            We will never sell, lease, or monetize your personal data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Data Retention &amp; Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal
            information at any time. Simply contact us at{' '}
            <a href="mailto:amarjamal@gmail.com" className="text-emerald-400 underline">
              amarjamal@gmail.com
            </a>
            .
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div>SitePulse &copy; 2026 Accord Apps. All rights reserved.</div>
      </footer>
    </div>
  );
}
