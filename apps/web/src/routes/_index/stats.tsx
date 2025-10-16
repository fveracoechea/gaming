export function Stats() {
  const stats = [
    {
      value: "10K+",
      label: "Tournaments hosted",
      company: "ESL Gaming",
    },
    {
      value: "95%",
      label: "Faster setup time",
      company: "DreamHack",
    },
    {
      value: "$2M+",
      label: "Prize pools distributed",
      company: "BLAST",
    },
    {
      value: "50K+",
      label: "Active players",
      company: "FaceIt",
    },
  ];

  return (
    <section className="border-y border-border bg-muted py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="mb-2 text-4xl font-bold text-foreground lg:text-5xl">
                {stat.value}
              </div>
              <div className="mb-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {stat.company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
