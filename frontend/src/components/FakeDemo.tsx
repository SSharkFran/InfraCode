import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BarChart3, Users, TrendingUp, Activity, Bell, Shield } from "lucide-react";
import BuildLogChip from "./BuildLogChip";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const miniCards = [
  {
    icon: BarChart3,
    title: "Analytics",
    value: "2.4k",
    change: "+12.5%",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
  },
  {
    icon: Users,
    title: "Usuários",
    value: "847",
    change: "+8.2%",
    color: "text-neon-green",
    bgColor: "bg-neon-green/10",
  },
  {
    icon: TrendingUp,
    title: "Conversão",
    value: "24.8%",
    change: "+3.1%",
    color: "text-neon-purple",
    bgColor: "bg-neon-purple/10",
  },
];

const chartBars = [35, 52, 41, 68, 55, 78, 62, 85, 72, 91, 80, 95];

const FakeDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const assembleY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);
  const assembleOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const assembleScale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);

  return (
    <section ref={containerRef} className="section-padding relative overflow-hidden">
      <div className="section-divider mb-20" />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Capacidade Técnica</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Do wireframe ao produto final
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base">
            Construímos interfaces modernas, dashboards inteligentes e sistemas escaláveis — do zero ao deploy.
          </p>
        </motion.div>

        {/* Demo Dashboard */}
        <motion.div
          style={reducedMotion ? {} : { y: assembleY, opacity: assembleOpacity, scale: assembleScale }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {/* Dashboard top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
                <span className="ml-3 text-xs font-mono text-white/30">dashboard.infracode.tech</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-white/30" />
                <Shield size={14} className="text-white/30" />
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {miniCards.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, duration: 0.5 }}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                      <card.icon size={16} className={card.color} />
                    </div>
                    <span className="text-xs text-white/40">{card.title}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white font-mono">{card.value}</span>
                    <span className="text-xs font-medium text-emerald-400">{card.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-neon-blue" />
                  <span className="text-xs font-medium text-white/50">Performance Mensal</span>
                </div>
                <BuildLogChip label="LIVE_DATA" status="success" className="!text-[9px]" />
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-1.5 h-32">
                {chartBars.map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-neon-blue/30 to-neon-blue/60 hover:to-neon-blue/80 transition-colors"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-white/25 font-mono">Jan</span>
                <span className="text-[10px] text-white/25 font-mono">Dez</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FakeDemo;
