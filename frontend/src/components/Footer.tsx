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
    <footer className="bg-brand-ink text-primary-foreground py-16 px-4">
      <div className="container mx-auto">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.9fr_0.9fr] md:gap-8 lg:gap-12 items-start mb-12">
          <div className="max-w-sm">
            <div className="inline-flex rounded-xl px-3 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 mb-5">
              <div className="w-[210px] h-[47px] sm:w-[250px] sm:h-[56px] lg:w-[290px] lg:h-[65px]">
                <img
                  src={logoBrand}
                  alt="InfraCode Tecnologia"
                  className="w-full h-full object-cover object-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                />
              </div>
            </div>
            <p className="text-primary-foreground/65 text-sm leading-relaxed max-w-xs">
              Startup acreana focada em criar soluções digitais modernas, eficientes e acessíveis.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-primary-foreground/80">
              Navegação
            </h4>
            <nav className="grid gap-2.5 md:max-w-[190px]">
              {[
                { label: "Início", href: "#inicio" },
                { label: "Sobre", href: "#sobre" },
                { label: "Serviços", href: "#servicos" },
                { label: "Ideias & Cases", href: "#projetos" },
                { label: "Diferenciais", href: "#diferenciais" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm text-primary-foreground/65 hover:text-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-primary-foreground/80">
              Contato
            </h4>
            {publicConfig.contactEmail && (
              <a
                href={`mailto:${publicConfig.contactEmail}`}
                className="block text-sm text-primary-foreground/65 hover:text-accent transition-colors mb-2"
              >
                {publicConfig.contactEmail}
              </a>
            )}
            {publicConfig.whatsappUrl && (
              <a
                href={publicConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary-foreground/65 hover:text-accent transition-colors mb-2"
              >
                WhatsApp
              </a>
            )}
            {publicConfig.instagramUrl && (
              <a
                href={publicConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary-foreground/65 hover:text-accent transition-colors mb-2"
              >
                Instagram
              </a>
            )}
            <p className="text-sm text-primary-foreground/65">Rio Branco, Acre — Brasil</p>
            <p className="text-sm text-primary-foreground/65 mt-2">CNPJ: 65.389.435/0001-15</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            © {year} InfraCode Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
