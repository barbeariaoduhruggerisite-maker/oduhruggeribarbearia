import { motion } from "framer-motion";
import { serviceCategories } from "@/data/services";
import { buildWhatsAppLink } from "@/lib/contact";
import { fadeInUp, scaleIn, stagger, staggerSlow, viewport } from "@/lib/motion";

const Services = () => {
  const buildServiceMessage = (serviceName: string, price: string) =>
    [
      "Olá!",
      "",
      `Gostaria de agendar o serviço: ${serviceName}.`,
      `Valor: ${price}.`,
    ].join("\n");

  return (
    <section id="servicos" className="scroll-mt-24 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={stagger}
        >
          <motion.h2 variants={fadeInUp} className="mb-4 text-center text-3xl md:text-4xl">
            Serviços & <span className="text-gold">Valores</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Cada serviço é executado com precisão, técnica e atenção aos detalhes.
          </motion.p>
        </motion.div>

        <div className="space-y-12">
          {serviceCategories.map((category) => (
            <motion.div
              key={category.name}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerSlow}
            >
              <motion.h3
                variants={fadeInUp}
                className="mb-6 text-center font-display text-xl text-gold md:text-left"
              >
                {category.name}
              </motion.h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.services.map((service) => (
                  <motion.article
                    key={service.name}
                    variants={scaleIn}
                    whileHover={{ y: -4, transition: { duration: 0.18 } }}
                    className={`relative flex h-full flex-col justify-between rounded-xl border bg-card p-5 transition-colors hover:border-gold/40 ${
                      service.featured ? "border-primary/40" : "border-border"
                    }`}
                  >
                    {service.featured && (
                      <span className="absolute right-4 top-4 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Destaque
                      </span>
                    )}

                    <div className={service.featured ? "pr-20" : ""}>
                      <h4 className="mb-1 text-lg font-semibold text-foreground">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <span className="font-display text-2xl font-bold text-gold">{service.price}</span>
                      <a
                        href={buildWhatsAppLink(buildServiceMessage(service.name, service.price))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-gold hover:text-primary-foreground"
                      >
                        Agendar
                      </a>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-10 text-center text-sm text-muted-foreground"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeInUp}
        >
          Atendimento com horário marcado para melhor experiência.
        </motion.p>
      </div>
    </section>
  );
};

export default Services;
