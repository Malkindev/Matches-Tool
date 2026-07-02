import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
}

function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 shadow-[0_20px_60px_rgba(2,8,23,0.55)] backdrop-blur-xl">
          <CheckCircle2 size={16} className="text-cyan-300" />
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Toast;
