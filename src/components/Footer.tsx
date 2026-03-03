import type { MouseEvent } from "react";
import logoForDarkBg from "@/assets/infracode-logo-dark.png";
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
    <footer className="bg-primary text-primary-foreground py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-10 items-start mb-12">
          <div>
            <div className="inline-flex rounded-lg px-2 py-1 bg-primary-foreground/5 border border-primary-foreground/10 mb-5">
              <img
                src={logoForDarkBg}
                alt="InfraCode Tecnologia"
                className="h-20 md:h-32 lg:h-36 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
              />
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Startup acreana focada em criar soluções digitais modernas, eficientes e acessíveis.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-primary-foreground/80">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
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
                  className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
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
              <p className="text-sm text-primary-foreground/60 mb-1">
                {publicConfig.contactEmail}
              </p>
            )}
            {publicConfig.instagramUrl && (
              <a
                href={publicConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-foreground/60 hover:text-accent transition-colors mb-1 inline-block"
              >
                Instagram
              </a>
            )}
            <p className="text-sm text-primary-foreground/60">Rio Branco, Acre — Brasil</p>
            <p className="text-sm text-primary-foreground/60">CNPJ: 65.389.435/0001-15</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">
            © {year} InfraCode Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
