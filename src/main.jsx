import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { authenticateEmail, loadSharedState, restoreSession, saveSharedState, signOut } from './cloud.js';
import './styles.css';

function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    restoreSession().then(setSession).catch(() => setSession(null)).finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!session) return;
    window.__LITTLE_LIST_SESSION__ = session;
    let cancelled = false;
    loadSharedState(session.access_token).then((shared) => {
      if (cancelled) return;
      if (shared?.lists) {
        window.__LITTLE_LIST_SHARED__ = shared;
        try { localStorage.setItem('little-list-v1', JSON.stringify(shared)); }
        catch { try { localStorage.removeItem('little-list-v1'); } catch {} }
      } else {
        let cached = null;
        try { cached = JSON.parse(localStorage.getItem('little-list-v1')); } catch {}
        if (cached?.lists) {
          return saveSharedState(session.access_token, cached);
        }
      }
    }).then(() => {
      if (!cancelled) import('./legacy.js');
    }).catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, [session]);

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const name = String(form.get('name')).trim().toLocaleLowerCase('en');
      const email = String(form.get('email')).trim().toLowerCase();
      const allowed = { angela: 'cieslak.96@proton.me', christopher: 'christopher.ry.lewis@gmail.com' };
      if (allowed[name] !== email) throw new Error('Esse nome e email não correspondem a uma das duas pessoas autorizadas.');
      const result = await authenticateEmail(email, String(form.get('password')), mode === 'signup');
      if (result.confirmationRequired) setError('Cadastro criado. Confirme o email recebido e depois entre com sua senha.');
      else setSession(result);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  if (!ready) return <div className="auth-screen"><p>Opening your shared lists…</p></div>;
  if (!session) return <main className="auth-screen"><form className="auth-card" onSubmit={submit}>
    <div className="brand-mark auth-mark">l.</div><p className="auth-eyebrow">OUR LIFE, COLLECTED</p>
    <h1>{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</h1>
    <p className="auth-copy">Sign in with one of the two authorized email addresses.</p>
    <label className="field">Name<input name="name" autoComplete="name" required /></label>
    <label className="field">Email<input name="email" type="email" autoComplete="email" required /></label>
    <label className="field">Password<input name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength="6" required /></label>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <button className="primary-button auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
    <button className="auth-switch" type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>{mode === 'signin' ? 'First time? Create your account' : 'Already registered? Sign in'}</button>
  </form></main>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <section className="sidebar-landmarks" aria-labelledby="sidebarLandmarksTitle">
          <div id="sidebarLandmarksTitle" className="sidebar-label">THE MOST IMPORTANT LIST</div>
          <div id="sidebarLandmarkLinks" className="sidebar-landmark-links" />
          <button type="button" className="sidebar-landmark-add" data-add-landmark>＋ Add landmark</button>
        </section>
        <nav id="sideNav" className="side-nav hidden" aria-label="Your lists" />
        <button type="button" className="sidebar-bottom" id="profileSidebarButton" aria-label="Open profiles"><div className="avatar-pair" id="sidebarProfileAvatars" /><div><b id="sidebarProfileNames">Angela &amp; Chris</b></div></button>
      </aside>
      <main className="main-content">
        <header className="topbar"><nav id="mobileNav" className="mobile-list-nav" aria-label="Relationship landmarks" /><div className="topbar-right"><button className="icon-button" id="searchToggle" aria-label="Search">⌕</button><button className="auth-signout" onClick={() => { signOut(); window.location.reload(); }}>Sign out</button><button type="button" className="profile-avatar-button" id="profileToggle" aria-label="Open your profile" /></div></header>
        <section id="homeView" className="view" />
        <section id="listView" className="view hidden" />
        <section id="detailView" className="view hidden" />
        <section id="profileView" className="view hidden" />
      </main>
      <div id="modalRoot" />
      <div id="toast" className="toast" />
      {error && <div className="cloud-error" role="alert">{error}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
