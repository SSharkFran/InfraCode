import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Calculator, Clock, DollarSign, ArrowRight, TrendingDown } from "lucide-react";
import BuildLogChip from "./BuildLogChip";

const HOURLY_COST = 45; // R$ per hour average
const WEEKS_PER_YEAR = 48;

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1.2 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, inView, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}{displayed.toLocaleString("pt-BR")}{suffix}
    </span>
  );
}

const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const RoiCalculator = () => {
  const [hours, setHours] = useState(10);

  const hoursSavedYear = hours * WEEKS_PER_YEAR;
  const moneySaved = hoursSavedYear * HOURLY_COST;
  const automationRate = Math.min(95, Math.round(60 + hours * 1.5));

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
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">ROI Calculator</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Quanto você economiza com automação?
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base">
            Mova o slider e veja o impacto real de automatizar processos manuais.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Slider section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-6 md:p-8 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                <Clock size={20} className="text-neon-blue" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Horas perdidas por semana</p>
                <p className="text-xs text-white/40">Com processos manuais e repetitivos</p>
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type="range"
                min="1"
                max="40"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6B8AFF ${(hours / 40) * 100}%, rgba(255,255,255,0.08) ${(hours / 40) * 100}%)`,
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #6B8AFF;
                  box-shadow: 0 0 16px rgba(107,138,255,0.5);
                  cursor: pointer;
                  border: 3px solid rgba(255,255,255,0.2);
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #6B8AFF;
                  box-shadow: 0 0 16px rgba(107,138,255,0.5);
                  cursor: pointer;
                  border: 3px solid rgba(255,255,255,0.2);
                }
              `}</style>
            </div>

            <div className="flex justify-between text-xs text-white/30 font-mono">
              <span>1h/semana</span>
              <span className="text-neon-blue font-semibold text-lg">{hours}h/semana</span>
              <span>40h/semana</span>
            </div>
          </motion.div>

          {/* Results */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <Clock size={20} className="text-neon-cyan mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                <AnimatedNumber value={hoursSavedYear} suffix="h" />
              </p>
              <p className="text-xs text-white/40">Horas salvas por ano</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <DollarSign size={20} className="text-neon-green mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                <AnimatedNumber value={moneySaved} prefix="R$ " />
              </p>
              <p className="text-xs text-white/40">Economia estimada/ano</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="glass-card rounded-xl p-5 text-center"
            >
              <TrendingDown size={20} className="text-neon-purple mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                <AnimatedNumber value={automationRate} suffix="%" />
              </p>
              <p className="text-xs text-white/40">Taxa de automação</p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <a
              href="#contato"
              onClick={(e) => handleClick(e, "#contato")}
              className="inline-flex items-center gap-2 bg-neon-blue text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neon-blue/90 transition-all hover:shadow-[0_8px_30px_rgba(107,138,255,0.3)] active:scale-[0.98]"
            >
              Quero automatizar meu negócio
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RoiCalculator;
