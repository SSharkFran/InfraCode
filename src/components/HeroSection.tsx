import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logoHorizontal from "@/assets/infracode-logo-horizontal.png";

const heroParticles = [
  { id: "p1", x: 8, y: 20, size: 5, duration: 7.2, delay: 0.1 },
  { id: "p2", x: 16, y: 58, size: 4, duration: 6.8, delay: 0.7 },
  { id: "p3", x: 27, y: 34, size: 6, duration: 7.9, delay: 1.4 },
  { id: "p4", x: 37, y: 69, size: 5, duration: 8.4, delay: 0.3 },
  { id: "p5", x: 46, y: 22, size: 4, duration: 6.3, delay: 1.2 },
  { id: "p6", x: 55, y: 64, size: 6, duration: 8.8, delay: 0.4 },
  { id: "p7", x: 64, y: 30, size: 4, duration: 7.1, delay: 1.9 },
  { id: "p8", x: 74, y: 52, size: 5, duration: 7.7, delay: 0.9 },
  { id: "p9", x: 83, y: 28, size: 6, duration: 8.1, delay: 0.6 },
  { id: "p10", x: 91, y: 62, size: 4, duration: 6.9, delay: 1.1 },
];

const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-brand-ink/[0.78]" />
      <div className="hero-aurora" aria-hidden />
      <div className="hero-grid-overlay" aria-hidden />
      <div className="hero-orb hero-orb--left" aria-hidden />
      <div className="hero-orb hero-orb--right" aria-hidden />
      <div className="hero-particles" aria-hidden>
        {heroParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="hero-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto text-center px-4 pt-28 md:pt-36 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55 }}
            className="mx-auto mb-5 w-[220px] h-[50px] sm:w-[300px] sm:h-[68px] md:w-[360px] md:h-[80px] lg:w-[420px] lg:h-[94px]"
          >
            <img
              src={logoHorizontal}
              alt="InfraCode - Seu projeto, nosso código"
              className="w-full h-full object-cover object-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/[0.16] border border-accent/35 rounded-full px-4 py-1.5 mb-8"
          >
            <Zap size={14} className="text-accent" />
            <span className="text-sm font-medium text-accent">Startup Acreana de Tecnologia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-balance text-4xl md:text-[3.35rem] lg:text-[4.8rem] font-heading font-bold text-primary-foreground leading-[1.02] mb-6 mx-auto max-w-5xl"
          >
            Transformamos ideias em
            <br className="hidden md:block" />
            <span className="text-accent"> soluções tecnológicas</span> inteligentes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto mb-10 font-light"
          >
            Desenvolvimento de software, plataformas digitais e automação de processos para impulsionar o seu negócio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#projetos"
              onClick={(e) => handleClick(e, "#projetos")}
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg text-base font-semibold hover:bg-brand-blue-strong transition-all hover:scale-105"
            >
              Ver ideias de projeto
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              onClick={(e) => handleClick(e, "#contato")}
              className="inline-flex items-center justify-center gap-2 border border-primary-foreground/35 text-primary-foreground px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-foreground/10 transition-all hover:scale-105"
            >
              <Code2 size={18} />
              Entre em contato
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#sobre"
        onClick={(e) => handleClick(e, "#sobre")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.2, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-primary-foreground/60 hover:text-accent transition-colors cursor-pointer"
      >
        <ChevronDown size={32} />
      </motion.a>
    </section>
  );
};

export default HeroSection;
