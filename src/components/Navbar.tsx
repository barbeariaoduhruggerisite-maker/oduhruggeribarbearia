import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpeg";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Horários", href: "#horarios" },
  { label: "Localização", href: "#localizacao" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : originalOverflow;
    return () => { document.body.style.overflow = originalOverflow; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-border backdrop-blur-md"
      style={{ backgroundColor: scrolled ? "hsl(var(--background)/0.97)" : "hsl(var(--background)/0.85)" }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a
          href="#inicio"
          onClick={(event) => { event.preventDefault(); scrollTo("#inicio"); }}
          className="flex items-center gap-2"
        >
          <motion.img
            src={logo}
            alt="ODuh Ruggeri"
            className="h-10 w-10 rounded-full object-cover"
            whileHover={{ rotate: 5, scale: 1.08 }}
            transition={{ duration: 0.2 }}
          />
          <span className="font-display text-lg text-foreground">ODuh Ruggeri</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item, i) => (
            <motion.button
              key={item.href}
              type="button"
              onClick={() => scrollTo(item.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
            >
              {item.label}
            </motion.button>
          ))}

          <motion.button
            type="button"
            onClick={() => scrollTo("#agendamento")}
            className="gradient-gold rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agendar
          </motion.button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="p-2 text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-b border-border bg-background/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex min-h-full flex-col gap-3 p-4">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  type="button"
                  onClick={() => scrollTo(item.href)}
                  className="rounded-lg px-4 py-3 text-left text-base text-foreground transition-colors hover:bg-secondary"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.button
                type="button"
                onClick={() => scrollTo("#agendamento")}
                className="gradient-gold mt-2 rounded-lg px-4 py-3 text-center text-base font-semibold text-primary-foreground"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                Agendar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
