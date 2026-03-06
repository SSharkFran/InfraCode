import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowRight, Lightbulb, Code2, TrendingUp, ExternalLink, Rocket } from "lucide-react";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";
import BuildLogChip from "./BuildLogChip";

/* ── Animated Metric ────────────────────────────────── */
function AnimatedMetric({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-center"
    >
      <p className="text-2xl md:text-3xl font-bold font-mono text-neon-blue">{value}</p>
      <p className="text-xs text-white/40 mt-1">{label}</p>
    </motion.div>
  );
}

/* ── Case Timeline ────────────────────────────────── */
const projectCases = [
  {
    name: "JurisPocket",
    problem: "Advogados perdiam horas buscando jurisprudência em múltiplas fontes desconectadas, sem padronização.",
    implementation: {
      stack: ["React", "Node.js", "PostgreSQL", "AI/NLP"],
      description: "Plataforma SaaS com busca inteligente, categorização automática e interface minimalista.",
    },
    results: [
      { value: "-60%", label: "Tempo de pesquisa" },
      { value: "+3x", label: "Produtividade" },
      { value: "99.9%", label: "Uptime" },
    ],
    tags: ["LegalTech", "SaaS", "Produção"],
  },
  {
    name: "Portal Interno Corporativo",
    problem: "Equipes usando planilhas e grupos de WhatsApp para gerenciar solicitações, sem rastreamento.",
    implementation: {
      stack: ["React", "FastAPI", "MongoDB", "Dashboards"],
      description: "Sistema web com fluxo de solicitações, kanban por time e dashboards de produtividade.",
    },
    results: [
      { value: "-40%", label: "Tempo de resposta" },
      { value: "+25%", label: "Eficiência" },
      { value: "0", label: "Solicitações perdidas" },
    ],
    tags: ["B2B", "Workflow", "Dashboard"],
  },
];

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const ProjectsSection = () => {
  const publicConfig = usePublicContactConfig();

  return (
    <section id="projetos" className="section-padding relative overflow-hidden scroll-mt-24">
      <div className="section-divider mb-20" />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Cases de Sucesso</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Impacto real, dados reais
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base">
            Veja como transformamos desafios em resultados mensuráveis para nossos clientes.
          </p>
        </motion.div>

        {/* Case Timeline Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {projectCases.map((project, pi) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: pi * 0.15 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Project name bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Rocket size={16} className="text-neon-blue" />
                  <h3 className="font-heading font-semibold text-white">{project.name}</h3>
                </div>
                <div className="flex gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium bg-neon-blue/10 text-neon-blue px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Three columns: Problem → Implementation → Results */}
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                {/* Problem */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Problema</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{project.problem}</p>
                </div>

                {/* Implementation */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 size={14} className="text-neon-cyan" />
                    <span className="text-xs font-semibold text-neon-cyan uppercase tracking-wider">Implementação</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-3">{project.implementation.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.implementation.stack.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono bg-white/[0.04] text-white/40 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-neon-green" />
                    <span className="text-xs font-semibold text-neon-green uppercase tracking-wider">Resultado</span>
                  </div>
                  <div className="flex justify-around">
                    {project.results.map((metric) => (
                      <AnimatedMetric key={metric.label} value={metric.value} label={metric.label} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#contato"
            onClick={(e) => handleClick(e, "#contato")}
            className="inline-flex items-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all"
          >
            Quero tirar minha ideia do papel
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
