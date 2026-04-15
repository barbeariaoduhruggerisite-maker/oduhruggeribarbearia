import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Calendar, Clock, Phone, Send, User } from "lucide-react";
import { SCHEDULING_PREFILL_EVENT, getServiceByName, serviceCategories } from "@/data/services";
import { buildWhatsAppLink } from "@/lib/contact";
import {
  type AgendarParams,
  type Barbeiro,
  buildWhatsAppMessage,
  criarAgendamento,
  fetchBarbeiros,
  fetchHorariosDisponiveis,
} from "@/lib/agendamento";
import { isSupabaseConfigured } from "@/lib/supabase";

const Scheduling = () => {
  // ── Campos do formulario ──
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [barbeiroId, setBarbeiroId] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ── Dados carregados do banco ──
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  // ── Estados de carregamento e erro ──
  const [isLoadingBarbeiros, setIsLoadingBarbeiros] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<{
    message: string;
    alternatives: string[];
  } | null>(null);

  // ── Carrega barbeiros ao montar ──
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    setIsLoadingBarbeiros(true);
    fetchBarbeiros()
      .then(setBarbeiros)
      .finally(() => setIsLoadingBarbeiros(false));
  }, []);

  // ── Pre-preenchimento de servico via evento customizado (botao "Agendar" nos cards) ──
  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) setSelectedService(customEvent.detail);
    };
    window.addEventListener(SCHEDULING_PREFILL_EVENT, handlePrefill as EventListener);
    return () => window.removeEventListener(SCHEDULING_PREFILL_EVENT, handlePrefill as EventListener);
  }, []);

  // ── Busca horarios disponiveis quando barbeiro + servico + data estao selecionados ──
  useEffect(() => {
    if (!barbeiroId || !selectedService || !date) {
      setAvailableHours([]);
      setTime("");
      setSlotsError(null);
      return;
    }
    if (!isSupabaseConfigured) return;

    setIsLoadingSlots(true);
    setAvailableHours([]);
    setTime("");
    setSlotsError(null);
    setConflictError(null);

    fetchHorariosDisponiveis(barbeiroId, date, selectedService)
      .then(({ slots, error }) => {
        if (error) setSlotsError(error);
        else setAvailableHours(slots);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [barbeiroId, selectedService, date]);

  const selectedServiceData = useMemo(() => getServiceByName(selectedService), [selectedService]);
  const selectedBarbeiro = useMemo(
    () => barbeiros.find((b) => b.id === barbeiroId) ?? null,
    [barbeiros, barbeiroId]
  );

  const dayOfWeek = useMemo(() => {
    if (!date) return -1;
    return new Date(`${date}T12:00:00`).getDay();
  }, [date]);

  const isSunday = dayOfWeek === 0;
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const canSubmit =
    isSupabaseConfigured &&
    Boolean(name.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(barbeiroId) &&
    Boolean(selectedService) &&
    Boolean(date) &&
    Boolean(time) &&
    !isSunday &&
    !isSubmitting;

  // ── Envio do formulario ──
  const handleSubmit = async () => {
    if (!canSubmit || !selectedServiceData || !selectedBarbeiro) return;

    setIsSubmitting(true);
    setConflictError(null);

    const params: AgendarParams = {
      clienteNome: name.trim(),
      clienteTelefone: phone.trim(),
      barbeiroId,
      barbeiroNome: selectedBarbeiro.nome,
      servicoNome: selectedService,
      servicoPreco: selectedServiceData.price,
      data: date,
      horario: time,
    };

    const result = await criarAgendamento(params);
    setIsSubmitting(false);

    if (!result.sucesso) {
      // Conflito ou erro: exibe mensagem inline, nao abre WhatsApp
      setConflictError({
        message: result.erro ?? "Horario indisponivel.",
        alternatives: result.horariosAlternativos ?? [],
      });
      // Atualiza o grid com os horarios alternativos vindos do servidor
      if (result.horariosAlternativos && result.horariosAlternativos.length > 0) {
        setAvailableHours(result.horariosAlternativos);
      }
      setTime("");
      return;
    }

    // Agendamento confirmado no banco: ENTAO abre WhatsApp
    const message = buildWhatsAppMessage(params);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-secondary px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition";
  const selectClass =
    "w-full appearance-none rounded-lg border border-border bg-secondary px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition";

  // ── Aviso quando Supabase nao esta configurado ──
  if (!isSupabaseConfigured) {
    return (
      <section id="agendamento" className="scroll-mt-24 py-20 bg-secondary">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-center text-3xl md:text-4xl">
            Agende seu <span className="text-gold">horario</span>
          </h2>
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 text-destructive" size={32} />
            <p className="font-semibold text-foreground">Agendamento temporariamente indisponivel.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure as variaveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local para ativar o agendamento online.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agendamento" className="scroll-mt-24 py-20 bg-secondary">
      <div className="container mx-auto max-w-3xl px-4">
        <h2 className="mb-4 text-center text-3xl md:text-4xl">
          Agende seu <span className="text-gold">horario</span>
        </h2>
        <p className="mb-10 text-center text-muted-foreground">
          Preencha os dados abaixo e confirme pelo WhatsApp.
        </p>

        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">

          {/* Campo: Nome */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <User size={16} className="text-gold" /> Seu nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={100}
              className={inputClass}
            />
          </div>

          {/* Campo: Telefone */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone size={16} className="text-gold" /> Seu telefone (WhatsApp)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              maxLength={20}
              className={inputClass}
            />
          </div>

          {/* Campo: Barbeiro */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <User size={16} className="text-gold" /> Barbeiro
            </label>
            <select
              value={barbeiroId}
              onChange={(e) => setBarbeiroId(e.target.value)}
              disabled={isLoadingBarbeiros}
              className={selectClass}
            >
              <option value="">
                {isLoadingBarbeiros ? "Carregando..." : "Selecione um barbeiro"}
              </option>
              {barbeiros.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Campo: Servico */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar size={16} className="text-gold" /> Servico
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className={selectClass}
            >
              <option value="">Selecione um servico</option>
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

          {/* Valor do servico selecionado */}
          {selectedServiceData && (
            <div className="rounded-lg border border-gold/20 bg-gold/10 p-4 text-center">
              <span className="text-sm text-muted-foreground">Valor:</span>
              <span className="ml-2 font-display text-xl font-bold text-gold">
                {selectedServiceData.price}
              </span>
            </div>
          )}

          {/* Campo: Data */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar size={16} className="text-gold" /> Data
            </label>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setConflictError(null);
              }}
              className={inputClass}
            />
            {isSunday && (
              <p className="mt-1 text-sm text-destructive">
                Nao abrimos aos domingos. Escolha outro dia.
              </p>
            )}
          </div>

          {/* Campo: Horario (dinamico, carregado do banco) */}
          {barbeiroId && selectedService && date && !isSunday && (
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock size={16} className="text-gold" /> Horario
              </label>

              {isLoadingSlots && (
                <p className="py-3 text-center text-sm text-muted-foreground">
                  Verificando horarios disponiveis...
                </p>
              )}

              {!isLoadingSlots && slotsError && (
                <p className="py-3 text-center text-sm text-destructive">{slotsError}</p>
              )}

              {!isLoadingSlots && !slotsError && availableHours.length === 0 && (
                <p className="py-3 text-center text-sm text-muted-foreground">
                  Nenhum horario disponivel para esta data. Tente outra data.
                </p>
              )}

              {!isLoadingSlots && !slotsError && availableHours.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {availableHours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => {
                        setTime(hour);
                        setConflictError(null);
                      }}
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
              )}
            </div>
          )}

          {/* Mensagem de conflito com horarios alternativos */}
          {conflictError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-destructive">
                <AlertCircle size={16} />
                <span className="text-sm font-semibold">{conflictError.message}</span>
              </div>
              {conflictError.alternatives.length > 0 ? (
                <>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Horarios ainda disponiveis neste dia — clique para selecionar:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {conflictError.alternatives.map((alt) => (
                      <button
                        key={alt}
                        type="button"
                        onClick={() => {
                          setTime(alt);
                          setConflictError(null);
                        }}
                        className="rounded-lg border border-gold/40 bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nenhum outro horario disponivel neste dia. Por favor, escolha outra data.
                </p>
              )}
            </div>
          )}

          {/* Botao de confirmacao */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold transition-all ${
              canSubmit
                ? "gradient-gold text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <Send size={20} />
            {isSubmitting ? "Verificando disponibilidade..." : "Confirmar agendamento no WhatsApp"}
          </button>

        </div>
      </div>
    </section>
  );
};

export default Scheduling;
