const SUPABASE_URL = 'https://ajnffmzpmydyyonedmip.supabase.co';
const SUPABASE_KEY = 'sb_publishable_t9WKteC9H_EvBBkOOl3yLg_BAcg3klH';
const SESSION_KEY = 'little-list-session';

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function headers(token) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, 'Content-Type': 'application/json' };
}

export async function authenticateEmail(email, password, createAccount = false) {
  const path = createAccount ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.msg || result.message || result.error_description || result.error || 'Não foi possível entrar. Confira o email e a senha.');
  if (createAccount && !result.access_token) return { confirmationRequired: true };
  if (!result.access_token) throw new Error('Não foi possível iniciar a sessão.');
  const session = { ...result, expires_at: result.expires_at || Math.floor(Date.now() / 1000) + (result.expires_in || 3600) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function restoreSession() {
  const session = getSession();
  if (!session?.refresh_token) return null;
  if (session.expires_at && session.expires_at * 1000 > Date.now() + 60000) return session;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const result = await response.json();
  if (!response.ok || !result.access_token) { localStorage.removeItem(SESSION_KEY); return null; }
  const renewed = { ...session, ...result, expires_at: result.expires_at || Math.floor(Date.now() / 1000) + (result.expires_in || 3600) };
  localStorage.setItem(SESSION_KEY, JSON.stringify(renewed));
  return renewed;
}

export function signOut() { localStorage.removeItem(SESSION_KEY); }

export async function loadSharedState(token) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/shared_state?id=eq.1&select=data`, { headers: headers(token) });
  if (!response.ok) throw new Error('Could not load shared lists. Check the Supabase database setup.');
  const rows = await response.json();
  return rows[0]?.data || null;
}

export async function saveSharedState(token, data) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/shared_state`, {
    method: 'POST', headers: { ...headers(token), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: 1, data, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error('Could not save shared lists.');
}
