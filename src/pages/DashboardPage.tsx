import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSettings, saveDashboardSettings, subscribeDashboardSettings, type DashboardSettings } from '../lib/dashboardSettings';

const GENERATION_INTERVAL = 30;
const MARKET_OPTIONS = [
  { label: 'Volatility 10 (1s)', value: 10 },
  { label: 'Volatility 25 (1s)', value: 25 },
  { label: 'Volatility 50 (1s)', value: 50 },
  { label: 'Volatility 75 (1s)', value: 75 },
  { label: 'Volatility 100 (1s)', value: 100 },
  { label: 'Volatility 10', value: 10 },
  { label: 'Volatility 25', value: 25 },
  { label: 'Volatility 50', value: 50 },
  { label: 'Volatility 75', value: 75 },
  { label: 'Volatility 100', value: 100 },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<DashboardSettings>(getDashboardSettings);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === 'admin') {
      navigate('/admin');
      return;
    }

    setSettings(getDashboardSettings());
  }, [navigate]);

  useEffect(() => {
    if (!isDropdownOpen) {
      setSearchTerm('');
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const unsubscribe = subscribeDashboardSettings(() => {
      setSettings(getDashboardSettings());
    });

    const interval = window.setInterval(() => {
      generateDigit();
    }, GENERATION_INTERVAL * 1000);

    const countdownInterval = window.setInterval(() => {
      setSettings((prev) => {
        const nextCountdown = prev.countdown > 1 ? prev.countdown - 1 : GENERATION_INTERVAL;
        const next = { ...prev, countdown: nextCountdown };
        saveDashboardSettings({ countdown: nextCountdown });
        return next;
      });
    }, 1000);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
      window.clearInterval(countdownInterval);
    };
  }, []);

  const generateDigit = (overrides?: { volatility?: number; label?: string }) => {
    const nextDigit = Math.floor(Math.random() * 10);
    const timestamp = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    setSettings((prev) => {
      const nextHistory = [nextDigit, ...prev.history].slice(0, 12);
      const next = {
        ...prev,
        volatility: overrides?.volatility ?? prev.volatility,
        selectedVolatilityLabel: overrides?.label ?? prev.selectedVolatilityLabel,
        currentDigit: nextDigit,
        history: nextHistory,
        lastUpdatedAt: timestamp,
        countdown: GENERATION_INTERVAL,
      };
      saveDashboardSettings(next);
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    navigate('/login');
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return MARKET_OPTIONS;
    return MARKET_OPTIONS.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const handleSelectVolatility = (option: { label: string; value: number }) => {
    generateDigit({ volatility: option.value, label: option.label });
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const activeMarketLabel = settings.selectedVolatilityLabel || 'Volatility 75 (1s)';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(135deg,_#060816_0%,_#101a35_45%,_#090d18_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-2xl">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Client dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Live match board</h1>
          </div>
          <button onClick={handleLogout} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">Logout</button>
        </div>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-2xl">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Selected volatility</p>
            <div className="relative mt-3">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-lg font-semibold text-white shadow-lg shadow-slate-950/20"
              >
                <span>{activeMarketLabel}</span>
                <ChevronDown className={`h-5 w-5 text-slate-300 transition ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-20 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <label className="mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search volatility"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </label>
                  <div className="max-h-56 space-y-1 overflow-auto">
                    {filteredOptions.length ? filteredOptions.map((option) => (
                      <button
                        key={`${option.label}-${option.value}`}
                        type="button"
                        onClick={() => handleSelectVolatility(option)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${settings.selectedVolatilityLabel === option.label ? 'bg-sky-500/15 text-sky-200' : 'bg-white/5 text-slate-200 hover:bg-white/10'}`}
                      >
                        <span>{option.label}</span>
                        {settings.selectedVolatilityLabel === option.label ? <span className="text-xs uppercase tracking-[0.2em] text-sky-300">Selected</span> : null}
                      </button>
                    )) : <p className="px-3 py-2 text-sm text-slate-400">No matches found.</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current digit</p>
              <p className="mt-4 text-6xl font-semibold text-white">{settings.currentDigit ?? '—'}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Countdown</p>
              <p className="mt-4 text-6xl font-semibold text-sky-300">{settings.countdown}s</p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Match history</p>
                <p className="mt-1 text-sm text-slate-500">Last update: {settings.lastUpdatedAt}</p>
              </div>
              <button onClick={() => generateDigit()} className="rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-sm text-sky-200 transition hover:bg-sky-500/20">Refresh now</button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {settings.history.length ? settings.history.map((digit, index) => (
                <div key={`${digit}-${index}`} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-white">{digit}</div>
              )) : <p className="text-sm text-slate-400">No digits generated yet.</p>}
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default DashboardPage;
