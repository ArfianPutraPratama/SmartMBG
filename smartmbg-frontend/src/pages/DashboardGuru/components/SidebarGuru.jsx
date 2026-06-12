import React from 'react';
import { useLocation } from 'react-router-dom';

const SidebarGuru = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };

  return (
    <>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C17 8 17 14 12 18C7 14 7 8 7 8C7 8 12 2 17 8Z"/>
            </svg>
          </div>
          <div className="sidebar-title">
            <h2>SmartMBG</h2>
            <span>SDN KEBRAON 1</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <a href="/dashboard-guru" className={getActiveClass('/dashboard-guru')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a href="/analisis-gizi" className={getActiveClass('/analisis-gizi')}>
            <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Artifical Intelegence
          </a>
          <a href="/evaluasi-ulasan" className={getActiveClass('/evaluasi-ulasan')}>
            <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Keluhan
          </a>
          <a className="nav-item">
            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Laporan
          </a>
        </nav>
      </aside>
    </>
  );
};

export default SidebarGuru;
