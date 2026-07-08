const configuredApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = configuredApiUrl && !/localhost|127\.0\.0\.1/i.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, '')
  : '/api';

function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function request(path: string, options: RequestInit = {}, requiresAuth = false) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
  if (requiresAuth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = buildApiUrl(path);
  console.info(`[api] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseText = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { message: responseText || 'Request failed' };
    }

    console.info(`[api] ${response.status} ${url}`, data);

    if (!response.ok) {
      throw new Error((data.message as string) || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`[api] request failed for ${path}`, error);
    throw error;
  }
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
