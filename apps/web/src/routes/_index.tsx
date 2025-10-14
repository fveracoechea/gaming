import type { Route } from "./+types/_index";
import {
  Gamepad2,
  Rocket,
  ShieldCheck,
  Users2,
  Sparkles,
  Cpu,
  CloudLightning,
  Terminal,
} from "lucide-react";
import { Button } from "@gaming/ui/components/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@gaming/ui/components/alert";
import { Card } from "@gaming/ui/components/card";
import { Badge } from "@gaming/ui/components/badge";
import { Separator } from "@gaming/ui/components/separator";
import { Accordion } from "@gaming/ui/components/accordion";
import { Input } from "@gaming/ui/components/input";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@gaming/ui/components/accordion";

export default function Home(props: Route.ComponentProps) {
  return (
    <div className="relative flex flex-col min-h-dvh bg-gradient-to-b from-[#0d0f17] via-[#0d0f17] to-[#111827] text-white">
      {/* Background decorative layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 animate-slow-pan opacity-40 [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.65)_70%)]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_40%,#2d3fff0f,transparent_60%)]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#5c3bff33,transparent_45%,#ff2dc233)] mix-blend-screen opacity-30" />
        <TechGrid />
      </div>

      {/* Hero */}
      <section className="relative container mx-auto px-4 pt-24 pb-20 flex flex-col items-center gap-8">
        <div className="backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-1.5 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] flex items-center gap-2">
          <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-300">
            Beta
          </Badge>
          <span className="text-xs text-indigo-200">
            Rapid Gaming Stack v0.1
          </span>
        </div>

        <h1 className="relative text-center font-extrabold leading-tight tracking-tight text-5xl md:text-6xl">
          <span className="animate-gradient-text bg-clip-text text-transparent bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#6366f1)] bg-[length:300%_100%]">
            Build Social Gaming
          </span>
          <br />
          <span className="text-slate-400">
            Experiences <span className="text-white">Faster</span>
          </span>
          <Glow underline />
        </h1>

        <p className="max-w-2xl text-center text-lg md:text-xl text-white/60 font-light">
          Community-driven tournament SaaS: create, join & crowdfund fair events with escrow payouts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            size="lg"
            className="relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 transition shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_-6px_rgba(99,102,241,0.55)]"
          >
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_60%)] opacity-0 group-hover:opacity-70 transition" />
            <span className="relative font-semibold tracking-wide">
              Get Started
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10"
          >
            Read Docs
          </Button>
        </div>

        <StackMarquee />
      </section>

      <Separator className="opacity-10" />

      {/* Feature Grid */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-400" />
          Tournament Platform Core
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative p-6 bg-white/5 border-white/10 hover:border-indigo-400/40 backdrop-blur-sm transition rounded-xl overflow-hidden"
            >
              <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-pink-500/20 pointer-events-none" />
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-lg bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center group-hover:scale-110 transition">
                  <f.icon className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="font-semibold text-white text-base">{f.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-white/55">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="opacity-10" />

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Terminal className="h-6 w-6 text-emerald-400" /> Pipeline
        </h2>
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {howItWorks.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border border-white/10 rounded-lg backdrop-blur-sm bg-white/3 hover:border-indigo-400/40 transition"
            >
              <AccordionTrigger className="px-5 py-3 text-sm font-medium tracking-wide">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-xs text-white/60 leading-relaxed">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Product Vision & Details */}
      <section className="container mx-auto px-4 pb-10 max-w-5xl space-y-14">
        {/* Vision */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Vision
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-400">
            A platform for players & communities to create, join and crowdfund online game tournaments. Competitive gaming made accessible, transparent and self‑sustaining without corporate overhead.
          </p>
        </div>
        {/* Objectives */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-pink-400" /> Core Objectives
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-400">
            {[
              'Host tournaments across games & formats',
              'Secure player registration & entry fees',
              'Automatic prize pool distribution',
              'Multiple formats: single/double elim, round robin, Swiss, league',
              'Escrow handling of funds via Stripe',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
        {/* Target Users */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Users2 className="h-5 w-5 text-emerald-400" /> Target Users
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-xs md:text-sm">
            <Card className="p-4 bg-white/10 border-white/25">
              <h3 className="font-semibold mb-2 text-white">Players</h3>
              <p className="text-slate-400 leading-relaxed">Compete in community events, contribute small entry fees, receive transparent payouts.</p>
            </Card>
            <Card className="p-4 bg-white/10 border-white/25">
              <h3 className="font-semibold mb-2 text-white">Organizers</h3>
              <p className="text-slate-400 leading-relaxed">Streamers & community leads manage registrations, brackets & results; earn a share.</p>
            </Card>
            <Card className="p-4 bg-white/10 border-white/25">
              <h3 className="font-semibold mb-2 text-white">Spectators (Future)</h3>
              <p className="text-slate-400 leading-relaxed">Browse live/upcoming tournaments, leaderboards & stats for engagement.</p>
            </Card>
          </div>
        </div>
        {/* Monetization */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-amber-400" /> Monetization Strategy
          </h2>
          <ul className="grid md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-400">
            {[
              'Platform fee on entry or prize pools',
              'Premium organizer plans: branding, analytics, higher caps',
              'Sponsored events & featured placements',
              'Optional donations / tipping into prize pools',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
        {/* Roadmap */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-fuchsia-400" /> Future Roadmap
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Team tournaments & leagues',
              'Game integration APIs (scores, validation)',
              'Streaming widgets & spectator mode',
              'Mobile friendly experience',
              'Sponsorship & advertising dashboards',
              'Reputation & ranking systems',
            ].map((t) => (
              <Card key={t} className="p-3 bg-white/15 border-white/25 text-xs md:text-sm text-slate-400">
                {t}
              </Card>
            ))}
          </div>
        </div>
        {/* Success Metrics */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-300" /> Success Metrics
          </h2>
          <ul className="grid md:grid-cols-3 gap-3 text-[11px] md:text-xs text-slate-400">
            {[
              'Active tournaments / month',
              'Avg registration rate',
              'Processed payment volume',
              'Organizer retention',
              'Recurring event ratio',
              'User trust & satisfaction',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <Alert className="border border-white/20 bg-white/15 text-slate-400 text-xs">
          <AlertTitle className="text-sm font-medium text-white">Goal</AlertTitle>
          <AlertDescription className="leading-relaxed">
            Build the go‑to platform for community‑driven esports events — blending competition, transparency & simplicity.
          </AlertDescription>
        </Alert>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-4 pb-20 max-w-3xl">
        <Alert className="relative border border-indigo-400/30 bg-gradient-to-br from-indigo-900/60 via-indigo-800/40 to-purple-900/40 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[conic-gradient(at_50%_50%,#6366f1,#8b5cf6,#ec4899,#6366f1)] animate-slow-rotate" />
          <AlertTitle className="relative flex items-center gap-2 text-xl font-semibold">
            <CloudLightning className="h-5 w-5 text-indigo-300" /> Stay in the
            Loop
          </AlertTitle>
          <AlertDescription className="relative space-y-4">
            <p className="text-sm text-white/70">
              Get notified when we ship realtime party APIs, matchmaking
              modules & leaderboard kits.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const email = new FormData(form).get("email");
                console.log("subscribe", email);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                name="email"
                required
                type="email"
                placeholder="you@player.gg"
                className="flex-1 bg-white/10 border-white/20 focus-visible:ring-indigo-400"
              />
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 shadow-lg shadow-pink-600/40"
              >
                Notify me
              </Button>
            </form>
          </AlertDescription>
        </Alert>
      </section>

      {/* Footer */}
      <footer className="mt-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#6366f125,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 py-10 text-center text-xs text-white/50 flex flex-col gap-5">
          <div className="flex justify-center gap-6 text-[11px] font-medium">
            {['Docs', 'GitHub', 'Roadmap', 'Discord'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/50 hover:text-slate-400 transition"
              >
                {link}
              </a>
            ))}
          </div>
          <p>
            &copy; {new Date().getFullYear()} Gaming Monorepo. Crafted with
            Better‑T‑Stack.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Tournament Creation",
    desc: "Configure title, schedule, format (single/double elim, round robin, Swiss, league), entry fees & limits.",
    icon: Rocket,
  },
  {
    title: "Registration & Payments",
    desc: "Stripe Checkout for secure entry; pooled fees held until completion with automatic refunds when needed.",
    icon: ShieldCheck,
  },
  {
    title: "Escrow Payouts",
    desc: "Transparent distribution to winners, organizer share & platform fee once results finalize.",
    icon: Gamepad2,
  },
  {
    title: "Bracket Management",
    desc: "Real‑time brackets, player match reporting, automated progression & simple admin tools.",
    icon: Cpu,
  },
  {
    title: "Profiles & Stats",
    desc: "Public player/organizer pages with wins, earnings, placements, reputation & social links.",
    icon: Users2,
  },
  {
    title: "Discovery Directory",
    desc: "Search & filter upcoming tournaments by game, format, prize pool & date; highlight trending events.",
    icon: Sparkles,
  },
] as const;

interface HowItem {
  id: string;
  title: string;
  content: string;
}

const howItWorks: HowItem[] = [
  {
    id: "create",
    title: "Create Tournament",
    content:
      "Organizer sets details, chooses format & entry fee; platform prepares escrow & registration window.",
  },
  {
    id: "compete",
    title: "Players Register & Compete",
    content:
      "Players pay via Stripe, brackets generate, matches reported with progression & validation layers.",
  },
  {
    id: "payout",
    title: "Finalize & Payout",
    content:
      "On completion funds auto‑distribute to winners, organizer & platform. Transparent logs & stats update.",
  },
];

// Decorative subcomponents
function Glow({ underline = false }: { underline?: boolean }) {
  if (!underline) return null;
  return (
    <span
      aria-hidden
      className="block mt-3 h-px w-40 mx-auto bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-70"
    />
  );
}

function TechGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08]">
      <div className="h-full w-full bg-[linear-gradient(90deg,#ffffff05_1px,transparent_1px),linear-gradient(#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
    </div>
  );
}

function StackMarquee() {
  const items = [
    "Hono",
    "React Router",
    "Drizzle",
    "oRPC",
    "Bun",
    "Shadcn",
    "TypeScript",
    "Lucide",
  ];
  return (
    <div className="relative w-full overflow-hidden mt-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0f17] via-transparent to-[#0d0f17]" />
      <ul className="flex animate-marquee whitespace-nowrap gap-8 py-2 text-xs tracking-wide">
        {items.concat(items).map((n, i) => (
          <li
            key={i}
            className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60"
          >
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}
