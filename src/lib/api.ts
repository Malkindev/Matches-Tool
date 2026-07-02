const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path: string, options: RequestInit = {}, requiresAuth = false) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = localStorage.getItem('authToken');
  if (requiresAuth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const adminLogin = (email: string, password: string) => request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const customerLogin = (username: string, password: string) => request('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const getCurrentUser = () => request('/me', {}, true);
export const getAdminUsers = () => request('/admin/users', {}, true);
export const createAdminUser = (payload: Record<string, unknown>) => request('/admin/users', { method: 'POST', body: JSON.stringify(payload) }, true);
export const updateAdminUser = (id: number, payload: Record<string, unknown>) => request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, true);
export const deleteAdminUser = (id: number) => request(`/admin/users/${id}`, { method: 'DELETE' }, true);
export const resetAdminUserPassword = (id: number, password: string) => request(`/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ password }) }, true);
export const getVolatilityState = () => request('/volatility/current', {}, true);
export const setAdminVolatility = (volatility: string) => request('/admin/volatility', { method: 'POST', body: JSON.stringify({ volatility }) }, true);
export const getMatchState = () => request('/match/state', {}, true);
