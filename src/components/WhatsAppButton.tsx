import { MessageCircle } from "lucide-react";
import { m } from "framer-motion";
import { buildWhatsAppLink, GENERIC_WHATSAPP_MESSAGE } from "@/lib/contact";

const WhatsAppButton = () => (
  <m.a
    href={buildWhatsAppLink(GENERIC_WHATSAPP_MESSAGE)}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-whatsapp shadow-whatsapp fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full sm:bottom-6 sm:right-6"
    aria-label="WhatsApp"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.12 }}
    whileTap={{ scale: 0.93 }}
  >
    {/* Anel de pulse */}
    <m.span
      className="absolute inset-0 rounded-full bg-whatsapp"
      animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
    />
    <MessageCircle className="relative text-primary-foreground" size={28} />
  </m.a>
);

export default WhatsAppButton;
