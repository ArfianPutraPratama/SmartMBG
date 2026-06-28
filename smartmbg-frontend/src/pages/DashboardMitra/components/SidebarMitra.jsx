import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarMitra = () => {
  const location = useLocation();
  const [username, setUsername] = useState('MITRA DAPUR');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj && userObj.username) {
          setUsername(userObj.username);
        } else if (userObj && userObj.name) {
          setUsername(userObj.name); // Fallback if username is somehow empty
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
          <a href="/dashboard-mitra" className={getActiveClass('/dashboard-mitra')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Dashboard
          </a>
          <a href="/dashboard-mitra/food-waste" className={getActiveClass('/dashboard-mitra/food-waste')}>
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            Food Waste
          </a>
          <a href="/dashboard-mitra/laporan" className={getActiveClass('/dashboard-mitra/laporan')}>
            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            Laporan
          </a>
          <a href="/dashboard-mitra/webgis" className={getActiveClass('/dashboard-mitra/webgis')}>
            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            WebGIS Monitoring
          </a>
        </nav>
      </aside>
    </>
  );
};

export default SidebarMitra;
