import { motion } from "framer-motion";
import clientHappy from "@/assets/client-happy.jpeg";
import team from "@/assets/team.jpeg";
import team2 from "@/assets/team-2.jpeg";
import { INSTAGRAM_REEL_URL } from "@/lib/contact";
import { fadeInUp, scaleIn, stagger, staggerSlow, viewport } from "@/lib/motion";

const images = [
  { src: clientHappy, alt: "Cliente satisfeito na ODuh Ruggeri" },
  { src: team, alt: "Equipe da barbearia ODuh Ruggeri" },
  { src: team2, alt: "Time completo da ODuh Ruggeri" },
];

const Gallery = () => (
  <section id="galeria" className="scroll-mt-24 py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={stagger}
      >
        <motion.h2 variants={fadeInUp} className="mb-4 text-center text-3xl md:text-4xl">
          Ambiente & <span className="text-gold">Clientes</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="mb-12 text-center text-muted-foreground">
          Conheça nosso espaço e a energia que faz a diferença.
        </motion.p>
      </motion.div>

      <motion.div
        className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={staggerSlow}
      >
        {images.map((image) => (
          <motion.div
            key={image.alt}
            variants={scaleIn}
            className="aspect-square overflow-hidden rounded-xl border border-border"
            whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mx-auto max-w-2xl"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeInUp}
      >
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            src="https://www.instagram.com/reel/Cr873oeJQSs/embed/"
            className="h-full w-full"
            loading="lazy"
            title="Vídeo ODuh Ruggeri"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex justify-center">
          <a
            href={INSTAGRAM_REEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold/40 hover:text-gold"
          >
            Assista nosso Reel no Instagram
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Gallery;
