import type { MouseEvent } from "react";
import logoDark from "@/assets/infracode-logo-dark.png";
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
            <img src={logoDark} alt="InfraCode Tecnologia" className="h-20 md:h-24 mb-5 object-contain" />
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
