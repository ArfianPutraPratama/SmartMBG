import React from 'react';
import TopbarProfile from '../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import './DashboardMitra.css';
import '../DashboardGuru/DashboardGuru.css'; // For common sidebar/layout styles
import SidebarMitra from './components/SidebarMitra';
import FWMitraStats from './FoodWasteMitra/components/FWMitraStats';
import FWMitraList from './FoodWasteMitra/components/FWMitraList';
import ProduktivitasMaggot from './components/ProduktivitasMaggot';
import AktivitasTerakhir from './components/AktivitasTerakhir';

const DashboardMitra = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarMitra />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Mitra Dapur" role="MITRA DAPUR" avatarText="M" />
          </div>
        </header>

        <div className="dashboard-content" style={{ padding: 0 }}>
          <div className="mitra-dashboard">

            {/* Page Header */}
            <div className="mitra-header-section">
              <div className="mitra-title-area">
                <h1>Dashboard Mitra</h1>
                <p>Pantau sisa makanan dan kelola pengolahan maggot Anda hari ini.</p>
              </div>
              <div className="mitra-date-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <FWMitraStats />
            <FWMitraList />

            <div className="mitra-bottom-grid">
              <ProduktivitasMaggot />
              <AktivitasTerakhir />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMitra;
