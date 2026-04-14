import logo from "@/assets/logo.jpeg";
import { buildWhatsAppLink, GENERIC_WHATSAPP_MESSAGE, INSTAGRAM_URL } from "@/lib/contact";

const Footer = () => (
  <footer className="border-t border-border py-8 pb-24 md:pb-8">
    <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row md:pr-24">
      <div className="flex items-center gap-2">
        <img src={logo} alt="ODuh Ruggeri" className="h-8 w-8 rounded-full object-cover" />
        <span>© {new Date().getFullYear()} ODuh Ruggeri Barbearia & Visagismo</span>
      </div>

      <div className="flex items-center gap-4">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-gold">
          Instagram
        </a>
        <a
          href={buildWhatsAppLink(GENERIC_WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-gold"
        >
          WhatsApp
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
