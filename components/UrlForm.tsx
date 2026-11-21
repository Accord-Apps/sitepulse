'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Globe } from 'lucide-react';

interface UrlFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export const UrlForm: React.FC<UrlFormProps> = ({ onAudit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onAudit(url);
  };

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    onAudit(exampleUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Globe className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., stripe.com or https://mysite.com)"
            disabled={isLoading}
            className="w-full pl-12 pr-36 py-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-xl disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <span>Run Audit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Example Presets */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
        <span className="text-slate-500">Try an example:</span>
        {['stripe.com', 'apple.com', 'shopify.com', 'github.com'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleExampleClick(item)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all hover:border-slate-700 disabled:opacity-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};
