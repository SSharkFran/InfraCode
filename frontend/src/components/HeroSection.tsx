import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code2, Zap, ChevronDown, Terminal, Wifi, Shield } from "lucide-react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import BuildLogChip from "./BuildLogChip";
import logoHorizontal from "@/assets/infracode-logo-horizontal.png";

const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* ── Magnetic Button Wrapper ──────────────────────── */
const MagneticButton = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className: string;
}) => {
  const { ref, handleMouseMove, handleMouseLeave } = useMagnetic();
  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onClick={(e) => handleClick(e, href)}
      onMouseMove={handleMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ willChange: "transform" }}
    >
      {children}
    </a>
  );
};

/* ── Procedural Server Element ────────────────────── */
const PremiumServerVisual = () => (
  <div className="relative w-full max-w-[380px] mx-auto">
    {/* Glow behind */}
    <div className="absolute inset-0 bg-neon-blue/10 rounded-3xl blur-3xl scale-110" />

    {/* Main card - Server representation */}
    <div className="relative glass-card rounded-2xl p-6 border border-white/10">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        <span className="w-3 h-3 rounded-full bg-amber-400/60" />
        <span className="w-3 h-3 rounded-full bg-white/20" />
        <span className="ml-auto text-[10px] font-mono text-white/40 tracking-wider">INFRACODE.PROD</span>
      </div>

      {/* Terminal lines */}
      <div className="space-y-2.5 font-mono text-xs">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="flex items-center gap-2"
        >
          <Terminal size={12} className="text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-400">$</span>
          <span className="text-white/70">deploy --production</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.3 }}
          className="text-white/40 pl-5"
        >
          Building optimized bundle...
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.3 }}
          className="flex items-center gap-2 pl-5"
        >
          <span className="text-emerald-400">✓</span>
          <span className="text-white/60">Compiled successfully in 2.3s</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.3 }}
          className="flex items-center gap-2 pl-5"
        >
          <span className="text-neon-blue">→</span>
          <span className="text-white/60">Deploying to edge network...</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.3 }}
          className="flex items-center gap-2 pl-5"
        >
          <span className="text-emerald-400">✓</span>
          <span className="text-emerald-400/80">Live at infracode.tech</span>
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi size={11} className="text-emerald-400" />
            <span className="text-[10px] text-white/40 font-mono">99.9%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={11} className="text-neon-blue" />
            <span className="text-[10px] text-white/40 font-mono">SSL</span>
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
        />
      </div>
    </div>

    {/* Floating chips */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{ delay: 3, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      className="absolute -top-3 -right-3"
    >
      <BuildLogChip label="DEPLOY_GREEN" status="success" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -4, 0] }}
      transition={{ delay: 3.4, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      className="absolute -bottom-2 -left-2"
    >
      <BuildLogChip label="API_READY" status="info" />
    </motion.div>
  </div>
);

/* ── Hero Section ─────────────────────────────────── */
const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const mouse = useMousePosition(containerRef as React.RefObject<HTMLElement>);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="inicio"
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Procedural grid background */}
      <div
        className="hero-grid-bg"
        style={
          reducedMotion
            ? {}
            : {
                maskImage: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, black 10%, transparent 70%)`,
                WebkitMaskImage: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, black 10%, transparent 70%)`,
              }
        }
      />

      {/* Ambient glows */}
      <div
        className="hero-glow w-[600px] h-[600px] -top-20 -left-40 bg-neon-blue/[0.08]"
        style={
          reducedMotion
            ? {}
            : {
                transform: `translate(${mouse.normalizedX * 20}px, ${mouse.normalizedY * 20}px)`,
                transition: "transform 0.6s ease-out",
              }
        }
      />
      <div
        className="hero-glow w-[400px] h-[400px] -bottom-20 -right-20 bg-neon-purple/[0.06]"
        style={
          reducedMotion
            ? {}
            : {
                transform: `translate(${-mouse.normalizedX * 15}px, ${-mouse.normalizedY * 15}px)`,
                transition: "transform 0.8s ease-out",
              }
        }
      />

      {/* Main content */}
      <motion.div
        style={reducedMotion ? {} : { y: yParallax, opacity: opacityFade }}
        className="relative z-10 container mx-auto px-4 pt-28 md:pt-36 pb-20 md:pb-28"
      >
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <img
                src={logoHorizontal}
                alt="InfraCode"
                className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain mx-auto lg:mx-0 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-neon-blue/[0.08] border border-neon-blue/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Zap size={13} className="text-neon-blue" />
              <span className="text-xs font-medium text-neon-blue tracking-wide">Startup Acreana de Tecnologia</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4.2rem] font-heading font-bold text-white leading-[1.05] tracking-display mb-6"
            >
              Transformamos ideias em{" "}
              <span className="text-gradient-accent">soluções tecnológicas</span> inteligentes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-base md:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Desenvolvimento de software, plataformas digitais e automação de processos para impulsionar o seu negócio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <MagneticButton
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 bg-neon-blue text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neon-blue/90 transition-all hover:shadow-[0_8px_30px_rgba(107,138,255,0.35)] active:scale-[0.98]"
              >
                Ver serviços
                <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton
                href="#contato"
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all active:scale-[0.98]"
              >
                <Code2 size={16} />
                Entre em contato
              </MagneticButton>
            </motion.div>

            {/* Build Log Chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start"
            >
              <BuildLogChip label="DESIGN_LOCKED" status="success" delay={1.6} />
              <BuildLogChip label="STACK_READY" status="info" delay={1.9} />
            </motion.div>
          </div>

          {/* Right: Premium Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hidden lg:block"
          >
            <PremiumServerVisual />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#sobre"
        onClick={(e) => handleClick(e, "#sobre")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/30 hover:text-neon-blue transition-colors cursor-pointer"
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
};

export default HeroSection;
