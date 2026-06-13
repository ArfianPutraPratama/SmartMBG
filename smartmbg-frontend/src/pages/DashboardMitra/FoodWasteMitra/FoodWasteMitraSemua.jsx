import React from 'react';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import SidebarMitra from '../components/SidebarMitra';
import FWMitraList from './components/FWMitraList';
import '../DashboardMitra.css'; 

const FoodWasteMitraSemua = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <SidebarMitra />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">
            <button 
              onClick={() => navigate('/dashboard-mitra/food-waste')}
              style={{background: 'none', border: 'none', color: '#1a5d2c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', padding: 0, fontSize: '1.2rem'}}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali ke Dashboard
            </button>
          </div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Mitra Dapur" role="MITRA DAPUR" avatarText="M" />
          </div>
        </header>
        <div className="dashboard-content" style={{padding: '32px 40px', backgroundColor: '#f9f9f9', flex: 1, overflowY: 'auto'}}>
          <FWMitraList isFullView={true} />
        </div>
      </main>
    </div>
  );
};

export default FoodWasteMitraSemua;
