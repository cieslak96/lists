import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  useEffect(() => {
    import('./legacy.js');
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" id="homeBrand"><span className="brand-mark">l.</span><span>little list<small>OUR LIFE, COLLECTED</small></span></a>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav id="sideNav" className="side-nav" />
        <button className="nav-add" id="sidebarAdd"><span>＋</span> Create a list</button>
        <div className="sidebar-bottom"><div className="avatar-pair"><span>Y</span><span>C</span></div><div><b>You &amp; Chris</b><small>A little corner of the internet</small></div><span className="heart">♥</span></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button id="mobileMenu" className="icon-button mobile-menu" aria-label="Open menu">☰</button><div className="breadcrumb"><span>OUR SPACE</span><span className="crumb-slash">/</span><b id="crumbCurrent">ALL LISTS</b></div><div className="topbar-right"><span className="sync-dot" /><span>Saved on this device</span><button className="icon-button" id="searchToggle" aria-label="Search">⌕</button></div></header>
        <section id="homeView" className="view" />
        <section id="listView" className="view hidden" />
        <section id="detailView" className="view hidden" />
      </main>
      <div id="modalRoot" />
      <div id="toast" className="toast" />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
