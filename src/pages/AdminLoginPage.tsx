import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../lib/api';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('adminRememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    if (token && role === 'admin') {
      navigate('/admin');
    } else if (token && role === 'customer') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await adminLogin(email, password) as { token: string; user: { role: string } };
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authRole', response.user.role);

      if (rememberMe) {
        localStorage.setItem('adminRememberedEmail', email);
      } else {
        localStorage.removeItem('adminRememberedEmail');
      }

      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.26),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.2),_transparent_35%),linear-gradient(135deg,_#060816_0%,_#101a35_45%,_#090d18_100%)] px-4 py-10 text-slate-100 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_transparent_55%)]" />
      <div className="absolute left-[-8rem] top-[-6rem] h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-64 w-64 rounded-full bg-sky-500/25 blur-3xl" />

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_30px_140px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between bg-[linear-gradient(135deg,_rgba(139,92,246,0.24),_rgba(59,130,246,0.18))] p-8 sm:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Admin access
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Secure control center</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">Manage clients, activate accounts, and select the live volatility feed from one private dashboard.</p>
            </div>
            <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-slate-950/30 p-5 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Protected area</p>
              <p className="mt-3 leading-7">Only authorized admins can view and manage the client system.</p>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Admin login</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">Sign in to manage the Match Tool admin area.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-[1px]">
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-[15px] border-none bg-slate-950/70 px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-sky-400/25" placeholder="admin@example.com" required />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-[1px]">
                  <div className="flex items-center rounded-[15px] bg-slate-950/70 px-4 py-3.5">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border-none bg-transparent text-white outline-none" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="ml-3 text-sm text-slate-400 transition hover:text-white">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/10 text-sky-500 focus:ring-sky-500" />
                Remember me
              </label>
              {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(56,189,248,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Signing in...' : 'Access admin'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              <a href="/login" className="text-sky-300 transition hover:text-white">Client sign in</a>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default AdminLoginPage;
