import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ExternalLink, Lightbulb, Rocket } from "lucide-react";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";

const projectIdeas = [
  {
    name: "Portal Interno para Equipes",
    description:
      "Centralize solicitações, tarefas e processos internos em uma única plataforma web personalizada.",
    techs: ["React", "Node.js", "PostgreSQL", "Dashboards"],
  },
  {
    name: "Sistema de Atendimento e Leads",
    description:
      "Estruture o funil comercial com formulário inteligente, automações e painel de acompanhamento.",
    techs: ["API", "Integrações", "Automação", "CRM"],
  },
  {
    name: "Aplicativo de Agendamento",
    description:
      "App ou web app para reservas, notificações e gestão de horários para equipes de atendimento.",
    techs: ["React", "Supabase", "Push", "Painel Admin"],
  },
  {
    name: "Dashboard de Indicadores",
    description:
      "Visualize métricas de vendas, operações e produtividade em tempo real com relatórios claros.",
    techs: ["Analytics", "APIs", "BI", "Alertas"],
  },
];

const ProjectsSection = () => {
  const publicConfig = usePublicContactConfig();

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
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Ideias & Cases
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            Recomendações de projetos para sua empresa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Em vez de portfólio fictício, mostramos aqui exemplos reais do que podemos construir
            para gerar resultado no seu negócio.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {projectIdeas.map((project, index) => (
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
                  <Lightbulb
                    size={18}
                    className="text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1"
                  />
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 p-8 md:p-10 bg-secondary rounded-2xl border border-border"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider mb-3">
                <CheckCircle2 size={16} />
                Projeto Finalizado em Destaque
              </span>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                JurisPocket
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Nosso primeiro case público em produção. Em vez de criar uma aba inteira com um
                único item, deixamos o JurisPocket em destaque e usamos esta seção para apresentar
                novas ideias que também podemos tirar do papel com você.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["LegalTech", "SaaS", "Web Platform", "Produção"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {publicConfig.jurisPocketUrl ? (
                  <a
                    href={publicConfig.jurisPocketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors"
                  >
                    Ver JurisPocket online
                    <ExternalLink size={16} />
                  </a>
                ) : null}
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-background transition-colors"
                >
                  Quero tirar minha ideia do papel
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="md:max-w-sm p-5 rounded-xl bg-card border border-border">
              <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Rocket size={20} className="text-accent" />
              </div>
              <h4 className="font-heading font-semibold text-foreground mb-2">Próximos cases</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Estamos abrindo novos projetos para compor o portfólio oficial da InfraCode em
                2026. Se quiser, o próximo case pode ser da sua empresa.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
