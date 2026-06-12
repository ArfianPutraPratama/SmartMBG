import React from 'react';
import TopbarProfile from '../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../components/CurrentDate/CurrentDate';
import './DashboardSPPG.css';
import '../DashboardGuru/DashboardGuru.css'; // Reuse sidebar/header styles
import SidebarSPPG from './components/SidebarSPPG';
import mapImg from '../../assets/map_placeholder.png'; // Make sure this exists from previous step

const DashboardSPPG = () => {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="dashboard-content">
          
          {/* Top Stats Grid */}
          <div className="sppg-stats-grid">
            <div className="sppg-stat-card">
              <div className="sppg-stat-header">
                <div className="sppg-stat-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6"/></svg>
                </div>
                <div className="sppg-stat-badge positive">+12% vs bln lalu</div>
              </div>
              <div className="sppg-stat-title">Total Produksi</div>
              <div className="sppg-stat-value">1.250 <span className="sppg-stat-unit">Porsi</span></div>
            </div>
            
            <div className="sppg-stat-card">
              <div className="sppg-stat-header">
                <div className="sppg-stat-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div className="sppg-stat-badge positive">94% Selesai</div>
              </div>
              <div className="sppg-stat-title">Distribusi</div>
              <div className="sppg-stat-value">1.180 <span className="sppg-stat-unit">Porsi</span></div>
            </div>
            
            <div className="sppg-stat-card">
              <div className="sppg-stat-header">
                <div className="sppg-stat-icon red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </div>
                <div className="sppg-stat-badge warning">Perlu Review</div>
              </div>
              <div className="sppg-stat-title">Sisa Makanan</div>
              <div className="sppg-stat-value">20 <span className="sppg-stat-unit">Kg</span></div>
            </div>
            
            <div className="sppg-stat-card">
              <div className="sppg-stat-header">
                <div className="sppg-stat-icon green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                <div className="sppg-toggle-switch"></div>
              </div>
              <div className="sppg-stat-title">Rating Rata-rata</div>
              <div className="sppg-stat-value">4.7 <span className="sppg-stat-unit">/ 5.0</span></div>
            </div>
          </div>

          {/* List Distribusi */}
          <div className="sppg-list-card">
            <div className="sppg-list-header">
              <div>
                <h3>Distribusi Hari Ini</h3>
                <p>Status pengiriman ke sekolah-sekolah terdaftar</p>
              </div>
              <a href="#" className="sppg-list-link">Lihat Semua &rsaquo;</a>
            </div>
            <div className="sppg-list-content">
              <div className="sppg-list-item">
                <div className="sppg-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div className="sppg-item-details">
                  <div className="sppg-item-name">SDN Ketintang 1</div>
                  <div className="sppg-item-addr">Jl. Ketintang Baru No. 12 &bull; 320 Porsi</div>
                </div>
                <div className="sppg-status-badge success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Terkirim
                </div>
                <div className="sppg-item-arrow">&rsaquo;</div>
              </div>

              <div className="sppg-list-item">
                <div className="sppg-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div className="sppg-item-details">
                  <div className="sppg-item-name">SDN Wonokromo 2</div>
                  <div className="sppg-item-addr">Jl. Wonokromo No. 45 &bull; 280 Porsi</div>
                </div>
                <div className="sppg-status-badge success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Terkirim
                </div>
                <div className="sppg-item-arrow">&rsaquo;</div>
              </div>

              <div className="sppg-list-item">
                <div className="sppg-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <div className="sppg-item-details">
                  <div className="sppg-item-name">SDN Jemur Wonosari 1</div>
                  <div className="sppg-item-addr">Jl. Jemur No. 8 &bull; 300 Porsi</div>
                </div>
                <div className="sppg-status-badge process">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-8.2l-5.67-5.67"/></svg>
                  Dalam Proses
                </div>
                <div className="sppg-item-arrow">&rsaquo;</div>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="sppg-bottom-grid">
            <div className="sppg-action-card">
              <h3>Mulai Produksi Baru?</h3>
              <p>Update ketersediaan bahan baku dan jumlah porsi harian untuk mulai masak.</p>
              <button className="sppg-btn-white">Input Produksi</button>
            </div>
            
            <div className="sppg-map-card">
              <div className="sppg-map-info">
                <h3>Lokasi Kurir Real-time</h3>
                <p>3 Armada pengiriman sedang aktif di wilayah Surabaya Selatan.</p>
                <div className="sppg-map-status">
                  <span><div className="dot-active"></div> AKTIF</span>
                  <span><div className="dot-standby"></div> STANDBY</span>
                </div>
              </div>
              <img src={mapImg} alt="Map" className="sppg-map-img" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardSPPG;
