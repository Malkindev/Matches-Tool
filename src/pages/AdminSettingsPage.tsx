import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Gauge, MonitorSmartphone, Settings2, Sparkles } from 'lucide-react';
import { getDashboardSettings, saveDashboardSettings, type DashboardSettings, type MarketMode } from '../lib/dashboardSettings';

function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<DashboardSettings>(getDashboardSettings);
  const [message, setMessage] = useState('Live updates are synced to the customer dashboard.');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const updateSetting = (partial: Partial<DashboardSettings>) => {
    const next = saveDashboardSettings(partial);
    setSettings(next);
    setMessage('Settings updated and pushed to the live dashboard.');
  };

  const summary = useMemo(() => {
    if (settings.marketMode === 'Aggressive') {
      return 'High-volatility feed with faster signal rotation.';
    }
    if (settings.marketMode === 'Cautious') {
      return 'Foothold strategy with steady pacing and lower intensity.';
    }
    return 'Balanced rhythm tuned for stable delivery and confident pacing.';
  }, [settings.marketMode]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_38%),#050507] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">Admin controls</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Volatility & signal settings</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Tune the live customer experience without leaving the admin workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/clients" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">Clients</Link>
            <Link to="/dashboard" className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-200 hover:bg-sky-500/20">Customer view</Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-4 text-sm text-violet-100">{message}</div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-2 text-violet-200">
                <Settings2 size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Dashboard tuning</h2>
                <p className="mt-1 text-sm text-slate-400">Adjust the customer-facing signal intensity and refresh rhythm.</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <label className="block rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">Signal intensity</span>
                  <span className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1 text-sm text-sky-200">{settings.volatility}%</span>
                </div>
                <input type="range" min="0" max="100" value={settings.volatility} onChange={(event) => updateSetting({ volatility: Number(event.target.value) })} className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-sky-400" />
              </label>

              <label className="block rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">Pulse cadence</span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">{settings.pulse}s</span>
                </div>
                <input type="range" min="8" max="30" value={settings.pulse} onChange={(event) => updateSetting({ pulse: Number(event.target.value) })} className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400" />
              </label>

              <label className="block rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">Market mode</span>
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">{settings.marketMode}</span>
                </div>
                <select value={settings.marketMode} onChange={(event) => updateSetting({ marketMode: event.target.value as MarketMode })} className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none">
                  <option value="Balanced">Balanced</option>
                  <option value="Aggressive">Aggressive</option>
                  <option value="Cautious">Cautious</option>
                </select>
              </label>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-200"><MonitorSmartphone size={18} /></div>
                <div>
                  <p className="text-sm text-slate-400">Live preview</p>
                  <p className="text-xl font-semibold text-white">Customer dashboard</p>
                </div>
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Signal intensity</span>
                  <span className="text-white">{settings.volatility}%</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>Pulse cadence</span>
                  <span className="text-white">{settings.pulse}s</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                  <span>Market mode</span>
                  <span className="text-white">{settings.marketMode}</span>
                </div>
                <div className="mt-6 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} />
                    <span>{summary}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-2 text-sky-200"><Gauge size={18} /></div>
                <div>
                  <p className="text-sm text-slate-400">System status</p>
                  <p className="text-xl font-semibold text-white">Synchronized</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="rounded-2xl border border-white/10 bg-black/30 p-3">Realtime sync is active across the dashboard.</li>
                <li className="rounded-2xl border border-white/10 bg-black/30 p-3">Admin changes persist in local storage for instant updates.</li>
                <li className="rounded-2xl border border-white/10 bg-black/30 p-3">Customer experience remains protected behind the role-based layout.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default AdminSettingsPage;
