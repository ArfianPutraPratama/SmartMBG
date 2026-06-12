import React from 'react';
import TopbarProfile from '../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import SidebarGuru from './components/SidebarGuru';
import './DashboardGuru.css';
import nasiImg from '../../assets/nasi_putih.png';
import ayamImg from '../../assets/ayam_kecap.png';
import sayurImg from '../../assets/sayur_bayam.png';
import jerukImg from '../../assets/jeruk.png';

const DashboardGuru = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarGuru />

      {/* Main Container */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Halo, Ibu Siti! <span>👋</span></h1>
              <p>Berikut ringkasan nutrisi sekolah Anda hari ini.</p>
            </div>
            <div className="date-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Senin, 18 November 2024
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Siswa Terlayani</span>
                <div className="stat-icon icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              </div>
              <h2 className="stat-value">320</h2>
              <span className="stat-desc">Orang</span>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Menu Hari Ini</span>
                <div className="stat-icon icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <h2 className="stat-value">4</h2>
              <span className="stat-desc">Jenis</span>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Rata-rata Ulasan</span>
                <div className="stat-icon icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <h2 className="stat-value">4.6/5</h2>
              <span className="stat-desc">Baik</span>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Sisa Makanan</span>
                <div className="stat-icon icon-red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </div>
              </div>
              <h2 className="stat-value">12</h2>
              <span className="stat-desc">Kg</span>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header">
              <h3 className="section-title">Menu Hari Ini</h3>
              <a href="#" className="link-green">Lihat Detail &gt;</a>
            </div>
            <div className="menu-grid">
              <div className="menu-card">
                <img src={nasiImg} alt="Nasi Putih" className="menu-img" />
                <h4 className="menu-name">Nasi Putih</h4>
                <p className="menu-type">Karbohidrat Utama</p>
              </div>
              <div className="menu-card">
                <img src={ayamImg} alt="Ayam Kecap" className="menu-img" />
                <h4 className="menu-name">Ayam Kecap</h4>
                <p className="menu-type">Sumber Protein</p>
              </div>
              <div className="menu-card">
                <img src={sayurImg} alt="Sayur Bayam" className="menu-img" />
                <h4 className="menu-name">Sayur Bayam</h4>
                <p className="menu-type">Serat &amp; Vitamin</p>
              </div>
              <div className="menu-card">
                <img src={jerukImg} alt="Jeruk" className="menu-img" />
                <h4 className="menu-name">Jeruk</h4>
                <p className="menu-type">Vitamin C Alami</p>
              </div>
            </div>
          </div>

          <div className="section-container">
            <h3 className="section-title" style={{marginBottom: '20px'}}>
              <div className="stat-icon icon-green" style={{display:'inline-flex', verticalAlign:'middle', marginRight:'8px'}}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              Analisis Gizi (AI) - 1 Porsi
            </h3>
            
            <div className="nutrition-grid">
              <div className="nutrition-card">
                <div className="nut-label">Kalori</div>
                <div className="nut-val">650</div>
                <div className="nut-unit">kkal</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Protein</div>
                <div className="nut-val">18.3</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Lemak</div>
                <div className="nut-val">16.8</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Karbohidrat</div>
                <div className="nut-val">53.3</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Serat</div>
                <div className="nut-val">8.2</div>
                <div className="nut-unit">g</div>
              </div>
            </div>

            <div className="alert-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div className="alert-text">
                <h4>Rekomendasi Ahli Gizi</h4>
                <p>Menu hari ini telah memenuhi 35% kebutuhan gizi harian siswa sekolah dasar. Kandungan protein cukup untuk mendukung tumbuh kembang anak.</p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="dashboard-footer">
          © 2024 SmartMBG - Sekolah Sehat, Nutrisi Terjaga.
        </footer>
      </main>

    </div>
  );
};

export default DashboardGuru;
