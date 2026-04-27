'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

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

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24" style={{ background: '#0d0d0f' }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <h2
          className="text-center font-extrabold mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.8px', color: '#e2e2f0' }}
        >
          Simple, honest pricing
        </h2>
        <p className="text-center text-lg mb-10" style={{ color: '#6b6b8a' }}>
          Start free. Upgrade when you&apos;re ready.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className="text-[15px] font-medium"
            style={{ color: yearly ? '#6b6b8a' : '#e2e2f0' }}
          >
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
            <span
              className="absolute inset-0 rounded-full transition-all duration-200"
              style={{
                background: yearly ? '#3b82f622' : '#1a1a24',
                border: yearly ? '1px solid #3b82f6' : '1px solid #2a2a38',
              }}
            />
            <span
              className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200"
              style={{
                left: yearly ? 'calc(100% - 21px)' : '3px',
                background: yearly ? '#3b82f6' : '#6b6b8a',
              }}
            />
          </label>
          <span
            className="text-[15px] font-medium flex items-center gap-2"
            style={{ color: yearly ? '#e2e2f0' : '#6b6b8a' }}
          >
            Yearly
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e44' }}
            >
              Save 25%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {/* Free */}
          <div
            className="rounded-xl p-9 flex flex-col gap-5 relative"
            style={{ background: '#13131a', border: '1px solid #2a2a38' }}
          >
            <h3 className="text-xl font-bold tracking-[-0.3px]" style={{ color: '#e2e2f0' }}>Free</h3>
            <div>
              <span className="font-extrabold leading-none" style={{ fontSize: '48px', letterSpacing: '-1.5px', color: '#e2e2f0' }}>
                $0
              </span>
              <span className="text-lg font-medium" style={{ color: '#6b6b8a' }}>/mo</span>
            </div>
            <p className="text-[13px]" style={{ color: '#6b6b8a' }}>Everything you need to get started</p>
            <ul className="flex flex-col gap-2.5 flex-1">
              {FREE_FEATURES.map((f) => (
                <li
                  key={f.text}
                  className="flex items-start gap-2.5 text-sm"
                  style={{ color: f.included ? '#e2e2f0' : '#6b6b8a' }}
                >
                  {f.included ? (
                    <Check size={14} className="shrink-0 mt-px" style={{ color: '#10b981' }} />
                  ) : (
                    <X size={14} className="shrink-0 mt-px" style={{ color: '#6b6b8a' }} />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex w-full items-center justify-center text-sm font-semibold py-3 rounded-lg transition-colors border border-[#2a2a38] hover:bg-[#1a1a24] hover:border-[#3a3a52]"
              style={{ color: '#e2e2f0' }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded-xl p-9 flex flex-col gap-5 relative"
            style={{
              background: 'linear-gradient(145deg, #13131a, #131d2f)',
              border: '1px solid #3b82f6',
            }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-[0.5px] text-white px-3.5 py-1 rounded-full whitespace-nowrap"
              style={{ background: '#3b82f6' }}
            >
              Most Popular
            </span>
            <h3 className="text-xl font-bold tracking-[-0.3px]" style={{ color: '#e2e2f0' }}>Pro</h3>
            <div>
              <span className="font-extrabold leading-none" style={{ fontSize: '48px', letterSpacing: '-1.5px', color: '#e2e2f0' }}>
                {yearly ? '$6' : '$8'}
              </span>
              <span className="text-lg font-medium" style={{ color: '#6b6b8a' }}>/mo</span>
            </div>
            <p className="text-[13px]" style={{ color: '#6b6b8a' }}>
              {yearly ? 'Billed $72/year — save $24' : 'Billed monthly'}
            </p>
            <ul className="flex flex-col gap-2.5 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: '#e2e2f0' }}>
                  <Check size={14} className="shrink-0 mt-px" style={{ color: '#10b981' }} />
                  {f.text}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="flex w-full items-center justify-center text-sm font-semibold py-3 rounded-lg text-white transition-all hover:opacity-88 hover:-translate-y-px"
              style={{ background: '#3b82f6' }}
            >
              Start Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
