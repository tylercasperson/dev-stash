'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowLeft } from 'lucide-react';
import { startCheckout } from '@/lib/stripe-client';

const FREE_FEATURES = [
  { text: '50 items total', included: true },
  { text: '3 collections', included: true },
  { text: 'Snippets, prompts, notes, commands, links', included: true },
  { text: 'Full-text search', included: true },
  { text: 'File & image uploads', included: false },
  { text: 'AI features', included: false },
];

const PRO_FEATURES = [
  { text: 'Unlimited items', included: true },
  { text: 'Unlimited collections', included: true },
  { text: 'All item types including files & images', included: true },
  { text: 'AI auto-tagging', included: true },
  { text: 'AI code explanations', included: true },
  { text: 'Prompt optimizer', included: true },
  { text: 'Data export (JSON/ZIP)', included: true },
  { text: 'Priority support', included: true },
];

export default function UpgradePage() {
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null);

  async function handleCheckout(interval: 'monthly' | 'yearly') {
    setLoading(interval);
    try { await startCheckout(interval); } finally { setLoading(null); }
  }

  const interval = yearly ? 'yearly' : 'monthly';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[860px] mx-auto px-6 py-12">

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Upgrade to Pro
          </h1>
          <p className="text-muted-foreground">
            Unlock files, images, AI features, and unlimited everything.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium transition-colors ${yearly ? 'text-muted-foreground' : 'text-foreground'}`}>
            Monthly
          </span>
          <label className="relative inline-block w-11 h-6 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={yearly}
              onChange={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
            />
            <span className="absolute inset-0 rounded-full border border-border bg-muted transition-all duration-200" />
            <span
              className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200 bg-primary"
              style={{ left: yearly ? 'calc(100% - 21px)' : '3px' }}
            />
          </label>
          <span className={`text-sm font-medium flex items-center gap-2 transition-colors ${yearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
              Save 25%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Free */}
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-foreground">Free</h2>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-foreground">$0</span>
              <span className="text-base text-muted-foreground mb-1">/mo</span>
            </div>
            <p className="text-xs text-muted-foreground">Your current plan</p>
            <ul className="flex flex-col gap-2.5 flex-1">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f.text}
                  className={`flex items-start gap-2.5 text-sm ${f.included ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {f.included ? (
                    <Check size={14} className="shrink-0 mt-px text-emerald-500" />
                  ) : (
                    <X size={14} className="shrink-0 mt-px text-muted-foreground" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <div className="mt-2 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
              Current plan
            </div>
          </div>

          {/* Pro */}
          <div className="rounded-xl border border-primary bg-card p-8 flex flex-col gap-5 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-wide text-white px-3.5 py-1 rounded-full bg-primary whitespace-nowrap">
              Most Popular
            </span>
            <h2 className="text-lg font-bold text-foreground">Pro</h2>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold tracking-tight text-foreground">
                {yearly ? '$6' : '$8'}
              </span>
              <span className="text-base text-muted-foreground mb-1">/mo</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {yearly ? 'Billed $72/year — save $24' : 'Billed monthly'}
            </p>
            <ul className="flex flex-col gap-2.5 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check size={14} className="shrink-0 mt-px text-emerald-500" />
                  {f.text}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(interval)}
              disabled={!!loading}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : yearly ? 'Upgrade — $72/yr' : 'Upgrade — $8/mo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
