import { motion } from "framer-motion";
import { Search, Palette, Code, FlaskConical, Rocket, Activity } from "lucide-react";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import BuildLogChip from "./BuildLogChip";

const stages = [
  {
    icon: Search,
    label: "Discovery",
    description: "Entendemos o problema e o contexto do negócio.",
    log: "[REQUIREMENTS_MAPPED]",
    logStatus: "info" as const,
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
    borderColor: "border-neon-blue/20",
    glowColor: "shadow-[0_0_20px_rgba(107,138,255,0.2)]",
  },
  {
    icon: Palette,
    label: "Design",
    description: "Criamos protótipos e validamos com o cliente.",
    log: "[DESIGN_LOCKED]",
    logStatus: "success" as const,
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
    borderColor: "border-neon-purple/20",
    glowColor: "shadow-[0_0_20px_rgba(167,139,250,0.2)]",
  },
  {
    icon: Code,
    label: "Build",
    description: "Desenvolvimento ágil com entregas incrementais.",
    log: "[BUILD_PASSING]",
    logStatus: "success" as const,
    color: "text-neon-cyan",
    bgColor: "bg-neon-cyan/10",
    borderColor: "border-neon-cyan/20",
    glowColor: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
  },
  {
    icon: FlaskConical,
    label: "Test",
    description: "Testes automatizados e QA rigoroso.",
    log: "[TESTS_GREEN]",
    logStatus: "success" as const,
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
    borderColor: "border-neon-green/20",
    glowColor: "shadow-[0_0_20px_rgba(52,211,153,0.2)]",
  },
  {
    icon: Rocket,
    label: "Deploy",
    description: "Publicação com CI/CD e zero downtime.",
    log: "[DEPLOY_GREEN]",
    logStatus: "success" as const,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    glowColor: "shadow-[0_0_20px_rgba(251,191,36,0.2)]",
  },
  {
    icon: Activity,
    label: "Monitor",
    description: "Monitoramento contínuo e métricas em tempo real.",
    log: "[SLA_ACTIVE]",
    logStatus: "success" as const,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/20",
    glowColor: "shadow-[0_0_20px_rgba(251,113,133,0.2)]",
  },
];

const PipelineStage = ({ stage, index }: { stage: typeof stages[number]; index: number }) => {
  const { ref, inView } = useInViewOnce(0.4);

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
        className={`glass-card rounded-xl p-5 transition-all duration-500 ${
          inView ? stage.glowColor : ""
        }`}
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${stage.bgColor} flex items-center justify-center mb-3 border ${stage.borderColor}`}>
          <stage.icon size={18} className={stage.color} />
        </div>

        {/* Content */}
        <h3 className={`text-sm font-semibold font-heading mb-1 ${stage.color}`}>{stage.label}</h3>
        <p className="text-xs text-white/40 leading-relaxed mb-3">{stage.description}</p>

        {/* Log chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.4, duration: 0.3 }}
        >
          <BuildLogChip label={stage.log} status={stage.logStatus} className="!text-[9px]" />
        </motion.div>
      </motion.div>

      {/* Connector line (not for last) */}
      {index < stages.length - 1 && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.3, duration: 0.4 }}
          className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-white/15 to-transparent origin-left"
        />
      )}
    </div>
  );
};

const ProcessPipeline = () => {
  return (
    <section className="section-padding relative overflow-hidden">
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
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Nosso Processo</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Pipeline de entrega
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base">
            Cada projeto segue um pipeline estruturado — da descoberta ao monitoramento em produção.
          </p>
        </motion.div>

        {/* Pipeline grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stages.map((stage, index) => (
            <PipelineStage key={stage.label} stage={stage} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessPipeline;
