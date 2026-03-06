import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Cpu, Workflow, Plug, Check, ArrowRight, X, MessageCircle, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import BuildLogChip from "./BuildLogChip";

/* ── Data ──────────────────────────────────────────── */
const serviceTypes = [
  { id: "landing", label: "Landing Page", icon: Globe, baseWeeks: 1, basePrice: 2000 },
  { id: "webapp", label: "Sistema Web", icon: Cpu, baseWeeks: 4, basePrice: 8000 },
  { id: "api", label: "API / Backend", icon: Plug, baseWeeks: 3, basePrice: 6000 },
  { id: "automation", label: "Automação", icon: Workflow, baseWeeks: 2, basePrice: 4000 },
];

const features = [
  { id: "login", label: "Login / Auth", weeks: 1, price: 1500 },
  { id: "dashboard", label: "Dashboard", weeks: 1.5, price: 2500 },
  { id: "payment", label: "Pagamento", weeks: 1, price: 2000 },
  { id: "notifications", label: "Notificações", weeks: 0.5, price: 800 },
  { id: "reports", label: "Relatórios", weeks: 1, price: 1800 },
  { id: "integrations", label: "Integrações", weeks: 1.5, price: 2200 },
  { id: "admin", label: "Painel Admin", weeks: 1.5, price: 2000 },
  { id: "responsive", label: "Design Responsivo", weeks: 0.5, price: 600 },
];

const priceTiers = [
  { id: "economico", label: "Econômico", multiplier: 0.6, color: "text-neon-green", border: "border-neon-green/30", bg: "bg-neon-green/10" },
  { id: "padrao", label: "Padrão", multiplier: 1.0, color: "text-neon-blue", border: "border-neon-blue/30", bg: "bg-neon-blue/10" },
  { id: "premium", label: "Premium", multiplier: 1.5, color: "text-neon-purple", border: "border-neon-purple/30", bg: "bg-neon-purple/10" },
  { id: "enterprise", label: "Enterprise", multiplier: 2.2, color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/10" },
];

/* ── Component ────────────────────────────────────── */
const ServiceConfigurator = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [priceTier, setPriceTier] = useState("padrao");

  const toggleFeature = useCallback((id: string) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const estimate = useMemo(() => {
    const type = serviceTypes.find((s) => s.id === selectedType);
    if (!type) return null;

    const tier = priceTiers.find((t) => t.id === priceTier);
    const multiplier = tier?.multiplier ?? 1;

    let totalWeeks = type.baseWeeks;
    let totalPrice = type.basePrice;

    selectedFeatures.forEach((fId) => {
      const feat = features.find((f) => f.id === fId);
      if (feat) {
        totalWeeks += feat.weeks;
        totalPrice += feat.price;
      }
    });

    totalPrice = Math.round(totalPrice * multiplier);

    const minWeeks = Math.ceil(totalWeeks);
    const maxWeeks = Math.ceil(totalWeeks * 1.5);

    return {
      timeline: `${minWeeks}-${maxWeeks} semanas`,
      priceMin: totalPrice,
      priceMax: Math.ceil(totalPrice * 1.4),
      tierLabel: tier?.label ?? "Padrão",
    };
  }, [selectedType, selectedFeatures, priceTier]);

  const generateWhatsAppLink = () => {
    const type = serviceTypes.find((s) => s.id === selectedType);
    const featureLabels = Array.from(selectedFeatures)
      .map((id) => features.find((f) => f.id === id)?.label)
      .filter(Boolean);

    const message = [
      `*Proposta InfraCode*`,
      `Nome: ${form.name}`,
      `Email: ${form.email}`,
      `Tel: ${form.phone}`,
      ``,
      `*Tipo:* ${type?.label || "N/A"}`,
      `*Features:* ${featureLabels.length > 0 ? featureLabels.join(", ") : "Nenhuma"}`,
      estimate ? `*Prazo estimado:* ${estimate.timeline}` : "",
      estimate ? `*Faixa de investimento:* R$ ${estimate.priceMin.toLocaleString("pt-BR")} - R$ ${estimate.priceMax.toLocaleString("pt-BR")}` : "",
    ].join("%0A");

    return `https://wa.me/5568999999999?text=${message}`;
  };

  return (
    <section id="servicos" className="section-padding relative overflow-hidden scroll-mt-24">
      <div className="section-divider mb-20" />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Serviços</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Configure seu projeto
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base">
            Selecione o tipo de projeto e as funcionalidades para uma estimativa instantânea.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Service type selector */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Tipo de Projeto</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {serviceTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.id === selectedType ? null : type.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${
                    selectedType === type.id
                      ? "border-neon-blue/40 bg-neon-blue/[0.08] shadow-[0_0_20px_rgba(107,138,255,0.15)]"
                      : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  {selectedType === type.id && (
                    <motion.div
                      layoutId="serviceTypeIndicator"
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center"
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  )}
                  <type.icon size={22} className={selectedType === type.id ? "text-neon-blue" : "text-white/40"} />
                  <p className={`text-sm font-medium mt-2 ${selectedType === type.id ? "text-white" : "text-white/60"}`}>
                    {type.label}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price tier selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal size={14} className="text-white/40" />
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider">Faixa de Preço</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {priceTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setPriceTier(tier.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    priceTier === tier.id
                      ? `${tier.bg} ${tier.color} ${tier.border}`
                      : "border-white/8 bg-white/[0.02] text-white/40 hover:bg-white/[0.04]"
                  }`}
                >
                  {tier.label}
                  <span className={`block text-[10px] mt-0.5 ${priceTier === tier.id ? "opacity-70" : "opacity-40"}`}>
                    {tier.multiplier === 1 ? "base" : `×${tier.multiplier}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Feature tags */}
          <AnimatePresence>
            {selectedType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 overflow-hidden"
              >
                <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Funcionalidades</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((feat) => (
                    <button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedFeatures.has(feat.id)
                          ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                          : "bg-white/[0.03] text-white/50 border border-white/8 hover:bg-white/[0.06] hover:text-white/70"
                      }`}
                    >
                      {selectedFeatures.has(feat.id) && <Check size={13} className="inline mr-1.5 -mt-0.5" />}
                      {feat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Estimate card */}
          <AnimatePresence>
            {estimate && (
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-heading font-semibold text-white">Estimativa do Projeto</h3>
                  <BuildLogChip label="ESTIMATIVA_OK" status="info" />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Prazo Estimado</p>
                    <p className="text-2xl font-bold text-white font-mono">{estimate.timeline}</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Faixa de Investimento</p>
                    <p className="text-2xl font-bold text-white font-mono">
                      R$ {estimate.priceMin.toLocaleString("pt-BR")}
                      <span className="text-base text-white/40"> — R$ {estimate.priceMax.toLocaleString("pt-BR")}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neon-blue text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neon-blue/90 transition-all hover:shadow-[0_8px_30px_rgba(107,138,255,0.3)] active:scale-[0.98]"
                >
                  Gerar Proposta
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Proposal modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md border-white/10 bg-card/[0.98] backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-white">Gerar Proposta</DialogTitle>
            <DialogDescription className="text-white/50">
              Preencha seus dados para enviar o briefing via WhatsApp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <input
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
            <input
              placeholder="Seu e-mail"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
            <input
              placeholder="WhatsApp (68) 99999-9999"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
              onClick={() => setShowModal(false)}
            >
              <MessageCircle size={16} />
              Enviar via WhatsApp
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ServiceConfigurator;
