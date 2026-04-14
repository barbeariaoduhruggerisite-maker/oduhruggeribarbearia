import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, GENERIC_WHATSAPP_MESSAGE } from "@/lib/contact";

const WhatsAppButton = () => (
  <a
    href={buildWhatsAppLink(GENERIC_WHATSAPP_MESSAGE)}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
    style={{ backgroundColor: "hsl(142 70% 49%)" }}
    aria-label="WhatsApp"
  >
    <MessageCircle className="text-primary-foreground" size={28} />
  </a>
);

export default WhatsAppButton;
