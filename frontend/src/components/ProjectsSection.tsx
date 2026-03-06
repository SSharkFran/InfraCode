import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ExternalLink, Lightbulb, Rocket } from "lucide-react";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const projectIdeas = [
  {
    name: "Portal Interno para Equipes",
    description:
      "Centralize solicitações, tarefas e processos internos em uma única plataforma web personalizada.",
    techs: ["React", "Node.js", "PostgreSQL", "Dashboards"],
    context:
      "Ideal para empresas que ainda concentram fluxo operacional em grupos de mensagem e planilhas desconectadas.",
    highlights: ["Abertura e acompanhamento de solicitações", "Kanban de tarefas por time", "Indicadores de SLA e produtividade"],
    expectedResult:
      "Padronizar processos internos e dar visibilidade em tempo real do que está parado, em andamento e concluído.",
  },
  {
    name: "Sistema de Atendimento e Leads",
    description:
      "Estruture o funil comercial com formulário inteligente, automações e painel de acompanhamento.",
    techs: ["API", "Integrações", "Automação", "CRM"],
    context:
      "Perfeito para operações comerciais que perdem oportunidades por falta de organização entre marketing e vendas.",
    highlights: ["Captação qualificada com regras por perfil", "Distribuição automática de leads para vendedores", "Histórico completo por contato e etapa"],
    expectedResult:
      "Aumentar taxa de conversão e reduzir tempo de resposta para novos leads com processo comercial rastreável.",
  },
  {
    name: "Aplicativo de Agendamento",
    description:
      "App ou web app para reservas, notificações e gestão de horários para equipes de atendimento.",
    techs: ["React", "Supabase", "Push", "Painel Admin"],
    context:
      "Recomendado para clínicas, salões, consultorias e serviços recorrentes com alto volume de marcações.",
    highlights: ["Agenda em tempo real com bloqueios automáticos", "Lembretes por WhatsApp, e-mail ou push", "Regras de cancelamento e remarcação"],
    expectedResult:
      "Menos faltas, melhor ocupação da agenda e experiência mais simples para clientes e equipe.",
  },
  {
    name: "Dashboard de Indicadores",
    description:
      "Visualize métricas de vendas, operações e produtividade em tempo real com relatórios claros.",
    techs: ["Analytics", "APIs", "BI", "Alertas"],
    context:
      "Para times que tomam decisões com dados atrasados ou dispersos em várias fontes.",
    highlights: ["Consolidação automática de múltiplas fontes", "Métricas por área com metas e evolução", "Alertas por variação crítica de indicador"],
    expectedResult:
      "Decisão mais rápida e previsível baseada em indicadores atualizados e fáceis de interpretar.",
  },
];

const ProjectsSection = () => {
  const publicConfig = usePublicContactConfig();
  const [selectedProject, setSelectedProject] = useState<(typeof projectIdeas)[number] | null>(null);

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
            <motion.button
              key={project.name}
              type="button"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedProject(project)}
              aria-label={`Ver explicação completa da ideia ${project.name}`}
              className="group relative p-8 bg-card/[0.96] rounded-xl border border-white/10 hover-lift overflow-hidden text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent mt-5">
                  Ver explicação completa
                  <ArrowRight size={15} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-10 p-8 md:p-10 bg-secondary/70 rounded-2xl border border-white/10"
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
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-blue-strong transition-colors"
                  >
                    Ver JurisPocket online
                    <ExternalLink size={16} />
                  </a>
                ) : null}
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 border border-white/15 text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-card transition-colors"
                >
                  Quero tirar minha ideia do papel
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="md:max-w-sm p-5 rounded-xl bg-card/[0.96] border border-white/10">
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

      <Dialog open={Boolean(selectedProject)} onOpenChange={(isOpen) => !isOpen && setSelectedProject(null)}>
        <DialogContent className="max-w-xl border-white/10 bg-card/[0.98]">
          {selectedProject ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl text-foreground">{selectedProject.name}</DialogTitle>
                <DialogDescription className="text-muted-foreground leading-relaxed">
                  {selectedProject.context}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                {selectedProject.techs.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">Escopo sugerido</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedProject.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/80 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 bg-secondary/60 border border-white/10 rounded-lg p-4">
                {selectedProject.expectedResult}
              </p>

              <div className="flex justify-end pt-1">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="border border-white/10 px-5">
                    Fechar
                  </Button>
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsSection;
