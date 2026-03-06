import { useEffect, useState, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Briefcase, MessageCircle, Calculator, Rocket, Users, Zap } from "lucide-react";

const commands = [
  {
    group: "Navegação",
    items: [
      { label: "Ver serviços", icon: Briefcase, action: "#servicos" },
      { label: "Cases de sucesso", icon: Rocket, action: "#projetos" },
      { label: "Nosso processo", icon: Zap, action: "#pipeline" },
      { label: "Sobre nós", icon: Users, action: "#sobre" },
    ],
  },
  {
    group: "Ferramentas",
    items: [
      { label: "Calcular ROI", icon: Calculator, action: "#roi" },
      { label: "Configurar projeto", icon: Briefcase, action: "#servicos" },
    ],
  },
  {
    group: "Contato",
    items: [
      { label: "Falar com o time", icon: MessageCircle, action: "#contato" },
    ],
  },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "/" && !isInputFocused()) {
        e.preventDefault();
        setOpen(true);
      }
    };

    const isInputFocused = () => {
      const active = document.activeElement;
      return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback((action: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(action);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar... (ex: serviços, ROI, contato)" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.label}
                value={item.label}
                onSelect={() => handleSelect(item.action)}
                className="cursor-pointer"
              >
                <item.icon size={16} className="mr-2 text-neon-blue/60" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
