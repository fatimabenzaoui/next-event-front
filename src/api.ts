const API_URL = "https://fatimabenzaoui.pythonanywhere.com/api";
// const API_URL = 'http://localhost:8000/api';
/* ---------- Token helpers ---------- */
export function getAccessToken(): string | null {
  return localStorage.getItem('access');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}

/* ---------- Authenticated fetch wrapper ---------- */
export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_URL}${input}`, { ...init, headers });

  // If 401, try refreshing the token once
  if (res.status === 401 && getRefreshToken()) {
    const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      setTokens(data.access, data.refresh ?? getRefreshToken()!);
      headers['Authorization'] = `Bearer ${data.access}`;
      res = await fetch(`${API_URL}${input}`, { ...init, headers });
    } else {
      clearTokens();
    }
  }

  return res;
}

/* ---------- Auth API calls ---------- */
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'association';
  first_name: string;
  last_name: string;
  association_name: string;
  description: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  role: 'student' | 'association';
  first_name?: string;
  last_name?: string;
  association_name?: string;
  description?: string;
}

export async function login(payload: LoginPayload): Promise<{ user: UserProfile }> {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Identifiants incorrects');
  }
  const data = await res.json();
  setTokens(data.access, data.refresh);

  // Fetch user profile
  const meRes = await authFetch('/auth/me/');
  const user: UserProfile = await meRes.json();
  return { user };
}

export async function register(payload: RegisterPayload): Promise<{ user: UserProfile }> {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    // Format DRF validation errors
    const messages = Object.values(err).flat().join(' ');
    throw new Error(messages || 'Erreur lors de la création du compte');
  }
  const data = await res.json();
  setTokens(data.tokens.access, data.tokens.refresh);
  return { user: data.user };
}

export async function googleAuth(token: string, type: 'id_token' | 'access_token' = 'id_token'): Promise<{ user: UserProfile }> {
  const res = await fetch(`${API_URL}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(type === 'id_token' ? { id_token: token } : { access_token: token }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erreur Google');
  }
  const data = await res.json();
  setTokens(data.tokens.access, data.tokens.refresh);
  return { user: data.user };
}

export async function fetchMe(): Promise<UserProfile | null> {
  if (!getAccessToken()) return null;
  try {
    const res = await authFetch('/auth/me/');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function logout() {
  clearTokens();
}
