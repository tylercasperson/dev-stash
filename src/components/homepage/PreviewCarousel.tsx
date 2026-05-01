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
      {/* Sidebar */}
      <div style={{ width: '160px', background: '#111118', borderRight: '1px solid #2a2a38', padding: '12px 8px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <div style={{ color: '#e2e2f0', fontWeight: 700, fontSize: '12px', padding: '4px 8px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HexLogo /> DevStash
        </div>
        {/* Favorites */}
        <div style={{ padding: '5px 8px', color: '#fde047', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '4px' }}>
          <span style={{ fontSize: '10px' }}>★</span> Favorites
        </div>
        {/* Item types */}
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
        {/* Pro types */}
        {[
          { label: 'Files', color: '#6b7280' },
          { label: 'Images', color: '#ec4899' },
        ].map((item) => (
          <div key={item.label} style={{ padding: '5px 8px', color: '#6b6b8a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              {item.label}
            </div>
            <span style={{ background: '#3b82f622', color: '#3b82f6', fontSize: '8px', padding: '1px 4px', borderRadius: '3px', fontWeight: 700 }}>PRO</span>
          </div>
        ))}
        {/* Collections */}
        <div style={{ marginTop: '6px', borderTop: '1px solid #2a2a38', paddingTop: '8px' }}>
          <div style={{ padding: '4px 8px', color: '#6b6b8a', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Collections</div>
          {['React Patterns', 'AI Prompts', 'DevOps'].map((c) => (
            <div key={c} style={{ padding: '4px 8px', color: '#6b6b8a', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#6b6b8a', flexShrink: 0 }} />
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '14px', overflow: 'hidden' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '7px', marginBottom: '14px' }}>
          {[['48', 'Items'], ['3', 'Collections'], ['7', 'Favorites'], ['3', 'Pinned']].map(([val, label]) => (
            <div key={label} style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ color: '#e2e2f0', fontWeight: 700, fontSize: '15px' }}>{val}</div>
              <div style={{ color: '#6b6b8a', fontSize: '10px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Collections */}
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Collections</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px' }}>
          {[
            { name: 'React Patterns', color: '#3b82f6', count: 14, fav: true },
            { name: 'AI Prompts', color: '#8b5cf6', count: 9, fav: false },
            { name: 'DevOps Scripts', color: '#f97316', count: 6, fav: false },
          ].map((c) => (
            <div key={c.name} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${c.color}`, borderRadius: '6px', padding: '8px 10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#e2e2f0', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                {c.fav && <span style={{ color: '#fde047', fontSize: '9px' }}>★</span>}
              </div>
              <div style={{ color: '#6b6b8a', fontSize: '10px' }}>{c.count} items</div>
            </div>
          ))}
        </div>

        {/* Recent Items */}
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Items</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { title: 'useDebounce hook', color: '#3b82f6', pinned: true },
            { title: 'GPT system prompt', color: '#8b5cf6', pinned: false },
            { title: 'docker compose up', color: '#f97316', pinned: false },
            { title: 'API auth notes', color: '#fde047', pinned: false },
            { title: 'github.com/react', color: '#10b981', pinned: false },
            { title: 'Tailwind snippets', color: '#3b82f6', pinned: false },
          ].map((item) => (
            <div key={item.title} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${item.color}`, borderRadius: '6px', padding: '7px 9px', color: '#c8c8e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{item.title}</span>
              {item.pinned && <span style={{ color: '#6b6b8a', fontSize: '9px', flexShrink: 0 }}>📌</span>}
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
      {/* Dimmed background */}
      <div style={{ flex: 1, padding: '14px', opacity: 0.3 }}>
        <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Snippets</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {['useDebounce hook', 'Fetch with retry', 'Array groupBy', 'Deep clone util'].map((title) => (
            <div key={title} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: '3px solid #3b82f6', borderRadius: '6px', padding: '8px 10px', color: '#c8c8e0' }}>
              {title}
            </div>
          ))}
        </div>
      </div>

      {/* Drawer panel */}
      <div style={{ width: '340px', borderLeft: '1px solid #2a2a38', background: '#111118', display: 'flex', flexDirection: 'column' }}>
        {/* Drawer header */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #2a2a38', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ color: '#e2e2f0', fontWeight: 600, fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>useDebounce hook</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ color: '#fde047', fontSize: '12px' }}>★</span>
            <span style={{ color: '#6b6b8a', fontSize: '12px' }}>📌</span>
            <span style={{ color: '#6b6b8a', fontSize: '12px' }}>⊘</span>
            <span style={{ color: '#6b6b8a', fontSize: '11px' }}>✎</span>
            <span style={{ color: '#ef4444', fontSize: '11px' }}>🗑</span>
          </div>
        </div>

        {/* Code editor */}
        <div style={{ margin: '10px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2a2a38' }}>
          {/* Editor header */}
          <div style={{ background: '#1e1e1e', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', borderBottom: '1px solid #2a2a38' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span key={c} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
            ))}
            <span style={{ marginLeft: '4px', color: '#6b6b8a', fontSize: '10px', flex: 1 }}>typescript</span>
            {/* AI Explain button */}
            <span style={{ background: '#8b5cf622', border: '1px solid #8b5cf644', color: '#8b5cf6', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
              ✦ Explain
            </span>
          </div>
          {/* Code area with Code/Explain tabs */}
          <div style={{ background: '#1e1e1e' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #2a2a38' }}>
              <span style={{ padding: '4px 10px', color: '#e2e2f0', fontSize: '10px', borderBottom: '2px solid #3b82f6', background: '#13131a' }}>Code</span>
              <span style={{ padding: '4px 10px', color: '#6b6b8a', fontSize: '10px' }}>Explain</span>
            </div>
            <div style={{ padding: '10px', fontFamily: 'monospace', lineHeight: '1.6', fontSize: '10px' }}>
              <div><span style={{ color: '#569cd6' }}>function</span> <span style={{ color: '#dcdcaa' }}>useDebounce</span><span style={{ color: '#e2e2f0' }}>&lt;T&gt;(</span></div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#9cdcfe' }}>value</span><span style={{ color: '#e2e2f0' }}>: T,</span></div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#9cdcfe' }}>delay</span><span style={{ color: '#e2e2f0' }}>: </span><span style={{ color: '#4ec9b0' }}>number</span></div>
              <div><span style={{ color: '#e2e2f0' }}>): T {'{'}</span></div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#569cd6' }}>const</span> <span style={{ color: '#9cdcfe' }}>[debouncedValue, set]</span></div>
              <div style={{ paddingLeft: '12px' }}><span style={{ color: '#e2e2f0' }}>= </span><span style={{ color: '#dcdcaa' }}>useState</span><span style={{ color: '#e2e2f0' }}>&lt;T&gt;(value);</span></div>
              <div><span style={{ color: '#e2e2f0' }}>{'}'}</span></div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ padding: '0 14px', display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {['react', 'hooks', 'typescript'].map((tag) => (
            <span key={tag} style={{ background: '#1a1a24', border: '1px solid #2a2a38', borderRadius: '4px', padding: '2px 7px', color: '#9999b8', fontSize: '10px' }}>{tag}</span>
          ))}
          {/* AI suggest tags button */}
          <span style={{ background: '#8b5cf622', border: '1px solid #8b5cf644', borderRadius: '4px', padding: '2px 7px', color: '#8b5cf6', fontSize: '10px' }}>✦ Suggest</span>
        </div>

        {/* Collections */}
        <div style={{ padding: '0 14px' }}>
          <span style={{ color: '#6b6b8a', fontSize: '10px' }}>Collections: </span>
          <span style={{ color: '#9999b8', fontSize: '10px' }}>React Patterns</span>
        </div>
      </div>
    </div>
  );
}

function CollectionsMockup() {
  const collections = [
    { name: 'React Patterns', color: '#3b82f6', count: 14, desc: 'Reusable hooks and component patterns', fav: true, icons: ['#3b82f6', '#fde047'] },
    { name: 'AI Prompts', color: '#8b5cf6', count: 9, desc: 'System prompts and chat templates', fav: false, icons: ['#8b5cf6'] },
    { name: 'DevOps Scripts', color: '#f97316', count: 6, desc: 'Docker, CI/CD, and shell automation', fav: true, icons: ['#f97316'] },
    { name: 'Interview Prep', color: '#fde047', count: 22, desc: 'Algorithms, system design, and notes', fav: false, icons: ['#3b82f6', '#fde047', '#10b981'] },
    { name: 'API Examples', color: '#10b981', count: 11, desc: 'REST and GraphQL request templates', fav: false, icons: ['#3b82f6', '#10b981'] },
    { name: 'Learning Notes', color: '#ec4899', count: 8, desc: 'Study notes and reference docs', fav: false, icons: ['#fde047'] },
  ];
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px', padding: '16px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ color: '#e2e2f0', fontWeight: 600, fontSize: '13px' }}>Collections</span>
        <span style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', padding: '3px 10px', borderRadius: '5px', fontWeight: 600 }}>+ New</span>
      </div>

      {/* Collection grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {collections.map((c) => (
          <div key={c.name} style={{ background: '#13131a', border: '1px solid #2a2a38', borderLeft: `3px solid ${c.color}`, borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Name + star */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#e2e2f0', fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
              {c.fav && <span style={{ color: '#fde047', fontSize: '10px', flexShrink: 0 }}>★</span>}
            </div>
            {/* Description */}
            <div style={{ color: '#6b6b8a', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</div>
            {/* Footer: count + type icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ color: '#9999b8', fontSize: '10px' }}>{c.count} items</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {c.icons.map((ic, idx) => (
                  <span key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: ic }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIFeaturesMockup() {
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: '#2a2a38', background: '#0d0d0f', height: '380px', fontSize: '11px' }}
    >
      {/* Header bar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #2a2a38', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#e2e2f0', fontWeight: 600, fontSize: '12px' }}>AI Features</span>
        <span style={{ background: '#8b5cf622', border: '1px solid #8b5cf644', color: '#8b5cf6', fontSize: '9px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>PRO</span>
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Auto-tagging */}
        <div style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#8b5cf6', fontSize: '13px' }}>✦</span>
            <span style={{ color: '#e2e2f0', fontWeight: 600 }}>Auto-Tag Suggestions</span>
          </div>
          <div style={{ color: '#6b6b8a', fontSize: '10px', marginBottom: '8px' }}>AI analyzes your content and suggests relevant tags</div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {['react', 'hooks', 'typescript', 'performance'].map((tag) => (
              <span key={tag} style={{ background: '#8b5cf622', border: '1px solid #8b5cf644', borderRadius: '4px', padding: '2px 8px', color: '#8b5cf6', fontSize: '10px' }}>+ {tag}</span>
            ))}
          </div>
        </div>

        {/* Code explanation */}
        <div style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#3b82f6', fontSize: '13px' }}>✦</span>
            <span style={{ color: '#e2e2f0', fontWeight: 600 }}>Explain This Code</span>
          </div>
          <div style={{ color: '#9999b8', fontSize: '10px', lineHeight: '1.6' }}>
            <span style={{ color: '#e2e2f0' }}>useDebounce</span> delays updating a value until a specified
            amount of time has passed since the last change — useful for
            search inputs to avoid excessive API calls.
          </div>
        </div>

        {/* Prompt optimizer */}
        <div style={{ background: '#13131a', border: '1px solid #2a2a38', borderRadius: '8px', padding: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#8b5cf6', fontSize: '13px' }}>✦</span>
            <span style={{ color: '#e2e2f0', fontWeight: 600 }}>Prompt Optimizer</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ padding: '3px 8px', background: '#1a1a24', border: '1px solid #3b82f6', borderRadius: '4px', color: '#3b82f6', fontSize: '10px' }}>Original</span>
            <span style={{ padding: '3px 8px', background: '#8b5cf622', border: '1px solid #2a2a38', borderRadius: '4px', color: '#9999b8', fontSize: '10px' }}>Optimized</span>
            <span style={{ padding: '3px 8px', background: '#10b98122', border: '1px solid #10b98144', borderRadius: '4px', color: '#10b981', fontSize: '10px', marginLeft: 'auto' }}>✓ Use this</span>
          </div>
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
    description: 'Click a card to open a full-featured drawer with syntax highlighting, tags, and AI-powered tools.',
    mockup: <DrawerMockup />,
  },
  {
    id: 'collections',
    title: 'Organize with Collections',
    description: 'Group related snippets, prompts, and notes. Add items to multiple collections, and mark favorites.',
    mockup: <CollectionsMockup />,
  },
  {
    id: 'ai',
    title: 'AI-powered features (Pro)',
    description: 'Auto-tag suggestions, code explanations, prompt optimization, and AI-generated descriptions.',
    mockup: <AIFeaturesMockup />,
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
