import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Portal de Gestão Empresarial",
    description: "Plataforma web completa para gerenciamento de operações, equipes e indicadores de performance.",
    techs: ["React", "Node.js", "PostgreSQL"],
  },
  {
    name: "Sistema de Automação Comercial",
    description: "Solução integrada para controle de estoque, vendas e emissão de notas fiscais eletrônicas.",
    techs: ["TypeScript", "REST API", "Cloud"],
  },
  {
    name: "App de Agendamento Online",
    description: "Aplicação responsiva para agendamento de serviços com painel administrativo completo.",
    techs: ["React", "Supabase", "Tailwind CSS"],
  },
  {
    name: "Dashboard de Analytics",
    description: "Painel de dados em tempo real com visualizações interativas e relatórios automatizados.",
    techs: ["Next.js", "Chart.js", "API REST"],
  },
];

const ProjectsSection = () => {
  return (
    <section id="projetos" className="section-padding bg-background scroll-mt-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Portfólio</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            Projetos em destaque
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos projetos que desenvolvemos com excelência e dedicação.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-8 bg-card rounded-xl border border-border hover-lift overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] transition-all group-hover:bg-accent/10" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-heading font-semibold text-lg text-foreground">{project.name}</h3>
                  <ExternalLink size={18} className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
