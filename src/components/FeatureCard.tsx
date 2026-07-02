import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
}

function FeatureCard({ title }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] transition">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Feature</p>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">Premium platform capabilities focused only on match generation and delivery.</p>
    </motion.div>
  );
}

export default FeatureCard;
