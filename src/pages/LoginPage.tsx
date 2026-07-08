import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerLogin } from '../lib/api';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('clientRememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
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
      const response = await customerLogin(username, password) as { token: string; user: { role: string } };
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authRole', response.user.role);

      if (rememberMe) {
        localStorage.setItem('clientRememberedUsername', username);
      } else {
        localStorage.removeItem('clientRememberedUsername');
      }

      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.';
      if (message.includes('inactive')) {
        setError('Account inactive.');
      } else if (message.includes('expired')) {
        setError('Subscription expired.');
      } else if (message.includes('Invalid credentials')) {
        setError('Incorrect username or password.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.2),_transparent_35%),linear-gradient(135deg,_#060816_0%,_#101a35_45%,_#090d18_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08),_transparent_55%)]" />
      <div className="absolute left-[-6rem] top-[-6rem] h-52 w-52 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="absolute bottom-[-5rem] right-[-4rem] h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_30px_140px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between bg-[linear-gradient(135deg,_rgba(129,140,248,0.22),_rgba(56,189,248,0.16)_60%,_rgba(6,10,25,0.94))] p-8 sm:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-lg font-semibold text-white">MT</div>
                <span>Matches Tool</span>
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Private client access</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">Only usernames and passwords created by the admin can open this workspace.</p>

              <div className="mt-6 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Access price</p>
                <p className="mt-3 text-3xl font-semibold text-white">$150 USD</p>
                <p className="mt-3 leading-7 text-emerald-50">For access, contact us on WhatsApp:</p>
                <p className="mt-2 font-medium text-white">0781766193</p>
                <a
                  href="https://wa.me/27781766193"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-slate-950/30 p-5 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Secure portal</p>
              <p className="mt-3 leading-7">Your dashboard stays limited to the live match view and account session controls.</p>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Client login</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">Use the username and password assigned by the admin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Username</span>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-[1px]">
                  <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} className="w-full rounded-[15px] border-none bg-slate-950/70 px-4 py-3.5 text-white outline-none focus:ring-2 focus:ring-sky-400/25" placeholder="Enter your username" required />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-[1px]">
                  <div className="flex items-center rounded-[15px] bg-slate-950/70 px-4 py-3.5">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border-none bg-transparent text-white outline-none" placeholder="Enter your password" required />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="ml-3 text-sm text-slate-400 transition hover:text-white">
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/10 text-sky-500 focus:ring-sky-500" />
                Remember username
              </label>

              {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

              <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-violet-500 via-sky-500 to-cyan-400 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(56,189,248,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? 'Signing in...' : 'Continue'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              <a href="/admin/login" className="text-sky-300 transition hover:text-white">Admin sign in</a>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default LoginPage;
