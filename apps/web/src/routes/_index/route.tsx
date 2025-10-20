import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import { CTA } from './cta';
import { Features } from './features';
import { Hero } from './hero';
import { HowItWorks } from './how-it-works';
import { Stats } from './stats';

export default function Homepage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
