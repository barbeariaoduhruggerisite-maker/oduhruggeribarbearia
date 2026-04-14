export const WHATSAPP_NUMBER = "5511948830502";
export const INSTAGRAM_URL = "https://instagram.com/oduhruggeribarbearia";
export const INSTAGRAM_REEL_URL = "https://www.instagram.com/reel/Cr873oeJQSs/";
export const ADDRESS_LABEL = "Av. Braz Leme, 743 – Casa Verde – São Paulo – SP";
export const EMAIL_ADDRESS = "oduhruggeribare@gmail.com";

const encodedAddress = encodeURIComponent(ADDRESS_LABEL);

export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
export const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
export const MAPS_PLACE_URL = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
export const GENERIC_WHATSAPP_MESSAGE = "Olá! Gostaria de agendar um horário.";

export const buildWhatsAppLink = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
