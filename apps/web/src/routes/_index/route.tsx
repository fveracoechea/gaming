import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import { Hero } from "./hero";
import { Stats } from "./stats";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { CTA } from "./cta";

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
