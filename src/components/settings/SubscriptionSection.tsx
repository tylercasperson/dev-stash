'use client';

import { useState } from 'react';

interface Props {
  isPro: boolean;
  hasStripeCustomer: boolean;
}

export default function SubscriptionSection({ isPro, hasStripeCustomer }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(interval: 'monthly' | 'yearly') {
    setLoading(interval);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  if (isPro) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">DevStash Pro</p>
          <p className="text-sm text-muted-foreground">Your subscription is active.</p>
        </div>
        {hasStripeCustomer && (
          <button
            onClick={handlePortal}
            disabled={loading === 'portal'}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground disabled:opacity-50"
          >
            {loading === 'portal' ? 'Loading…' : 'Manage billing'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border p-4 space-y-1">
        <p className="text-sm font-medium text-foreground">Free plan</p>
        <p className="text-sm text-muted-foreground">50 items · 3 collections · no file uploads</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleCheckout('monthly')}
          disabled={!!loading}
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading === 'monthly' ? 'Loading…' : 'Upgrade — $8/mo'}
        </button>
        <button
          onClick={() => handleCheckout('yearly')}
          disabled={!!loading}
          className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50"
        >
          {loading === 'yearly' ? 'Loading…' : 'Upgrade — $72/yr (save 25%)'}
        </button>
      </div>
    </div>
  );
}
