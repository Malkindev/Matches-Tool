import { motion } from 'framer-motion';
import { Activity, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface MarketCardProps {
  name: string;
  status: string;
  countdown: number;
  lastUpdated: string;
  signal: string;
  accent: string;
  icon?: ReactNode;
}

function MarketCard({ name, status, countdown, lastUpdated, signal, accent, icon }: MarketCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-cyan-400/20 bg-slate-950/70 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_80px_rgba(2,8,23,0.5)] backdrop-blur-xl"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-20 transition duration-500 group-hover:opacity-30`} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Market feed</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{name}</h3>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
            {icon ?? <Activity size={16} />}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.75)]" />
            {status}
          </span>
          <span className="text-cyan-300">{countdown}s</span>
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-400">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2">
            <span>Last updated</span>
            <span className="text-slate-200">{lastUpdated}</span>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-3">
            <div className="mb-2 flex items-center gap-2 text-cyan-200">
              <Sparkles size={14} />
              <span className="text-xs uppercase tracking-[0.25em]">Signal</span>
            </div>
            <p className="text-sm text-slate-100">{signal}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
            <span>Syncing</span>
            <span>Live</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default MarketCard;
