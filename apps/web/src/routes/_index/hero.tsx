import { Button } from '@gaming/ui/components/button';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="aspect-auto lg:aspect-video relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background video */}
      <video
        className="absolute inset-0 pointer-events-none h-full w-full object-cover brightness-95 contrast-105 motion-safe:block"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/home-v1.mp4" type="video/mp4" />
        <source src="/home-mobile.mp4" type="video/mp4" media="(min-width: 640px)" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none bg-g bg-gradient-to-r from-primary/20 to-accent/20" />

      <div className="dark relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              Dota 2
            </span>
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              CS2
            </span>
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              Apex Legends
            </span>
          </div>

          <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
            The complete platform to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              run esports tournaments
            </span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl lg:text-2xl">
            Setup tournaments in minutes with automated brackets, Steam API validation,
            crowdfunded prize pools, and instant payouts. Everything you need to run
            professional gaming events.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" className="group">
              <span>Start Free Trial</span>
              <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="outline" className="font-semibold">
              <Play className="mr-2 h-4 w-4" />
              <span>Watch Demo</span>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
