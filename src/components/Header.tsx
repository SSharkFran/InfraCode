import { useState, useEffect, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoForLightBg from "@/assets/infracode-logo-light.png";
import logoForDarkBg from "@/assets/infracode-logo-dark.png";

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

  const logoSrc = scrolled ? logoForLightBg : logoForDarkBg;
  const logoContainerClass = scrolled
    ? "bg-card/90 border border-border/80 shadow-sm"
    : "bg-primary/40 border border-primary-foreground/15 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-24 lg:h-28 px-4">
        <a
          href="#inicio"
          onClick={(e) => handleClick(e, "#inicio")}
          className={`flex items-center rounded-lg px-2 py-1 transition-all duration-300 ${logoContainerClass}`}
        >
          <img
            src={logoSrc}
            alt="InfraCode Tecnologia"
            className={`h-10 md:h-14 lg:h-16 object-contain transition-all duration-300 ${
              scrolled
                ? "drop-shadow-[0_3px_8px_rgba(15,23,42,0.2)]"
                : "drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]"
            }`}
          />
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
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-muted-foreground hover:text-accent" : "text-primary-foreground/80 hover:text-accent"
              }`}
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
            className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-all hover:scale-105"
          >
            Fale Conosco
          </motion.a>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
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
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col gap-4 px-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contato"
                className="bg-accent text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold text-center"
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
