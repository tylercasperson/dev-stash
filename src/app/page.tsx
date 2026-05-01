import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/homepage/Navbar';
import Hero from '@/components/homepage/Hero';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import AISection from '@/components/homepage/AISection';
import PricingSection from '@/components/homepage/PricingSection';
import CTASection from '@/components/homepage/CTASection';
import Footer from '@/components/homepage/Footer';

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className="bg-[#0d0d0f] text-[#e2e2f0] min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <AISection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
