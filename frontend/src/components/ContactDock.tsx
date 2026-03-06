import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, MessageSquareText, X, Send } from "lucide-react";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";
import { useToast } from "@/hooks/use-toast";
import { submitContact } from "@/lib/contact-api";

const dockItems = [
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    color: "hover:text-emerald-400",
  },
  { id: "email", icon: Mail, label: "Email", color: "hover:text-neon-blue" },
  {
    id: "contato",
    icon: MessageSquareText,
    label: "Contato",
    color: "hover:text-neon-purple",
  },
];

const ContactDock = () => {
  const { toast } = useToast();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const publicConfig = usePublicContactConfig();

  const handleDockClick = (id: string) => {
    if (id === "whatsapp") {
      setActivePanel((current) => (current === id ? null : id));
      return;
    }

    if (id === "email" && publicConfig.contactEmail) {
      window.location.href = `mailto:${publicConfig.contactEmail}`;
      return;
    }

    if (id === "contato") {
      const target = document.getElementById("contato");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    toast({
      title: "Ação indisponível",
      description: "Não foi possível abrir este canal agora.",
      variant: "destructive",
    });
  };

  const handleQuickLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const phoneDigits = form.phone.replace(/\D/g, "");
    const message = form.message.trim();

    if (phoneDigits.length < 10) {
      toast({
        title: "WhatsApp inválido",
        description: "Informe o número com DDD.",
        variant: "destructive",
      });
      return;
    }

    if (message.length < 10) {
      toast({
        title: "Mensagem curta",
        description: "Digite pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const fallbackName = "Cliente do site";
    const fallbackEmail = `lead+${phoneDigits}@infracode.local`;
    const contactPayload = {
      name: form.name.trim() || fallbackName,
      email: form.email.trim() || fallbackEmail,
      phone: form.phone.trim(),
      message,
    };

    setIsSending(true);

    try {
      const responsePayload = await submitContact(contactPayload);

      toast({
        title: "Mensagem enviada no WhatsApp",
        description:
          responsePayload?.message ||
          "Recebemos seu contato e vamos responder no seu número informado.",
      });

      setForm({ name: "", email: "", phone: "", message: "" });
      setActivePanel(null);
    } catch (error) {
      toast({
        title: "Falha no envio",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6, type: "spring" }}
        className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
      >
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {dockItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDockClick(item.id)}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl text-white/50 transition-colors ${item.color}`}
              title={item.label}
              aria-label={item.label}
            >
              <item.icon size={20} />
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/60 bg-black/80 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Quick contact panel */}
      <AnimatePresence>
        {activePanel === "whatsapp" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-20 z-50 flex justify-center px-4"
          >
            <div className="w-full max-w-[360px] rounded-2xl border border-white/10 bg-black/80 p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">WhatsApp Rápido</h4>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-white/40 hover:text-white/60"
                  type="button"
                  aria-label="Fechar painel de WhatsApp"
                >
                  <X size={16} />
                </button>
              </div>

              <form className="space-y-3" onSubmit={handleQuickLeadSubmit}>
                <input
                  placeholder="Seu nome (opcional)"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail (opcional)"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp com DDD"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <textarea
                  placeholder="Digite sua mensagem"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />

                <button
                  type="submit"
                  disabled={isSending}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send size={14} />
                  {isSending ? "Enviando..." : "Enviar via WhatsApp"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactDock;
