import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-primary/60" />

      <div className="relative z-10 container mx-auto text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-8"
          >
            <Zap size={14} className="text-accent" />
            <span className="text-sm font-medium text-accent">Startup Acreana de Tecnologia</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6"
          >
            Transformamos ideias em{" "}
            <span className="text-accent">soluções tecnológicas</span>{" "}
            inteligentes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-light"
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
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-lg text-base font-semibold hover:bg-orange-dark transition-all hover:scale-105"
            >
              Ver ideias de projeto
              <ArrowRight size={18} />
            </a>
            <a
              href="#contato"
              onClick={(e) => handleClick(e, "#contato")}
              className="inline-flex items-center justify-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-lg text-base font-semibold hover:bg-primary-foreground/10 transition-all hover:scale-105"
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
