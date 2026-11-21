import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - SitePulse',
  description: 'Terms of Service and Customer Agreement for SitePulse.',
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-black text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500">Last updated: November 21, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using SitePulse (operated by Accord Apps), you agree to be bound by these
            Terms of Service. If you disagree with any part of the terms, you may not access our service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Description of Service</h2>
          <p>
            SitePulse provides website speed analysis, technical search engine optimization (SEO)
            auditing, competitor benchmarking, and automated site monitoring tools for business owners,
            developers, and digital agencies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Subscriptions &amp; Billing</h2>
          <p>
            SitePulse offers recurring subscription plans: Starter (\$19/month) and Pro Agency
            (\$39/month). Subscriptions automatically renew at the end of each billing cycle unless
            cancelled prior to renewal.
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <strong className="text-white block mb-1">Merchant of Record:</strong>
            Our order process and recurring billing are conducted by our online reseller and Merchant
            of Record, <strong>Paddle.com</strong>. Paddle is the merchant of record for all our orders
            and handles customer service inquiries, billing inquiries, and global tax compliance.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Acceptable Use</h2>
          <p>
            You agree only to submit URLs for analysis that you own, operate, or have legitimate
            permission to inspect. You may not use SitePulse to overload, harass, or perform denial-of-service
            actions against target third-party servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
          <p>
            SitePulse provides diagnostic information and performance estimates on an &quot;as-is&quot; basis.
            We make no warranties regarding rankings, traffic increases, or financial performance resulting
            from implementing audit recommendations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Contact Information</h2>
          <p>
            If you have questions regarding these Terms, please contact us at{' '}
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
