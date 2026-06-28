import React from 'react';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import './FoodWasteMitra.css';
import '../DashboardMitra.css'; // Common layout styles
import SidebarMitra from '../components/SidebarMitra';
import FWMitraStats from './components/FWMitraStats';
import FWMitraList from './components/FWMitraList';
import FWMitraMap from './components/FWMitraMap';
import FWMitraSchedule from './components/FWMitraSchedule';
import FWMitraNotif from './components/FWMitraNotif';

const FoodWasteMitra = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarMitra />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">Food Waste</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Mitra Dapur" role="MITRA DAPUR" avatarText="M" />
          </div>
        </header>

        <div className="dashboard-content" style={{padding: 0}}>
          <div className="fw-mitra-dashboard">
            <FWMitraStats />
            
            <div className="fw-mitra-grid-middle">
              <FWMitraList />
              <FWMitraMap />
            </div>

            <div className="fw-mitra-grid-bottom">
              <FWMitraSchedule />
              <FWMitraNotif />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodWasteMitra;
