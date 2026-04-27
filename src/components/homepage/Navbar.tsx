'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import PreviewModal from './PreviewModal';

function HexLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" className="text-blue-400">
      <path d="M10 1L18.66 6V16L10 21L1.34 16V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(13,13,15,0.92)' : 'rgba(13,13,15,0.5)',
          borderBottom: scrolled ? '1px solid #2a2a38' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-[18px] tracking-[-0.3px]">
            <HexLogo />
            <span className="text-[#e2e2f0]">DevStash</span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 ml-2">
            <li>
              <a
                href="#features"
                className="text-sm font-medium text-[#6b6b8a] px-3 py-1.5 rounded-md hover:text-[#e2e2f0] hover:bg-[#1a1a24] transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-sm font-medium text-[#6b6b8a] px-3 py-1.5 rounded-md hover:text-[#e2e2f0] hover:bg-[#1a1a24] transition-colors"
              >
                Pricing
              </a>
            </li>
          </ul>

          <div className="hidden md:flex items-center gap-2.5 ml-auto">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-[#e2e2f0] px-5 py-2.5 rounded-lg border border-[#2a2a38] hover:bg-[#1a1a24] hover:border-[#3a3a52] transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setPreviewOpen(true)}
              className="text-sm font-medium text-[#e2e2f0] px-5 py-2.5 rounded-lg border border-[#2a2a38] hover:bg-[#1a1a24] hover:border-[#3a3a52] transition-colors"
            >
              Preview Inside
            </button>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-blue-500 px-5 py-2.5 rounded-lg hover:opacity-88 hover:-translate-y-px transition-all"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden ml-auto p-1 text-[#e2e2f0]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className="md:hidden flex flex-col gap-3 px-6 pb-5 pt-4"
            style={{ borderTop: '1px solid #2a2a38' }}
          >
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] text-[#6b6b8a] hover:text-[#e2e2f0]"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] text-[#6b6b8a] hover:text-[#e2e2f0]"
            >
              Pricing
            </a>
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="text-[15px] text-[#6b6b8a] hover:text-[#e2e2f0]"
            >
              Sign In
            </Link>
            <button
              onClick={() => { setMobileOpen(false); setPreviewOpen(true); }}
              className="mt-1 text-sm font-semibold text-[#e2e2f0] px-5 py-2.5 rounded-lg border border-[#2a2a38] text-center"
            >
              Preview Inside
            </button>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="mt-1 text-sm font-semibold text-white bg-blue-500 px-5 py-2.5 rounded-lg text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}
