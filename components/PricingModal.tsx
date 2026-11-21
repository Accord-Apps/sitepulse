'use client';

import React, { useState } from 'react';
import { Check, Zap, Shield, Sparkles, Building2, Loader2 } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: 'starter' | 'pro') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loadingPlan, setLoadingPlan] = useState<'starter' | 'pro' | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (plan: 'starter' | 'pro') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start checkout.');
      }
    } catch {
      alert('Failed to connect to checkout.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automate Site Monitoring & Protect Your Revenue</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Catch speed slowdowns and SEO drops before Google penalizes your rankings.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starter Plan ($19/mo) */}
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">Starter Owner</h3>
                  <p className="text-xs text-slate-400">For non-technical business founders</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$19</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>3 Monitored Websites</strong> tracked 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Weekly automated speed &amp; SEO audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Plain-English Executive Summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant email alerts when scores drop &gt;10%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>One-click developer tickets</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('starter')}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'starter' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <span>Start 7-Day Free Trial ($19/mo)</span>
              )}
            </button>
          </div>

          {/* Pro Agency Plan ($39/mo) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-2 border-emerald-500/80 flex flex-col justify-between shadow-xl shadow-emerald-500/10 relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">Pro Agency &amp; Dev</h3>
                  <p className="text-xs text-slate-400">For freelancers, agencies &amp; developers</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">$39</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>10 Monitored Client Websites</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Daily</strong> automated audits &amp; drift monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>White-Label Reports:</strong> Put your agency logo &amp; brand</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Client-ready PDF exports you can bill \$150+ for</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Competitor head-to-head tracking</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout('pro')}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loadingPlan === 'pro' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <span>Get Started with Pro ($39/mo)</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-8 text-center text-[11px] text-slate-500">
          🔒 Secure 256-bit encryption • Cancel anytime with 1 click • No hidden fees
        </div>
      </div>
    </div>
  );
};
