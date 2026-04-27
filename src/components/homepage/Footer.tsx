import Link from 'next/link';

function HexLogo() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" className="text-blue-400">
      <path d="M10 1L18.66 6V16L10 21L1.34 16V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0d0d0f', borderTop: '1px solid #2a2a38' }}>
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col min-[900px]:flex-row gap-10 min-[900px]:gap-16 justify-between pb-12">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-[18px] tracking-[-0.3px] mb-3">
              <HexLogo />
              <span style={{ color: '#e2e2f0' }}>DevStash</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-[260px]" style={{ color: '#6b6b8a' }}>
              One fast, searchable hub for all your developer knowledge.
            </p>
          </div>
          <div className="flex gap-12 md:gap-12 flex-wrap">
            <div className="flex flex-col gap-2.5">
              <h4
                className="text-[12px] font-bold uppercase tracking-[0.8px] mb-1"
                style={{ color: '#6b6b8a' }}
              >
                Product
              </h4>
              <a href="#features" className="text-sm transition-colors hover:text-[#e2e2f0]" style={{ color: '#6b6b8a' }}>Features</a>
              <a href="#pricing" className="text-sm transition-colors hover:text-[#e2e2f0]" style={{ color: '#6b6b8a' }}>Pricing</a>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4
                className="text-[12px] font-bold uppercase tracking-[0.8px] mb-1"
                style={{ color: '#6b6b8a' }}
              >
                Account
              </h4>
              <Link href="/sign-in" className="text-sm transition-colors hover:text-[#e2e2f0]" style={{ color: '#6b6b8a' }}>Sign In</Link>
              <Link href="/register" className="text-sm transition-colors hover:text-[#e2e2f0]" style={{ color: '#6b6b8a' }}>Register</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <h4
                className="text-[12px] font-bold uppercase tracking-[0.8px] mb-1"
                style={{ color: '#6b6b8a' }}
              >
                Legal
              </h4>
              <span className="text-sm" style={{ color: '#3a3a52', cursor: 'default' }}>Privacy</span>
              <span className="text-sm" style={{ color: '#3a3a52', cursor: 'default' }}>Terms</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-5 text-center" style={{ borderTop: '1px solid #2a2a38' }}>
        <p className="text-[13px]" style={{ color: '#6b6b8a' }}>
          &copy; {year} DevStash. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
