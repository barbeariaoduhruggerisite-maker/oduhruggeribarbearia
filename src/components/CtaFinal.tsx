import { buildWhatsAppLink, GENERIC_WHATSAPP_MESSAGE } from "@/lib/contact";

const CtaFinal = () => (
  <section className="py-20">
    <div className="container mx-auto max-w-2xl px-4 text-center">
      <h2 className="mb-4 text-3xl md:text-4xl">
        Seu visual merece <span className="text-gold">atenção profissional.</span>
      </h2>
      <p className="mb-8 text-muted-foreground">
        Agende agora e tenha uma experiência premium na ODuh Ruggeri Barbearia & Visagismo.
      </p>
      <a
        href={buildWhatsAppLink(GENERIC_WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="gradient-gold inline-block rounded-lg px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Agendar agora no WhatsApp
      </a>
    </div>
  </section>
);

export default CtaFinal;
