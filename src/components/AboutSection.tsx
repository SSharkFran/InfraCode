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

const aboutParticles = [
  { id: "a1", x: 6, y: 18, size: 8, duration: 8.8, delay: 0.1 },
  { id: "a2", x: 14, y: 64, size: 6, duration: 7.6, delay: 0.7 },
  { id: "a3", x: 29, y: 28, size: 7, duration: 9.1, delay: 0.9 },
  { id: "a4", x: 38, y: 74, size: 5, duration: 8.4, delay: 1.1 },
  { id: "a5", x: 52, y: 19, size: 7, duration: 9.7, delay: 0.5 },
  { id: "a6", x: 66, y: 58, size: 6, duration: 8.1, delay: 1.4 },
  { id: "a7", x: 79, y: 33, size: 7, duration: 9.3, delay: 1.6 },
  { id: "a8", x: 91, y: 72, size: 5, duration: 7.9, delay: 0.3 },
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
      <div className="about-flow about-flow--top" aria-hidden />
      <div className="about-flow about-flow--bottom" aria-hidden />
      <div className="about-ambient about-ambient--left" aria-hidden />
      <div className="about-ambient about-ambient--right" aria-hidden />
      <div className="about-grid-overlay" aria-hidden />
      <div className="about-particles" aria-hidden>
        {aboutParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="about-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -14, 0], x: [0, 7, 0], opacity: [0.15, 0.48, 0.15] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>
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
