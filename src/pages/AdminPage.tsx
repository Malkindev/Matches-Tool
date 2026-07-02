import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Users } from 'lucide-react';
import { createAdminUser, deleteAdminUser, getAdminUsers, resetAdminUserPassword, updateAdminUser } from '../lib/api';
import { getDashboardSettings } from '../lib/dashboardSettings';

interface UserRecord {
  id: number;
  username: string;
  full_name: string | null;
  email: string | null;
  status: string;
  subscription_expiry: string | null;
  created_at: string;
  role: string;
}

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', status: 'Active', subscriptionExpiry: '', role: 'customer' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ username: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeTab = location.pathname.includes('/clients') ? 'clients' : 'dashboard';
  const sharedSettings = getDashboardSettings();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('authRole');
    if (!token) {
      navigate('/login');
      return;
    }
    if (role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    void loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await getAdminUsers();
      setUsers(response.users || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => users.filter((user) => `${user.username} ${user.full_name || ''} ${user.email || ''}`.toLowerCase().includes(search.toLowerCase())), [search, users]);

  const resetForm = () => {
    setForm({ username: '', password: '', fullName: '', email: '', status: 'Active', subscriptionExpiry: '', role: 'customer' });
    setEditingId(null);
  };

  const copyCredentials = async () => {
    if (!createdCredentials) return;
    await navigator.clipboard.writeText(`Username: ${createdCredentials.username}\nPassword: ${createdCredentials.password}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (editingId) {
        const payload: Record<string, unknown> = { username: form.username, fullName: form.fullName, email: form.email, status: form.status, subscriptionExpiry: form.subscriptionExpiry || null, role: form.role };
        if (form.password) payload.password = form.password;
        await updateAdminUser(editingId, payload);
        setCreatedCredentials(null);
        setMessage('User updated successfully.');
      } else {
        await createAdminUser({ username: form.username, password: form.password, fullName: form.fullName, email: form.email, status: form.status, subscriptionExpiry: form.subscriptionExpiry || null, role: form.role });
        setCreatedCredentials({ username: form.username, password: form.password });
        setMessage('User created successfully.');
      }
      resetForm();
      await loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: UserRecord) => {
    setEditingId(user.id);
    setForm({ username: user.username, password: '', fullName: user.full_name || '', email: user.email || '', status: user.status, subscriptionExpiry: user.subscription_expiry ? user.subscription_expiry.slice(0, 10) : '', role: user.role });
  };

  const toggleStatus = async (user: UserRecord) => {
    setLoading(true);
    try {
      await updateAdminUser(user.id, { status: user.status === 'Active' ? 'Inactive' : 'Active' });
      setMessage('User status updated.');
      await loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    try {
      await deleteAdminUser(userId);
      setMessage('User deleted.');
      await loadUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete user.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (user: UserRecord) => {
    const password = window.prompt(`Set a new password for ${user.username}`);
    if (!password) return;
    setLoading(true);
    try {
      await resetAdminUserPassword(user.id, password);
      setMessage('Password reset successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    navigate('/admin/login');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_38%),#050507] text-white px-6 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Admin control center</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Command the shared match flow</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Manage clients, monitor the live signal feed, and tune the shared volatility layer from one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate('/admin/dashboard')} className={`rounded-full px-4 py-2 text-sm transition ${activeTab === 'dashboard' ? 'border border-sky-400/30 bg-sky-500/10 text-sky-200' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>Dashboard</button>
            <button onClick={() => navigate('/admin/clients')} className={`rounded-full px-4 py-2 text-sm transition ${activeTab === 'clients' ? 'border border-violet-400/30 bg-violet-500/10 text-violet-200' : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'}`}>Clients</button>
            <button onClick={() => navigate('/admin/volatility-settings')} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">Volatility Settings</button>
            <button onClick={handleLogout} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">Logout</button>
          </div>
        </div>

        {message && <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</div>}

        {createdCredentials && (
          <div className="rounded-[1.5rem] border border-sky-400/20 bg-sky-500/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Generated credentials</p>
                <p className="mt-2 text-sm text-slate-200">Username: {createdCredentials.username}</p>
                <p className="text-sm text-slate-200">Password: {createdCredentials.password}</p>
              </div>
              <button type="button" onClick={copyCredentials} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {copied ? 'Copied!' : 'Copy Credentials'}
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-2 text-sky-200"><Users size={16} /></div>
              <div>
                <p className="text-sm text-slate-400">Managed accounts</p>
                <p className="text-xl font-semibold text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-200"><ShieldCheck size={16} /></div>
              <div>
                <p className="text-sm text-slate-400">Active sessions</p>
                <p className="text-xl font-semibold text-white">{users.filter((user) => user.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-2 text-violet-200"><Activity size={16} /></div>
              <div>
                <p className="text-sm text-slate-400">Signal controls</p>
                <p className="text-xl font-semibold text-white">Live</p>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Shared live signal</h2>
              <p className="mt-2 text-sm text-slate-400">The client view listens to the same signal state that you control here.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-slate-400">Current digit</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{sharedSettings.currentDigit ?? '—'}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-slate-400">Countdown</p>
                  <p className="mt-2 text-4xl font-semibold text-sky-200">{sharedSettings.countdown}s</p>
                </div>
              </div>
              <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                <p>Volatility profile: {sharedSettings.volatility}%</p>
                <p className="mt-2">Pulse cadence: {sharedSettings.pulse}s</p>
                <p className="mt-2">Mode: {sharedSettings.marketMode}</p>
              </div>
            </section>
            <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">Quick actions</h2>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <Link to="/admin/clients" className="block rounded-[1.25rem] border border-white/10 bg-black/30 p-4 transition hover:bg-black/40">Open client management</Link>
                <Link to="/admin/volatility-settings" className="block rounded-[1.25rem] border border-white/10 bg-black/30 p-4 transition hover:bg-black/40">Adjust volatility controls</Link>
                <div className="rounded-[1.25rem] border border-white/10 bg-black/30 p-4">Last shared update: {sharedSettings.lastUpdatedAt}</div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">{editingId ? 'Edit user' : 'Create client'}</h2>
              <p className="mt-2 text-sm text-slate-400">Set account details, status, and subscription expiry.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Username
                    <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" required />
                  </label>
                  <label className="text-sm text-slate-300">
                    Password
                    <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" required={!editingId} />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-slate-300">
                    Full name
                    <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" />
                  </label>
                  <label className="text-sm text-slate-300">
                    Email
                    <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-sm text-slate-300">
                    Status
                    <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </label>
                  <label className="text-sm text-slate-300">
                    Role
                    <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none">
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  <label className="text-sm text-slate-300">
                    Expiry date
                    <input type="date" value={form.subscriptionExpiry} onChange={(event) => setForm({ ...form, subscriptionExpiry: event.target.value })} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" />
                  </label>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" disabled={loading} className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white">{editingId ? 'Save Changes' : 'Create Client'}</button>
                  <button type="button" onClick={resetForm} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">Cancel</button>
                </div>
              </form>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Clients</h2>
                  <p className="mt-2 text-sm text-slate-400">Search accounts, manage subscription dates, and enable or disable access.</p>
                </div>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients" className="w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none sm:w-56" />
              </div>
              <div className="mt-6 space-y-3">
                {loading ? <p className="text-slate-400">Loading clients...</p> : filteredUsers.map((user) => (
                  <div key={user.id} className="rounded-[1.25rem] border border-white/10 bg-black/30 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{user.username}</p>
                        <p className="mt-1 text-sm text-slate-400">{user.email || 'No email provided'}</p>
                        <p className="mt-1 text-sm text-slate-400">Status: {user.status} • Expires: {user.subscription_expiry ? new Date(user.subscription_expiry).toLocaleDateString() : 'No expiry'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => startEdit(user)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">Edit</button>
                        <button onClick={() => handleResetPassword(user)} className="rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-200">Reset Password</button>
                        <button onClick={() => toggleStatus(user)} className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{user.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => handleDelete(user.id)} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
