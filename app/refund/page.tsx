import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy - SitePulse',
  description: 'Refund, Money-Back Guarantee, and Subscription Cancellation Policy for SitePulse.',
};

export default function RefundPage() {
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
          <h1 className="text-3xl font-black text-white tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 21, 2026</p>
        </div>

        {/* 14-day guarantee callout */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">14-Day Money-Back Guarantee</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We stand behind SitePulse with full confidence. If you subscribe to any of our plans and
              find that it does not suit your business within the first 14 days of your purchase,
              we will issue a 100% full refund with no questions asked.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Subscription Cancellation</h2>
          <p>
            You can cancel your SitePulse subscription at any time. There are zero cancellation fees,
            lock-in contracts, or minimum commitment periods.
          </p>
          <p className="text-xs text-slate-400">
            Upon cancellation, you will retain full access to your plan features and monitored websites
            until the end of your current monthly billing period. After that period expires, your card
            will not be billed again.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. How to Request a Refund</h2>
          <p>
            To request a refund under our 14-day money-back guarantee, please email our support team at{' '}
            <a href="mailto:amarjamal@gmail.com" className="text-emerald-400 underline font-semibold">
              amarjamal@gmail.com
            </a>{' '}
            with:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
            <li>Your account email address</li>
            <li>Your Paddle order or invoice number</li>
          </ul>
          <p className="text-xs text-slate-400 pt-1">
            Refunds are processed within 24 to 48 hours and return to your original payment method
            (Card, Apple Pay, Google Pay, or PayPal) via Paddle.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Merchant of Record Support</h2>
          <p>
            Because our payments are processed by <strong>Paddle.com</strong>, you can also contact
            Paddle&apos;s 24/7 buyer support directly at{' '}
            <a
              href="https://paddle.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline"
            >
              paddle.net
            </a>{' '}
            for any billing questions, receipt downloads, or subscription management assistance.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div>SitePulse &copy; 2026 Accord Apps. All rights reserved.</div>
      </footer>
    </div>
  );
}
