'use client';

import { Code, Sparkles, Terminal, StickyNote, File, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    icon: Code,
    title: 'Code Snippets',
    description: 'Save reusable code with syntax highlighting. Never rewrite the same function twice.',
    color: '#3b82f6',
  },
  {
    icon: Sparkles,
    title: 'AI Prompts',
    description: 'Store and organize your best AI prompts. Copy with one click, iterate faster.',
    color: '#f59e0b',
  },
  {
    icon: Terminal,
    title: 'Commands',
    description: 'Save terminal commands and scripts. No more digging through bash history.',
    color: '#06b6d4',
  },
  {
    icon: StickyNote,
    title: 'Notes',
    description: 'Write in Markdown. Document your thinking, architectural decisions, and how-tos.',
    color: '#22c55e',
  },
  {
    icon: File,
    title: 'Files & Docs',
    description: 'Upload context files, documentation, and references. Find them instantly.',
    color: '#64748b',
  },
  {
    icon: LayoutGrid,
    title: 'Collections',
    description: 'Group related items together. Build focused libraries for projects, topics, or teams.',
    color: '#6366f1',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24"
      style={{ background: '#13131a', borderTop: '1px solid #2a2a38', borderBottom: '1px solid #2a2a38' }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <h2
          className="text-center font-extrabold mb-3"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.8px', color: '#e2e2f0' }}
        >
          Everything a developer needs, in one place
        </h2>
        <p className="text-center text-lg mb-14" style={{ color: '#7a8fa8' }}>
          Stop context switching. Start shipping.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl p-7 transition-all duration-200 hover:-translate-y-0.5 cursor-default border border-[#2a2a38]"
                style={{ background: '#1a1a24' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${feature.color}80`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a38'; }}
              >
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-bold mb-2 text-[17px]" style={{ color: '#e2e2f0' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7a8fa8' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
