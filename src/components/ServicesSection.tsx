import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Cpu, Workflow, Plug, Settings, Layers } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "Desenvolvimento Web",
    description: "Sistemas e aplicações web robustas, responsivas e escaláveis para o seu negócio.",
    details:
      "Projetamos e desenvolvemos plataformas web com foco em performance, SEO, segurança e experiência do usuário para desktop e mobile.",
    includes: ["Landing pages e sites institucionais", "Sistemas internos com login e permissões", "Painéis administrativos e relatórios"],
    benefit:
      "Você ganha uma base sólida para escalar seu canal digital sem depender de ferramentas limitadas.",
  },
  {
    icon: Layers,
    title: "Plataformas Digitais",
    description: "Plataformas completas e personalizadas que centralizam operações e dados.",
    details:
      "Criamos soluções unificadas para concentrar processos operacionais, dados e comunicação em um único ambiente.",
    includes: ["Arquitetura modular por etapas", "Controle de usuários e níveis de acesso", "Integração com banco de dados e APIs externas"],
    benefit:
      "Redução de retrabalho e mais controle sobre o fluxo da operação no dia a dia.",
  },
  {
    icon: Workflow,
    title: "Automação de Processos",
    description: "Automatize tarefas repetitivas e aumente a produtividade da sua equipe.",
    details:
      "Mapeamos rotinas manuais e implementamos automações para eliminar gargalos e diminuir erros humanos.",
    includes: ["Disparos automáticos por regras de negócio", "Integração entre planilhas, CRM e sistemas internos", "Alertas e notificações inteligentes"],
    benefit:
      "Sua equipe foca no que gera receita, enquanto as tarefas operacionais repetitivas rodam sozinhas.",
  },
  {
    icon: Plug,
    title: "APIs e Integrações",
    description: "Conecte sistemas, serviços e plataformas de forma segura e eficiente.",
    details:
      "Integramos ERPs, CRMs, gateways de pagamento e outras ferramentas para manter seus dados sincronizados.",
    includes: ["APIs REST com autenticação segura", "Webhooks e filas para processamento assíncrono", "Monitoramento de falhas de integração"],
    benefit:
      "Menos retrabalho manual e dados confiáveis circulando entre todas as áreas do negócio.",
  },
  {
    icon: Settings,
    title: "Soluções Personalizadas",
    description: "Software sob medida, projetado especificamente para resolver os seus desafios.",
    details:
      "Desenvolvemos produtos com regras, fluxos e interface adaptados à realidade da sua operação.",
    includes: ["Levantamento técnico e funcional", "Prototipação e validação antes do build completo", "Evolução contínua com base em métricas"],
    benefit:
      "Você recebe um sistema feito para o seu contexto, sem precisar adaptar o negócio a ferramentas genéricas.",
  },
  {
    icon: Cpu,
    title: "Projetos sob Demanda",
    description: "Da ideia à entrega: desenvolvemos projetos completos do zero ao deploy.",
    details:
      "Assumimos o ciclo completo do projeto: descoberta, planejamento, desenvolvimento, testes e publicação.",
    includes: ["Roadmap com prioridades e marcos", "Entrega iterativa por sprints", "Suporte no go-live e pós-lançamento"],
    benefit:
      "Mais previsibilidade na execução e um projeto entregue com qualidade técnica e visão de produto.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<(typeof services)[number] | null>(null);

  return (
    <section id="servicos" className="section-padding bg-secondary/70 scroll-mt-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Serviços</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-4">
            O que fazemos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos soluções tecnológicas completas para empresas que querem crescer com eficiência e inovação.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.button
              key={service.title}
              type="button"
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedService(service)}
              aria-label={`Ver detalhes de ${service.title}`}
              className="group p-8 bg-card/[0.96] rounded-xl border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_36px_rgba(123,156,255,0.22)] transition-shadow cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <service.icon size={28} className="text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Saiba mais
                <ArrowRight size={15} />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <Dialog open={Boolean(selectedService)} onOpenChange={(isOpen) => !isOpen && setSelectedService(null)}>
        <DialogContent className="max-w-xl border-white/10 bg-card/[0.98]">
          {selectedService ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl text-foreground">{selectedService.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground leading-relaxed">
                  {selectedService.details}
                </DialogDescription>
              </DialogHeader>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">O que entregamos</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {selectedService.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent/80 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 bg-secondary/60 border border-white/10 rounded-lg p-4">
                {selectedService.benefit}
              </p>

              <div className="flex justify-end pt-1">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" className="border border-white/10 px-5">
                    Fechar
                  </Button>
                </DialogClose>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServicesSection;
