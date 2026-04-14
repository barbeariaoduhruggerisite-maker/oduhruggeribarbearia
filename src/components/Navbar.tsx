import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = open ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a
          href="#inicio"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("#inicio");
          }}
          className="flex items-center gap-2"
        >
          <img src={logo} alt="ODuh Ruggeri" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-lg text-foreground">ODuh Ruggeri</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => scrollTo(item.href)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => scrollTo("#agendamento")}
            className="gradient-gold rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Agendar
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="p-2 text-foreground md:hidden"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-b border-border bg-background/95 backdrop-blur-md md:hidden animate-fade-in">
          <div className="flex min-h-full flex-col gap-3 p-4">
            {navItems.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => scrollTo(item.href)}
                className="rounded-lg px-4 py-3 text-left text-base text-foreground transition-colors hover:bg-secondary"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => scrollTo("#agendamento")}
              className="gradient-gold mt-2 rounded-lg px-4 py-3 text-center text-base font-semibold text-primary-foreground"
            >
              Agendar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
