export type Service = {
  name: string;
  price: string;
  description: string;
  featured?: boolean;
};

export type ServiceCategory = {
  name: string;
  services: Service[];
};

export const SCHEDULING_PREFILL_EVENT = "schedule-service-prefill";

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Cabelo",
    services: [
      { name: "Corte Masculino", price: "R$80,00", description: "Higienização e secagem" },
      { name: "Corte com Visagismo", price: "R$200,00", description: "Visual harmonioso baseado no formato do rosto" },
      { name: "Consultoria de Visagismo", price: "R$700,00", description: "Análise completa de estética e identidade" },
      { name: "Corte + Sobrancelhas", price: "R$100,00", description: "Corte de cabelo e sobrancelhas" },
      { name: "Corte raspado", price: "R$50,00", description: "Raspagem com acabamento uniforme" },
      { name: "Coloração / Tonalização", price: "R$80,00", description: "Tintura com produtos profissionais" },
      { name: "Hidratação", price: "R$60,00", description: "Tratamento capilar hidratante" },
      { name: "Botox Capilar", price: "a partir de R$150,00", description: "Reconstrução e brilho" },
      { name: "Luzes", price: "a partir de R$150,00", description: "Reflexos e mechas" },
      { name: "Platinado", price: "a partir de R$200,00", description: "Descoloração global" },
      { name: "Progressiva", price: "a partir de R$150,00", description: "Selagem e alisamento" },
      { name: "Relaxamento", price: "R$60,00", description: "Alisa o cabelo de forma suave" },
      { name: "Corte & Relaxamento", price: "R$130,00", description: "Combo completo de corte e relaxamento" },
      { name: "Camuflagem de Brancos", price: "Consultar", description: "Cobertura dos fios brancos sem tintura total" },
    ],
  },
  {
    name: "Barba e Bigode",
    services: [
      { name: "Barba", price: "R$80,00", description: "Barba desenhada com acabamento premium" },
      { name: "Barba + Sobrancelhas", price: "R$100,00", description: "Barba com limpeza das sobrancelhas" },
      { name: "Barba com Máquina", price: "R$50,00", description: "Aparar com máquina elétrica" },
      { name: "Barboterapia", price: "R$85,00", description: "Creme esfoliante, toalha quente e massagem facial" },
      { name: "Barboterapia + Combo Cera", price: "R$130,00", description: "Barboterapia com depilação de nariz e ouvido" },
      { name: "Barboterapia + Sobrancelhas", price: "R$100,00", description: "Barboterapia com limpeza das sobrancelhas" },
      { name: "Barboterapia + Sobr. + Cera", price: "R$150,00", description: "Barboterapia completa com depilação" },
      { name: "Barba e Cabelo", price: "R$130,00", description: "Combo estratégico para visual completo", featured: true },
      { name: "Corte e Barba + Sobrancelhas", price: "R$170,00", description: "Combo completo com sobrancelhas" },
      { name: "Cabelo + Cera Ouvido/Nariz", price: "R$150,00", description: "Corte com depilação" },
      { name: "Acabamento", price: "R$40,00", description: "Ajuste rápido para manter o visual em dia" },
    ],
  },
  {
    name: "Estética & Bem-estar",
    services: [
      { name: "Sobrancelhas", price: "R$40,00", description: "Modelagem precisa para harmonizar o rosto" },
      { name: "Cera (Ouvido, Nariz)", price: "R$40,00", description: "Depilação prática com acabamento limpo" },
      { name: "Depilação Combo Ouvido + Nariz", price: "R$80,00", description: "Depilação com cera quente" },
      { name: "Depilação Nariz ou Ouvido", price: "R$50,00", description: "Depilação com cera quente" },
      { name: "Massagem Terapêutica", price: "R$180,00", description: "Alívio de tensões e dores" },
      { name: "Massagem Relaxante", price: "R$180,00", description: "Relaxamento profundo" },
      { name: "Drenagem Linfática", price: "R$180,00", description: "Redução de inchaço e toxinas" },
    ],
  },
];

export const allServices = serviceCategories.flatMap((category) => category.services);

export const getServiceByName = (name: string) => allServices.find((service) => service.name === name) ?? null;
