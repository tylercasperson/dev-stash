'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Shared hex logo ──────────────────────────────────────────────────────────

function HexLogo() {
  return (
    <svg width="16" height="18" viewBox="0 0 20 22" fill="none" className="text-blue-400">
      <path d="M10 1L18.66 6V16L10 21L1.34 16V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Mockup slides ────────────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <div
      className="rounded-lg overflow-hidden border flex"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px' }}
    >
      <div style={{ width: '160px', background: '#111118', borderRight: '1px solid #2a2a38', padding: '12px 8px', flexShrink: 0 }}>
        <div style={{ color: '#e2e2f0', fontWeight: 700, fontSize: '12px', padding: '4px 8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HexLogo /> DevStash
        </div>
        {[
          { label: 'Snippets', color: '#3b82f6' },
          { label: 'Prompts', color: '#8b5cf6' },
          { label: 'Commands', color: '#f97316' },
          { label: 'Notes', color: '#fde047' },
          { label: 'Links', color: '#10b981' },
        ].map((item) => (
          <div key={item.label} style={{ padding: '5px 8px', color: '#9999b8', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: '8px', borderTop: '1px solid #2a2a38', paddingTop: '8px' }}>
          <div style={{ padding: '5px 8px', color: '#9999b8', fontSize: '10px' }}>Collections</div>
          {['React Patterns', 'AI Prompts', 'DevOps'].map((c) => (
            <div key={c} style={{ padding: '4px 8px', color: '#6b6b8a', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#6b6b8a', flexShrink: 0 }} />
              {c}
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px', marginBottom: '14px' }}>
          {[['48', 'Items'], ['12', 'Collections'], ['7', 'Favorites'], ['3', 'Pinned']].map(([val, label]) => (
            <div key={label} style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ color: '#e2e2f0', fontWeight: 700, fontSize: '15px' }}>{val}</div>
              <div style={{ color: '#6b6b8a', fontSize: '10px' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Collections</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {[
            { name: 'React Patterns', color: '#3b82f6', count: 14 },
            { name: 'AI Prompts', color: '#8b5cf6', count: 9 },
            { name: 'DevOps Scripts', color: '#f97316', count: 6 },
          ].map((c) => (
            <div key={c.name} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${c.color}`, borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ color: '#e2e2f0', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
              <div style={{ color: '#6b6b8a', fontSize: '10px' }}>{c.count} items</div>
            </div>
          ))}
        </div>
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Items</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { title: 'useDebounce hook', color: '#3b82f6' },
            { title: 'GPT system prompt', color: '#8b5cf6' },
            { title: 'docker compose up', color: '#f97316' },
            { title: 'API auth notes', color: '#fde047' },
            { title: 'github.com/react', color: '#10b981' },
            { title: 'Tailwind snippets', color: '#3b82f6' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${item.color}`, borderRadius: '6px', padding: '7px 9px', color: '#c8c8e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrawerMockup() {
  return (
    <div
      className="rounded-lg overflow-hidden border flex"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px' }}
    >
      <div style={{ flex: 1, padding: '14px', opacity: 0.35 }}>
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Snippets</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {['useDebounce hook', 'Fetch with retry', 'Array groupBy', 'Deep clone util'].map((title) => (
            <div key={title} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: '3px solid #3b82f6', borderRadius: '6px', padding: '8px 10px', color: '#c8c8e0' }}>
              {title}
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '340px', borderLeft: '1px solid #2a2a38', background: '#111118', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2a38', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#e2e2f0', fontWeight: 600, fontSize: '12px' }}>useDebounce hook</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['★', '⊕', '⊘'].map((icon) => (
              <span key={icon} style={{ color: '#6b6b8a', fontSize: '13px' }}>{icon}</span>
            ))}
          </div>
        </div>
        <div style={{ margin: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a38' }}>
          <div style={{ background: '#1e1e1e', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid #2a2a38' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '6px', color: '#6b6b8a', fontSize: '10px' }}>typescript</span>
          </div>
          <div style={{ background: '#1e1e1e', padding: '10px', fontFamily: 'monospace', lineHeight: '1.6', fontSize: '10px' }}>
            <div><span style={{ color: '#569cd6' }}>function</span> <span style={{ color: '#dcdcaa' }}>useDebounce</span><span style={{ color: '#e2e2f0' }}>&lt;T&gt;(</span></div>
            <div style={{ paddingLeft: '12px' }}><span style={{ color: '#9cdcfe' }}>value</span><span style={{ color: '#e2e2f0' }}>: T,</span></div>
            <div style={{ paddingLeft: '12px' }}><span style={{ color: '#9cdcfe' }}>delay</span><span style={{ color: '#e2e2f0' }}>: </span><span style={{ color: '#4ec9b0' }}>number</span></div>
            <div><span style={{ color: '#e2e2f0' }}>): T {'{'}</span></div>
            <div style={{ paddingLeft: '12px' }}><span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#9cdcfe' }}>[debouncedValue, set]</span></div>
            <div style={{ paddingLeft: '12px' }}><span style={{ color: '#e2e2f0' }}>= </span><span style={{ color: '#dcdcaa' }}>useState</span><span style={{ color: '#e2e2f0' }}>&lt;T&gt;(value);</span></div>
            <div><span style={{ color: '#e2e2f0' }}>{'}'}</span></div>
          </div>
        </div>
        <div style={{ padding: '0 14px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {['react', 'hooks', 'typescript'].map((tag) => (
            <span key={tag} style={{ background: '#1a1a24', border: '1px solid #2a2a38', borderRadius: '4px', padding: '2px 7px', color: '#9999b8', fontSize: '10px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CollectionsMockup() {
  const collections = [
    { name: 'React Patterns', color: '#3b82f6', count: 14, desc: 'Reusable hooks and component patterns' },
    { name: 'AI Prompts', color: '#8b5cf6', count: 9, desc: 'System prompts and chat templates' },
    { name: 'DevOps Scripts', color: '#f97316', count: 6, desc: 'Docker, CI/CD, and shell automation' },
    { name: 'Interview Prep', color: '#fde047', count: 22, desc: 'Algorithms, system design, and notes' },
    { name: 'API Examples', color: '#10b981', count: 11, desc: 'REST and GraphQL request templates' },
    { name: 'Learning Notes', color: '#ec4899', count: 8, desc: 'Study notes and reference docs' },
  ];
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px', padding: '16px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ color: '#e2e2f0', fontWeight: 600, fontSize: '13px' }}>Collections</span>
        <span style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', padding: '3px 10px', borderRadius: '5px', fontWeight: 600 }}>+ New</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {collections.map((c) => (
          <div key={c.name} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${c.color}`, borderRadius: '8px', padding: '10px 12px' }}>
            <div style={{ color: '#e2e2f0', fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
            <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</div>
            <div style={{ color: '#9999b8', fontSize: '10px' }}>{c.count} items</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchMockup() {
  const results = [
    { title: 'useDebounce hook', type: 'snippet', color: '#3b82f6' },
    { title: 'GPT-4 system prompt', type: 'prompt', color: '#8b5cf6' },
    { title: 'docker-compose up -d', type: 'command', color: '#f97316' },
    { title: 'API auth notes', type: 'note', color: '#fde047' },
    { title: 'github.com/vercel/next.js', type: 'link', color: '#10b981' },
  ];
  return (
    <div
      className="rounded-lg overflow-hidden border relative flex items-start justify-center"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px', paddingTop: '40px' }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignContent: 'start' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '6px', height: '60px' }} />
        ))}
      </div>
      <div
        style={{ width: '440px', background: '#13131a', border: '1px solid #2a2a38', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderBottom: '1px solid #2a2a38' }}>
          <span style={{ color: '#6b6b8a', fontSize: '13px' }}>⌕</span>
          <span style={{ color: '#9999b8', flex: 1 }}>Search items and collections...</span>
          <kbd style={{ background: '#1a1a24', border: '1px solid #2a2a38', borderRadius: '4px', padding: '1px 5px', color: '#6b6b8a', fontSize: '10px' }}>⌘K</kbd>
        </div>
        <div style={{ padding: '6px 0' }}>
          <div style={{ padding: '3px 12px 5px', color: '#6b6b8a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Items</div>
          {results.map((r, i) => (
            <div key={r.title} style={{ padding: '7px 12px', background: i === 0 ? '#1a1a2e' : 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: r.color, flexShrink: 0 }} />
              <span style={{ flex: 1, color: i === 0 ? '#e2e2f0' : '#c8c8e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
              <span style={{ color: r.color, fontSize: '10px', textTransform: 'capitalize', background: `${r.color}22`, padding: '1px 6px', borderRadius: '3px' }}>{r.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Slide definitions ────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 'dashboard',
    title: 'Dashboard at a glance',
    description: 'See your stats, jump to collections, and pick up where you left off — all from one screen.',
    mockup: <DashboardMockup />,
  },
  {
    id: 'drawer',
    title: 'Open any item instantly',
    description: 'Click a card to open a full-featured drawer with syntax highlighting, tags, and one-click copy.',
    mockup: <DrawerMockup />,
  },
  {
    id: 'collections',
    title: 'Organize with Collections',
    description: 'Group related snippets, prompts, and notes. Add items to multiple collections at once.',
    mockup: <CollectionsMockup />,
  },
  {
    id: 'search',
    title: 'Find anything with ⌘K',
    description: 'Full-text search across every item and collection. Press ⌘K (or Ctrl+K) from anywhere.',
    mockup: <SearchMockup />,
  },
];

// ─── Carousel ─────────────────────────────────────────────────────────────────

export default function PreviewCarousel() {
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const slide = SLIDES[index];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#0d0d0f', border: '1px solid #2a2a38', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}
    >
      {/* Slide area */}
      <div className="px-6 pt-6 pb-4 relative">
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ background: '#1a1a24', border: '1px solid #2a2a38', color: '#e2e2f0' }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ background: '#1a1a24', border: '1px solid #2a2a38', color: '#e2e2f0' }}
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>
        {slide.mockup}
      </div>

      {/* Caption */}
      <div className="px-6 pb-2 text-center">
        <p className="font-semibold text-sm mb-1" style={{ color: '#e2e2f0' }}>{slide.title}</p>
        <p className="text-sm" style={{ color: '#7a8fa8' }}>{slide.description}</p>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 py-3">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all"
            style={{
              width: i === index ? '20px' : '6px',
              height: '6px',
              background: i === index ? '#3b82f6' : '#2a2a38',
            }}
          />
        ))}
      </div>

      {/* CTA footer */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4"
        style={{ borderTop: '1px solid #2a2a38', background: '#111118' }}
      >
        <p className="text-sm" style={{ color: '#7a8fa8' }}>
          Ready to organise your developer knowledge?
        </p>
        <Link
          href="/register"
          className="flex items-center text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:-translate-y-px whitespace-nowrap"
          style={{ background: '#3b82f6' }}
        >
          Get Started Free →
        </Link>
      </div>
    </div>
  );
}
