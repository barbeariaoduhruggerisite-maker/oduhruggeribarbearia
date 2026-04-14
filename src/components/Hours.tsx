import { Clock } from "lucide-react";

const schedule = [
  { day: "Segunda-feira", hours: "09:00 – 20:00", highlight: false },
  { day: "Terça-feira", hours: "09:00 – 20:00", highlight: false },
  { day: "Quarta-feira", hours: "09:00 – 20:00", highlight: false },
  { day: "Quinta-feira", hours: "09:00 – 21:00", highlight: true },
  { day: "Sexta-feira", hours: "09:00 – 21:00", highlight: true },
  { day: "Sábado", hours: "09:00 – 20:00", highlight: false },
  { day: "Domingo", hours: "Fechado", closed: true },
];

const Hours = () => (
  <section id="horarios" className="scroll-mt-24 py-20 bg-secondary">
    <div className="container mx-auto max-w-lg px-4">
      <h2 className="mb-10 text-center text-3xl md:text-4xl">
        Horário de <span className="text-gold">Funcionamento</span>
      </h2>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-6 md:p-8">
        {schedule.map((item) => (
          <div
            key={item.day}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              item.highlight ? "border border-gold/20 bg-gold/10" : item.closed ? "opacity-50" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Clock size={16} className={item.highlight ? "text-gold" : "text-muted-foreground"} />
              <span className={`whitespace-nowrap text-sm font-medium sm:text-base ${item.highlight ? "text-gold" : "text-foreground"}`}>
                {item.day}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span
                className={`whitespace-nowrap text-sm font-semibold sm:text-base ${
                  item.highlight ? "text-gold" : item.closed ? "text-destructive" : "text-foreground"
                }`}
              >
                {item.hours}
              </span>
              {item.highlight && (
                <span className="self-end rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-medium text-gold sm:self-auto sm:text-xs">
                  estendido
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Hours;
