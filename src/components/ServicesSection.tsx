import { motion } from "framer-motion";
import { Globe, Cpu, Workflow, Plug, Settings, Layers } from "lucide-react";

const services = [
  { icon: Globe, title: "Desenvolvimento Web", description: "Sistemas e aplicações web robustas, responsivas e escaláveis para o seu negócio." },
  { icon: Layers, title: "Plataformas Digitais", description: "Plataformas completas e personalizadas que centralizam operações e dados." },
  { icon: Workflow, title: "Automação de Processos", description: "Automatize tarefas repetitivas e aumente a produtividade da sua equipe." },
  { icon: Plug, title: "APIs e Integrações", description: "Conecte sistemas, serviços e plataformas de forma segura e eficiente." },
  { icon: Settings, title: "Soluções Personalizadas", description: "Software sob medida, projetado especificamente para resolver os seus desafios." },
  { icon: Cpu, title: "Projetos sob Demanda", description: "Da ideia à entrega: desenvolvemos projetos completos do zero ao deploy." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ServicesSection = () => {
  return (
    <section id="servicos" className="section-padding bg-secondary scroll-mt-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Serviços</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            O que fazemos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções tecnológicas completas para empresas que querem crescer com eficiência e inovação.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ scale: 1.04, y: -6 }}
              className="group p-8 bg-card rounded-xl border border-border shadow-sm hover:shadow-xl transition-shadow cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <service.icon size={28} className="text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
