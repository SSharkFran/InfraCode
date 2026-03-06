import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mail, Calendar, X, Send } from "lucide-react";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";

const dockItems = [
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "hover:text-emerald-400" },
  { id: "email", icon: Mail, label: "Email", color: "hover:text-neon-blue" },
  { id: "schedule", icon: Calendar, label: "Agendar", color: "hover:text-neon-purple" },
];

const ContactDock = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", need: "", urgency: "normal" });
  const publicConfig = usePublicContactConfig();

  const handleDockClick = (id: string) => {
    if (id === "whatsapp" && publicConfig.whatsappUrl) {
      window.open(publicConfig.whatsappUrl, "_blank");
      return;
    }
    if (id === "email" && publicConfig.contactEmail) {
      window.location.href = `mailto:${publicConfig.contactEmail}`;
      return;
    }
    setActivePanel(activePanel === id ? null : id);
  };

  const generateSmartMessage = () => {
    const msg = `Olá! Sou ${form.name}. Preciso de: ${form.need}. Urgência: ${form.urgency === "urgent" ? "Alta" : "Normal"}.`;
    return `https://wa.me/5568999999999?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Dock */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6, type: "spring" }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {dockItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDockClick(item.id)}
              className={`relative p-3 rounded-xl text-white/50 ${item.color} transition-colors group`}
              title={item.label}
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
        {activePanel === "schedule" && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[340px]"
          >
            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-white">Contato Rápido</h4>
                <button onClick={() => setActivePanel(null)} className="text-white/40 hover:text-white/60">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <input
                  placeholder="O que você precisa?"
                  value={form.need}
                  onChange={(e) => setForm({ ...form, need: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.04] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-neon-blue/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setForm({ ...form, urgency: "normal" })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      form.urgency === "normal"
                        ? "border-neon-blue/30 bg-neon-blue/10 text-neon-blue"
                        : "border-white/8 text-white/40 hover:bg-white/5"
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setForm({ ...form, urgency: "urgent" })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      form.urgency === "urgent"
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
                        : "border-white/8 text-white/40 hover:bg-white/5"
                    }`}
                  >
                    Urgente
                  </button>
                </div>
              </div>

              <a
                href={generateSmartMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                <Send size={14} />
                Enviar via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactDock;
