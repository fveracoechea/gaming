import { Card } from '@gaming/ui/components/card';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Tournament',
      description:
        'Choose your game (Dota 2, CS2, or Apex Legends), set rules, and configure bracket format in minutes.',
    },
    {
      step: '02',
      title: 'Players Register',
      description:
        'Teams sign up through your custom tournament page. Steam accounts are automatically verified.',
    },
    {
      step: '03',
      title: 'Matches Run Automatically',
      description:
        'Brackets update in real-time. Match results are validated through Steam API integration.',
    },
    {
      step: '04',
      title: 'Winners Get Paid',
      description:
        'Prize money is distributed instantly via Stripe Connect. No manual processing required.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Run tournaments in four simple steps
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Our platform handles all the technical complexity, so you can focus on creating
            great competitive experiences.
          </p>
        </div>

        <div className="relative">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative border-border/50 bg-card/50 p-8 backdrop-blur-sm lg:ml-20"
              >
                <div className="absolute -left-12 top-8 hidden h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-2xl font-bold text-primary-foreground lg:flex">
                  {step.step}
                </div>
                <div className="lg:pl-8">
                  <h3 className="mb-3 text-2xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
