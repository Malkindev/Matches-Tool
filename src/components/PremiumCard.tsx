import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PremiumCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function PremiumCard({ title, description, icon }: PremiumCardProps) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.75rem] border border-white/10 bg-[#0F172A]/70 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-500/10 text-sky-200">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </motion.div>
  );
}

export default PremiumCard;
