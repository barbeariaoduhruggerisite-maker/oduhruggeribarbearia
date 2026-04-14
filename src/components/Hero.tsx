import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 container mx-auto max-w-3xl px-4 pt-16 text-center">
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
          Eleve seu estilo com <span className="gradient-gold-text">precisão, técnica e identidade.</span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-xl">
          Cortes personalizados, visagismo profissional e atendimento de alto padrão na Casa Verde.
        </p>

        <button
          onClick={() => scrollTo("#agendamento")}
          className="gradient-gold mx-auto w-full max-w-[21rem] rounded-lg px-6 py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto sm:max-w-none md:px-8 md:py-4 md:text-lg"
        >
          Agende agora e transforme seu visual
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce will-change-transform">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-gold pt-2">
          <div className="h-3 w-1.5 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
