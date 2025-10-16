import { Card } from "@gaming/ui/components/card";

import {
  DollarSign,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Automated Tournament Setup",
      description:
        "Create Dota 2, CS2, or Apex Legends tournaments in minutes. Automated bracket generation, seeding, and match scheduling.",
    },
    {
      icon: Shield,
      title: "Steam API Validation",
      description:
        "Verify match results automatically through Steam API integration. No more disputes or manual verification needed.",
    },
    {
      icon: DollarSign,
      title: "Instant Payouts",
      description:
        "Automatic prize distribution via Stripe Connect. Winners receive payouts instantly after tournament completion.",
    },
    {
      icon: Trophy,
      title: "Prize Pool Crowdfunding",
      description:
        "Boost prize pools with integrated donation tiers and milestones. Viewers can contribute in real-time during tournaments.",
    },
    {
      icon: TrendingUp,
      title: "Team Stats & Insights",
      description:
        "Comprehensive dashboards with match data, performance trends, and analytics for players and organizers.",
    },
    {
      icon: Users,
      title: "Player Registration",
      description:
        "Streamlined registration system with team management, player verification, and automated check-ins.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Everything you need to run professional tournaments
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            From registration to payouts, we handle the complexity so you can
            focus on creating amazing competitive experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-border p-6 transition-colors hover:border-primary"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
