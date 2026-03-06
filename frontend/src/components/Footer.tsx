import type { MouseEvent } from "react";
import logoBrand from "@/assets/logo-sem-bordao.png";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";

const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

const Footer = () => {
  const year = new Date().getFullYear();
  const publicConfig = usePublicContactConfig();

  return (
    <footer className="relative py-16 px-4 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.9fr_0.9fr] md:gap-8 lg:gap-12 items-start mb-12">
          <div className="max-w-sm">
            <div className="inline-flex rounded-xl px-3 py-1.5 bg-white/[0.03] border border-white/8 mb-5">
              <div className="w-[210px] h-[47px] sm:w-[250px] sm:h-[56px] lg:w-[290px] lg:h-[65px]">
                <img
                  src={logoBrand}
                  alt="InfraCode Tecnologia"
                  className="w-full h-full object-cover object-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                />
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Startup acreana focada em criar soluções digitais modernas, eficientes e acessíveis.
            </p>
            <p className="text-white/20 text-xs mt-3 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-white/40">Ctrl+K</kbd> para navegar rápido
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-xs mb-4 uppercase tracking-widest text-white/40">
              Navegação
            </h4>
            <nav className="grid gap-2.5 md:max-w-[190px]">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Sobre", href: "#sobre" },
                { label: "Serviços", href: "#servicos" },
                { label: "Cases", href: "#projetos" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm text-white/35 hover:text-neon-blue transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-xs mb-4 uppercase tracking-widest text-white/40">
              Contato
            </h4>
            {publicConfig.contactEmail && (
              <a
                href={`mailto:${publicConfig.contactEmail}`}
                className="block text-sm text-white/35 hover:text-neon-blue transition-colors mb-2"
              >
                {publicConfig.contactEmail}
              </a>
            )}
            {publicConfig.whatsappUrl && (
              <a
                href={publicConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/35 hover:text-neon-blue transition-colors mb-2"
              >
                WhatsApp
              </a>
            )}
            {publicConfig.instagramUrl && (
              <a
                href={publicConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-white/35 hover:text-neon-blue transition-colors mb-2"
              >
                Instagram
              </a>
            )}
            <p className="text-sm text-white/35">Rio Branco, Acre — Brasil</p>
            <p className="text-sm text-white/35 mt-2">CNPJ: 65.389.435/0001-15</p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-white/25">
            © {year} InfraCode Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
