import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Send, User } from "lucide-react";
import { SCHEDULING_PREFILL_EVENT, getServiceByName, serviceCategories } from "@/data/services";
import { buildWhatsAppLink } from "@/lib/contact";

const getHours = (dayOfWeek: number): string[] => {
  const hours: string[] = [];

  if (dayOfWeek === 0) return [];

  const start = 9;
  const end = dayOfWeek === 4 || dayOfWeek === 5 ? 21 : 20;

  for (let hour = start; hour < end; hour += 1) {
    hours.push(`${String(hour).padStart(2, "0")}:00`);
    hours.push(`${String(hour).padStart(2, "0")}:30`);
  }

  return hours;
};

const Scheduling = () => {
  const [name, setName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedService(customEvent.detail);
      }
    };

    window.addEventListener(SCHEDULING_PREFILL_EVENT, handlePrefill as EventListener);

    return () => {
      window.removeEventListener(SCHEDULING_PREFILL_EVENT, handlePrefill as EventListener);
    };
  }, []);

  const selectedServiceData = useMemo(() => getServiceByName(selectedService), [selectedService]);

  const dayOfWeek = useMemo(() => {
    if (!date) return -1;
    return new Date(`${date}T12:00:00`).getDay();
  }, [date]);

  const availableHours = useMemo(() => {
    if (dayOfWeek < 0) return [];
    return getHours(dayOfWeek);
  }, [dayOfWeek]);

  const isSunday = dayOfWeek === 0;
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const canSubmit = Boolean(name.trim() && selectedService && date && time && !isSunday);

  const handleSubmit = () => {
    if (!canSubmit || !selectedServiceData) return;

    const dateFormatted = new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");
    const message = [
      `Olá, meu nome é ${name.trim()}.`,
      "",
      `Gostaria de agendar o serviço: ${selectedServiceData.name}.`,
      `Valor: ${selectedServiceData.price}.`,
      `Data desejada: ${dateFormatted}.`,
      `Horário escolhido: ${time}.`,
    ].join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="agendamento" className="scroll-mt-24 py-20 bg-secondary">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="mb-4 text-center text-3xl md:text-4xl">
          Agende seu <span className="text-gold">horário</span>
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Preencha os dados abaixo e confirme pelo WhatsApp.
        </p>

        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <User size={16} className="text-gold" /> Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite seu nome"
              maxLength={100}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar size={16} className="text-gold" /> Serviço
            </label>
            <select
              value={selectedService}
              onChange={(event) => setSelectedService(event.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-secondary px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            >
              <option value="">Selecione um serviço</option>
              {serviceCategories.map((category) => (
                <optgroup key={category.name} label={category.name}>
                  {category.services.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name} — {service.price}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedServiceData && (
            <div className="rounded-lg border border-gold/20 bg-gold/10 p-4 text-center">
              <span className="text-sm text-muted-foreground">Valor:</span>
              <span className="ml-2 font-display text-xl font-bold text-gold">{selectedServiceData.price}</span>
            </div>
          )}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar size={16} className="text-gold" /> Data
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(event) => {
                setDate(event.target.value);
                setTime("");
              }}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition"
            />
            {isSunday && <p className="mt-1 text-sm text-destructive">Não abrimos aos domingos. Escolha outro dia.</p>}
          </div>

          {availableHours.length > 0 && !isSunday && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock size={16} className="text-gold" /> Horário
              </label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {availableHours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setTime(hour)}
                    className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors ${
                      time === hour
                        ? "gradient-gold border-transparent text-primary-foreground"
                        : "border-border bg-secondary text-foreground hover:border-gold/40"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold transition-all ${
              canSubmit ? "gradient-gold text-primary-foreground hover:opacity-90" : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <Send size={20} />
            Confirmar agendamento no WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default Scheduling;
