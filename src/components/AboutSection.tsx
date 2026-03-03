import { motion } from "framer-motion";
import { Target, Lightbulb, Users } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Inovação",
    description: "Buscamos constantemente novas formas de resolver problemas com tecnologia de ponta.",
  },
  {
    icon: Target,
    title: "Foco em Resultados",
    description: "Cada solução é projetada para gerar impacto real e mensurável no seu negócio.",
  },
  {
    icon: Users,
    title: "Proximidade",
    description: "Trabalhamos lado a lado com nossos clientes, entendendo suas necessidades reais.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const AboutSection = () => {
  return (
    <section id="sobre" className="about-section section-padding bg-background scroll-mt-24 relative overflow-hidden">
      <div className="about-divider" aria-hidden />
      <div className="about-ambient about-ambient--left" aria-hidden />
      <div className="about-ambient about-ambient--right" aria-hidden />
      <div className="about-grid-overlay" aria-hidden />
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-accent font-semibold text-sm uppercase tracking-wider"
            >
              Sobre Nós
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-6">
              Tecnologia que nasce no Acre e conecta o futuro
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A InfraCode Tecnologia nasceu no Acre com o propósito de criar soluções digitais modernas, eficientes e acessíveis, conectando tecnologia, inovação e impacto real.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Somos uma startup que acredita no poder da tecnologia para transformar negócios e comunidades. Desenvolvemos sistemas web, plataformas digitais e automações que simplificam processos e geram crescimento.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa equipe combina conhecimento técnico com visão estratégica, entregando soluções sob medida que fazem a diferença.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                className="flex gap-5 p-6 bg-card rounded-xl border border-border shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <value.icon size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
