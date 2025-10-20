import { Button } from '@gaming/ui/components/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 h-[350px] w-[350px] rounded-full bg-accent/20 blur-[90px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/50 bg-card/50 p-12 text-center backdrop-blur-sm">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Ready to elevate your tournaments?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground text-balance">
            Join thousands of organizers running professional esports events with BattleStage.
            Start your free trial today, no credit card required!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group h-12 px-8 text-base">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
              Schedule Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
