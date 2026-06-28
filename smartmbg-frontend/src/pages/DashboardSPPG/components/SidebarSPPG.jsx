import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarSPPG = () => {
  const location = useLocation();
  const [username, setUsername] = useState('SPPG');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.username) {
          setUsername(userObj.username);
        } else if (userObj && userObj.name) {
          setUsername(userObj.name);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const getActiveClass = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 8C17 8 17 14 12 18C7 14 7 8 7 8C7 8 12 2 17 8Z" /></svg>
          </div>
          <div className="sidebar-title">
            <h2>SmartMBG</h2>
            <span style={{ textTransform: 'uppercase' }}>{username}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard-sppg" className={getActiveClass('/dashboard-sppg')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Dashboard
          </a>
          <a href="/dashboard-sppg/evaluasi-menu" className={getActiveClass('/dashboard-sppg/evaluasi-menu')}>
            <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            Keluhan
          </a>
          <a href="/dashboard-sppg/upload-sisa-makanan" className={getActiveClass('/dashboard-sppg/upload-sisa-makanan')}>
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Food Waste
          </a>
          <a href="/dashboard-sppg/food-waste" className={getActiveClass('/dashboard-sppg/food-waste')}>
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            WebGIS Monitoring
          </a>
        </nav>
      </aside>
    </>
  );
};

export default SidebarSPPG;
