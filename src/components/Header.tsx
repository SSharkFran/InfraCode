import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoNoBorder from "@/assets/logo-sem-bordao.png";

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Ideias & Cases", href: "#projetos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-ink/[0.94] backdrop-blur-md border-b border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
          : "bg-brand-ink/[0.58] backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 lg:h-24 px-4">
        <a
          href="#inicio"
          onClick={(e) => handleClick(e, "#inicio")}
          className={`flex items-center rounded-xl px-3 py-1.5 transition-all duration-300 ${
            scrolled
              ? "bg-white/[0.04] border border-white/15"
              : "bg-white/[0.03] border border-white/10"
          }`}
        >
          <div className="w-[136px] h-[30px] sm:w-[158px] sm:h-[35px] md:w-[198px] md:h-[44px] lg:w-[236px] lg:h-[52px]">
            <img
              src={logoNoBorder}
              alt="InfraCode Tecnologia"
              className={`w-full h-full object-cover object-center transition-all duration-300 ${
                scrolled
                  ? "drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)]"
                  : "drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]"
              }`}
            />
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors"
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#contato"
            onClick={(e) => handleClick(e, "#contato")}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-blue-strong transition-all hover:scale-105"
          >
            Fale Conosco
          </motion.a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
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
            className="md:hidden bg-brand-ink-soft/95 backdrop-blur-md border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col gap-4 px-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors"
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contato"
                className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-brand-blue-strong transition-colors"
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
