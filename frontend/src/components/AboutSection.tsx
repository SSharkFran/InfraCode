import { motion } from "framer-motion";
import { Target, Lightbulb, Users } from "lucide-react";
import BuildLogChip from "./BuildLogChip";

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
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

const AboutSection = () => {
  return (
    <section id="sobre" className="section-padding relative overflow-hidden scroll-mt-24">
      <div className="section-divider mb-20" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Sobre Nós</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-6 tracking-display">
              Tecnologia que nasce no Acre e conecta o futuro
            </h2>
            <p className="text-white/50 leading-relaxed mb-4">
              A InfraCode Tecnologia nasceu no Acre com o propósito de criar soluções digitais modernas, eficientes e acessíveis, conectando tecnologia, inovação e impacto real.
            </p>
            <p className="text-white/50 leading-relaxed mb-4">
              Somos uma startup que acredita no poder da tecnologia para transformar negócios e comunidades. Desenvolvemos sistemas web, plataformas digitais e automações que simplificam processos e geram crescimento.
            </p>
            <p className="text-white/50 leading-relaxed mb-6">
              Nossa equipe combina conhecimento técnico com visão estratégica, entregando soluções sob medida que fazem a diferença.
            </p>
            <BuildLogChip label="TEAM_ACTIVE" status="success" />
          </motion.div>

          {/* Right: Value cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-4"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                className="flex gap-5 p-6 glass-card rounded-xl hover:shadow-[0_12px_30px_rgba(107,138,255,0.12)] transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                  <value.icon size={22} className="text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white mb-1">{value.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{value.description}</p>
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
