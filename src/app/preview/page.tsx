import Navbar from '@/components/homepage/Navbar';
import PreviewCarousel from '@/components/homepage/PreviewCarousel';

export const metadata = {
  title: 'Preview — DevStash',
  description: 'See DevStash in action before signing up.',
};

export default function PreviewPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0d0d0f' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 px-4 pb-12">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h1
              className="font-extrabold mb-3"
              style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.6px', color: '#e2e2f0' }}
            >
              See DevStash in action
            </h1>
            <p className="text-base" style={{ color: '#7a8fa8' }}>
              Your developer knowledge hub — snippets, prompts, commands, notes, and more.
            </p>
          </div>
          <PreviewCarousel />
        </div>
      </div>
    </div>
  );
}
