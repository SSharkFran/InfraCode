import { motion } from "framer-motion";
import { Shield, Gauge, Handshake, TrendingUp, Sparkles } from "lucide-react";

const differentials = [
  { icon: Sparkles, title: "Qualidade & Performance", description: "Código limpo, testado e otimizado para alto desempenho." },
  { icon: Handshake, title: "Soluções sob Medida", description: "Cada projeto é único — criamos software que se adapta ao seu negócio." },
  { icon: Gauge, title: "Tecnologia Moderna", description: "Usamos as melhores e mais atuais tecnologias do mercado." },
  { icon: Shield, title: "Atendimento Personalizado", description: "Comunicação clara, acompanhamento próximo e entregas pontuais." },
  { icon: TrendingUp, title: "Foco em Resultados", description: "Nosso objetivo é gerar valor real e mensurável para o seu negócio." },
];

const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="section-padding bg-brand-ink-soft text-primary-foreground scroll-mt-24">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Diferenciais</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-3 mb-4">
            Por que escolher a InfraCode?
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Combinamos expertise técnica com um atendimento que faz a diferença.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {differentials.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-7 rounded-xl border border-primary-foreground/[0.12] bg-primary-foreground/[0.06] backdrop-blur-sm hover:bg-primary-foreground/[0.12] transition-colors ${
                index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <item.icon size={28} className="text-accent mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
