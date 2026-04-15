import { motion } from "framer-motion";
import { buildWhatsAppLink, GENERIC_WHATSAPP_MESSAGE } from "@/lib/contact";
import { fadeInUp, stagger, viewport } from "@/lib/motion";

const CtaFinal = () => (
  <section className="py-20">
    <div className="container mx-auto max-w-2xl px-4 text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp} className="mb-4 text-3xl md:text-4xl">
          Seu visual merece <span className="text-gold">atenção profissional.</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="mb-8 text-muted-foreground">
          Agende agora e tenha uma experiência premium na ODuh Ruggeri Barbearia & Visagismo.
        </motion.p>
        <motion.a
          href={buildWhatsAppLink(GENERIC_WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-gold inline-block rounded-lg px-8 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          variants={fadeInUp}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Agendar agora no WhatsApp
        </motion.a>
      </motion.div>
    </div>
  </section>
);

export default CtaFinal;
