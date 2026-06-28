import React, { useState } from 'react';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import './UploadSisaMakanan.css';
import '../DashboardSPPG.css'; // For common layout
import SidebarSPPG from '../components/SidebarSPPG';
import UploadForm from './components/UploadForm';
import MitraInfo from './components/MitraInfo';
import RiwayatSisaMakanan from './components/RiwayatSisaMakanan';
import LokasiTersediaMap from './components/LokasiTersediaMap';

const UploadSisaMakanan = () => {
  const navigate = useNavigate();

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

        <div className="dashboard-content" style={{padding: 0}}>
          <div className="upload-sisa-dashboard">
            <div className="upload-sisa-grid">
              
              <div className="upload-sisa-column">
                <UploadForm />
                <MitraInfo />
              </div>
              
              <div className="upload-sisa-column">
                <RiwayatSisaMakanan />
                <LokasiTersediaMap />
              </div>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadSisaMakanan;
