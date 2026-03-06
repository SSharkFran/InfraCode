import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoNoBorder from "@/assets/logo-sem-bordao.png";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Cases", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

const HEADER_OFFSET_PX = 96;
const MOBILE_MENU_SCROLL_DELAY_MS = 180;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const section = document.querySelector<HTMLElement>(href);
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isOpen) {
      setIsOpen(false);
      window.setTimeout(() => scrollToSection(href), MOBILE_MENU_SCROLL_DELAY_MS);
      return;
    }
    scrollToSection(href);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <a
          href="#inicio"
          onClick={(e) => handleClick(e, "#inicio")}
          className="flex items-center"
        >
          <div className="w-[140px] h-[31px] sm:w-[160px] sm:h-[36px] md:w-[200px] md:h-[45px]">
            <img
              src={logoNoBorder}
              alt="InfraCode Tecnologia"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              {link.label}
            </motion.a>
          ))}

          {/* Ctrl+K hint */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-white/30 hover:text-white/50 hover:border-white/15 transition-all text-xs"
          >
            <Command size={12} />
            <span>K</span>
          </motion.button>

          <motion.a
            href="#contato"
            onClick={(e) => handleClick(e, "#contato")}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-neon-blue text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-neon-blue/90 transition-all hover:shadow-[0_4px_20px_rgba(107,138,255,0.3)] active:scale-[0.98]"
          >
            Fale Conosco
          </motion.a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col gap-3 px-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors py-1"
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contato"
                className="bg-neon-blue text-white px-5 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-neon-blue/90 transition-colors mt-1"
                onClick={(e) => handleClick(e, "#contato")}
              >
                Fale Conosco
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
