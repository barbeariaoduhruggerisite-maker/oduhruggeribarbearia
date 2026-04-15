import { Clock } from "lucide-react";
import { m } from "framer-motion";
import { fadeInUp, stagger, staggerSlow, viewport } from "@/lib/motion";

const schedule = [
  { day: "Segunda-feira", hours: "09:00 – 20:00", highlight: false },
  { day: "Terça-feira",   hours: "09:00 – 20:00", highlight: false },
  { day: "Quarta-feira",  hours: "09:00 – 20:00", highlight: false },
  { day: "Quinta-feira",  hours: "09:00 – 21:00", highlight: true  },
  { day: "Sexta-feira",   hours: "09:00 – 21:00", highlight: true  },
  { day: "Sábado",        hours: "09:00 – 20:00", highlight: false },
  { day: "Domingo",       hours: "Fechado",        closed: true     },
];

const rowVariant = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Hours = () => (
  <section id="horarios" className="scroll-mt-24 py-20 bg-secondary">
    <div className="container mx-auto max-w-lg px-4">
      <m.h2
        className="mb-10 text-center text-3xl md:text-4xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeInUp}
      >
        Horário de <span className="text-gold">Funcionamento</span>
      </m.h2>

      <m.div
        className="space-y-3 rounded-2xl border border-border bg-card p-6 md:p-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerSlow}
      >
        {schedule.map((item) => (
          <m.div
            key={item.day}
            variants={rowVariant}
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
          </m.div>
        ))}
      </m.div>
    </div>
  </section>
);

export default Hours;
