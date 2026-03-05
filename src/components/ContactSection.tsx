import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageCircle, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePublicContactConfig } from "@/hooks/use-public-contact-config";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const publicConfig = usePublicContactConfig();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSending) {
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; errors?: string[] }
        | null;

      if (!response.ok) {
        const description =
          payload?.errors?.join(" ") ||
          payload?.message ||
          "Nao foi possivel enviar sua mensagem agora.";

        throw new Error(description);
      }

      toast({
        title: "Mensagem enviada!",
        description:
          payload?.message ||
          "Entraremos em contato em breve. Obrigado pela mensagem!",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description:
          error instanceof Error
            ? error.message
            : "Tente novamente em alguns minutos.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contato" className="section-padding bg-secondary/70 scroll-mt-24">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Contato</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3 mb-6">
              Vamos conversar sobre o seu projeto?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Estamos prontos para ajudar a transformar sua ideia em realidade. Entre em contato e vamos criar algo incrível juntos.
            </p>

            <div className="space-y-4">
              {publicConfig.contactEmail && (
                <a
                  href={`mailto:${publicConfig.contactEmail}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Mail size={20} />
                  <span>{publicConfig.contactEmail}</span>
                </a>
              )}
              {publicConfig.whatsappUrl && (
                <a
                  href={publicConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <MessageCircle size={20} />
                  <span>{publicConfig.whatsappDisplay}</span>
                </a>
              )}
              {publicConfig.instagramUrl && (
                <a
                  href={publicConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card/[0.96] rounded-xl border border-white/10 p-8 space-y-5 shadow-[0_14px_30px_rgba(0,0,0,0.3)]"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Nome
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-background/85 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-background/85 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-background/85 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
                placeholder="(68) 99999-9999"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                Mensagem
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-background/85 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow resize-none"
                placeholder="Conte-nos sobre o seu projeto..."
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-brand-blue-strong transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSending ? "Enviando..." : "Enviar mensagem"}
              <Send size={16} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
