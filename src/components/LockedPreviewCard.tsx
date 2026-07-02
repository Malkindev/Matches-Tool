import { motion } from 'framer-motion';

interface LockedPreviewCardProps {
  title: string;
  time: string;
  league: string;
}

function LockedPreviewCard({ title, time, league }: LockedPreviewCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[1.5rem] border border-white/10 bg-[#0A1020]/90 p-5 shadow-[0_20px_70px_rgba(2,6,23,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-amber-200">
          Premium locked
        </span>
        <span className="text-sm text-slate-400">{time}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{league}</p>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        Unlock premium access to see the live prediction and match insight.
      </div>
    </motion.div>
  );
}

export default LockedPreviewCard;
