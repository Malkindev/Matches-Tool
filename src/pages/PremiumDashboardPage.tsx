import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/api';

function PremiumDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ fullName?: string; username?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const load = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load account.');
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    };

    void load();
  }, [navigate]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_38%),#050507] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Premium dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Welcome{user?.fullName ? `, ${user.fullName}` : ''}</h1>
            <p className="mt-3 text-slate-300">Only authenticated customers can access this premium workspace.</p>
          </div>
          <button onClick={() => { localStorage.removeItem('authToken'); localStorage.removeItem('authRole'); navigate('/login'); }} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Logout</button>
        </div>
        {error && <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Account</p>
            <p className="mt-4 text-xl font-semibold text-white">{user?.username || 'Customer'}</p>
            <p className="mt-2 text-sm text-slate-400">Your premium access is protected by secure session authentication.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Access</p>
            <p className="mt-4 text-xl font-semibold text-white">Active premium session</p>
            <p className="mt-2 text-sm text-slate-400">Subscription and account status are managed by the administrator.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">Back home</Link>
          <Link to="/admin" className="rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm text-sky-200">Open admin</Link>
        </div>
      </div>
    </main>
  );
}

export default PremiumDashboardPage;
