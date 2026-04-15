import { MapPin, Navigation } from "lucide-react";
import { m } from "framer-motion";
import { ADDRESS_LABEL, EMAIL_ADDRESS, INSTAGRAM_URL, MAPS_DIRECTIONS_URL, MAPS_EMBED_URL, MAPS_PLACE_URL } from "@/lib/contact";
import { fadeInUp, slideInLeft, slideInRight, stagger, viewport } from "@/lib/motion";

const Location = () => (
  <section id="localizacao" className="scroll-mt-24 py-20">
    <div className="container mx-auto px-4">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        <m.h2 variants={fadeInUp} className="mb-4 text-center text-3xl md:text-4xl">
          <span className="text-gold">Localização</span>
        </m.h2>
        <m.p variants={fadeInUp} className="mx-auto mb-10 max-w-xl text-center text-muted-foreground">
          Localização privilegiada na Zona Norte de São Paulo, com fácil acesso.
        </m.p>
      </m.div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        <m.div
          className="aspect-video overflow-hidden rounded-xl border border-border md:aspect-auto"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={slideInLeft}
        >
          <iframe
            title="Localização ODuh Ruggeri"
            src={MAPS_EMBED_URL}
            className="min-h-[280px] w-full h-full"
            loading="lazy"
            allowFullScreen
          />
        </m.div>

        <m.div
          className="flex flex-col justify-center rounded-xl border border-border bg-card p-6 md:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={slideInRight}
        >
          <div className="mb-6 flex items-start gap-3">
            <MapPin className="mt-1 flex-shrink-0 text-gold" size={22} />
            <div>
              <p className="text-lg font-semibold text-foreground">Av. Braz Leme, 743</p>
              <p className="text-muted-foreground">Casa Verde – São Paulo – SP</p>
            </div>
          </div>

          <div className="mb-6 space-y-3 text-sm text-muted-foreground">
            <p>📍 {ADDRESS_LABEL}</p>
            <p>📞 (11) 94883-0502</p>
            <p>📧 {EMAIL_ADDRESS}</p>
            <p>
              📸 <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">@oduhruggeribarbearia</a>
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-gold flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-center font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Navigation size={18} />
              Como chegar
            </a>

            <a
              href={MAPS_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              Abrir no Maps
            </a>
          </div>
        </m.div>
      </div>
    </div>
  </section>
);

export default Location;
