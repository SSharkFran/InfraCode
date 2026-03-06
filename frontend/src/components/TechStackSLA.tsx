import { motion } from "framer-motion";
import { Shield, Clock, Rocket, Zap, Server, Database, Cloud, Code2, Palette, GitBranch } from "lucide-react";

const techStack = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Code2 },
  { name: "Node.js", icon: Server },
  { name: "Python", icon: Code2 },
  { name: "PostgreSQL", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "AWS", icon: Cloud },
  { name: "Docker", icon: Server },
  { name: "Figma", icon: Palette },
  { name: "Git", icon: GitBranch },
];

const slaMetrics = [
  { icon: Shield, label: "Uptime", value: "99.9%", color: "text-neon-green" },
  { icon: Clock, label: "SLA de resposta", value: "< 1h", color: "text-neon-blue" },
  { icon: Rocket, label: "Continuous Deploy", value: "Ativo", color: "text-neon-purple" },
  { icon: Zap, label: "Performance", value: "A+", color: "text-neon-cyan" },
];

const TechStackSLA = () => {
  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Marquee tech stack */}
      <div className="relative mb-12">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["-0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-6 w-max"
          >
            {[...techStack, ...techStack].map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] whitespace-nowrap"
              >
                <tech.icon size={16} className="text-neon-blue/60" />
                <span className="text-sm font-medium text-white/50">{tech.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* SLA Metrics */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slaMetrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <metric.icon size={20} className={`${metric.color} mx-auto mb-2`} />
              <p className="text-xl font-bold text-white font-mono mb-1">{metric.value}</p>
              <p className="text-[11px] text-white/35 uppercase tracking-wider">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSLA;
