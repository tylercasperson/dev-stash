import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      className="py-24"
      style={{
        background: 'radial-gradient(ellipse 800px 400px at 50% 50%, #1a1a3a, #0d0d0f)',
        borderTop: '1px solid #2a2a38',
        borderBottom: '1px solid #2a2a38',
      }}
    >
      <div className="max-w-[560px] mx-auto px-6 text-center">
        <h2
          className="font-extrabold mb-4"
          style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', letterSpacing: '-0.6px', color: '#e2e2f0' }}
        >
          Ready to organize your developer knowledge?
        </h2>
        <p className="mb-8 text-[17px]" style={{ color: '#6b6b8a' }}>
          Join developers who&apos;ve stopped losing their best work.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center font-semibold text-white bg-blue-500 rounded-[10px] px-7 py-3.5 text-base hover:opacity-88 hover:-translate-y-px transition-all"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
}
