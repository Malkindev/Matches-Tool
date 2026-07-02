import { motion } from 'framer-motion';
import { LogOut, Menu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopNavProps {
  onLogout: () => void;
}

const links = ['Dashboard', 'Markets', 'Signals', 'Profile'];

function TopNav({ onLogout }: TopNavProps) {
  return (
    <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-20 rounded-[1.5rem] border border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_10px_40px_rgba(2,8,23,0.45)] backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.2)]">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-wide text-white">Magisk</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Futures Intelligence</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link} href="#" className="text-sm text-slate-300 transition hover:text-cyan-300">
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/20 hover:text-cyan-300 sm:flex">
            <LogOut size={15} />
            Logout
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 md:hidden">
            <Menu size={17} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export default TopNav;
