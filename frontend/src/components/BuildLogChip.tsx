import { motion } from "framer-motion";

type BuildLogChipProps = {
  label: string;
  status?: "success" | "info" | "warning";
  delay?: number;
  className?: string;
};

const statusColors = {
  success: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  info: "text-blue-400 border-blue-400/20 bg-blue-400/5",
  warning: "text-amber-400 border-amber-400/20 bg-amber-400/5",
};

const statusDots = {
  success: "bg-emerald-400",
  info: "bg-blue-400",
  warning: "bg-amber-400",
};

const BuildLogChip = ({ label, status = "success", delay = 0, className = "" }: BuildLogChipProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10px] tracking-wider uppercase select-none ${statusColors[status]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]} animate-pulse`} />
      {label}
    </motion.div>
  );
};

export default BuildLogChip;
