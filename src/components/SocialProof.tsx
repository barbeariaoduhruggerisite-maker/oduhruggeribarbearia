import { Star, Quote } from "lucide-react";
import { m } from "framer-motion";
import { fadeInUp, scaleIn, stagger, viewport } from "@/lib/motion";

const SocialProof = () => (
  <section className="py-20 bg-secondary">
    <div className="container mx-auto px-4 text-center">
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        <m.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display mb-4">
          Reconhecimento & <span className="text-gold">Confiança</span>
        </m.h2>
        <m.p variants={fadeInUp} className="text-muted-foreground mb-10 max-w-xl mx-auto">
          Clientes satisfeitos e reconhecimento crescente na região.
        </m.p>

        <m.div
          variants={scaleIn}
          className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-10 relative"
        >
          <Quote className="text-gold/20 absolute top-4 left-4" size={48} />
          <m.div
            className="flex justify-center gap-1 mb-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {[...Array(5)].map((_, i) => (
              <m.span
                key={i}
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: i * 0.07 } },
                }}
              >
                <Star className="text-gold fill-gold" size={20} />
              </m.span>
            ))}
          </m.div>
          <p className="text-lg md:text-xl text-foreground font-display italic mb-4">
            "A barbearia já recebeu nomes conhecidos como o humorista Thiago Ventura."
          </p>
          <p className="text-sm text-muted-foreground">
            Referência em estilo e atendimento na Casa Verde, SP.
          </p>
        </m.div>
      </m.div>
    </div>
  </section>
);

export default SocialProof;
