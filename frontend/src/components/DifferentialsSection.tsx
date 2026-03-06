import { motion } from "framer-motion";
import { Shield, Gauge, Handshake, TrendingUp, Sparkles } from "lucide-react";

const differentials = [
  { icon: Sparkles, title: "Qualidade & Performance", description: "Código limpo, testado e otimizado para alto desempenho.", color: "text-neon-blue", bg: "bg-neon-blue/10" },
  { icon: Handshake, title: "Soluções sob Medida", description: "Cada projeto é único — criamos software que se adapta ao seu negócio.", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Gauge, title: "Tecnologia Moderna", description: "Usamos as melhores e mais atuais tecnologias do mercado.", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: Shield, title: "Atendimento Personalizado", description: "Comunicação clara, acompanhamento próximo e entregas pontuais.", color: "text-neon-green", bg: "bg-neon-green/10" },
  { icon: TrendingUp, title: "Foco em Resultados", description: "Nosso objetivo é gerar valor real e mensurável para o seu negócio.", color: "text-amber-400", bg: "bg-amber-400/10" },
];

const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="section-padding relative overflow-hidden scroll-mt-24">
      <div className="section-divider mb-20" />

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-neon-blue font-semibold text-xs uppercase tracking-widest">Diferenciais</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mt-3 mb-4 tracking-display">
            Por que escolher a InfraCode?
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Combinamos expertise técnica com um atendimento que faz a diferença.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {differentials.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className={`glass-card rounded-xl p-6 hover:shadow-[0_12px_30px_rgba(107,138,255,0.1)] transition-shadow ${
                index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon size={20} className={item.color} />
              </div>
              <h3 className="font-heading font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
