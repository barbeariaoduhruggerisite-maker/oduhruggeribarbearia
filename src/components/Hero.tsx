import { m } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { fadeInUp, stagger, viewport } from "@/lib/motion";

const Hero = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background com parallax suave */}
      <m.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
      </m.div>

      {/* Conteudo com stagger */}
      <m.div
        className="relative z-10 container mx-auto max-w-3xl px-4 pt-16 text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <m.h1
          className="mb-6 text-4xl font-bold leading-tight md:text-6xl"
          variants={fadeInUp}
        >
          Eleve seu estilo com <span className="gradient-gold-text">precisão, técnica e identidade.</span>
        </m.h1>

        <m.p
          className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-xl"
          variants={fadeInUp}
        >
          Cortes personalizados, visagismo profissional e atendimento de alto padrão na Casa Verde.
        </m.p>

        <m.button
          onClick={() => scrollTo("#agendamento")}
          className="gradient-gold mx-auto w-full max-w-[21rem] rounded-lg px-6 py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:max-w-none md:px-8 md:py-4 md:text-lg"
          variants={fadeInUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Agende agora e transforme seu visual
        </m.button>
      </m.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce will-change-transform">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-gold pt-2">
          <div className="h-3 w-1.5 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
