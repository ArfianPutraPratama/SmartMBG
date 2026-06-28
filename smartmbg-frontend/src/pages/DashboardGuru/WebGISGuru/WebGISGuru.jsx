import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarGuru from '../components/SidebarGuru';
import FoodWasteMap from '../../DashboardSPPG/FoodWasteSPPG/components/FoodWasteMap';
import '../../DashboardSPPG/FoodWasteSPPG/FoodWasteSPPG.css';
import '../DashboardGuru.css';

const initialEntities = [];

const WebGISGuru = () => {
  const [entities, setEntities] = useState(initialEntities);

  useEffect(() => {
    // Fetch initial data from backend
    axios.get('https://smart-mbg-coral.vercel.app/api/entitas')
      .then(response => {
        // Map database response to frontend state format if needed
        const fetchedEntities = response.data.map(item => {
          let color = '#ffeb3b'; // Yellow default for Belum
          if(item.status_mbg === 'Sudah menerima MBG' || item.status_mbg === 'Sudah Mendapat MBG') color = 'green';
          if(item.status_mbg === 'Ada Food Waste') color = 'orange';

          const date = new Date(item.created_at);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`;

          return {
            id: item.id,
            nama: item.nama,
            tipe: item.tipe,
            statusMBG: item.status_mbg,
            alamat: item.alamat,
            tanggal: formattedDate,
            statusColor: color,
            lat: item.lat,
            lng: item.lng
          };
        });
        setEntities(fetchedEntities);
      })
      .catch(error => {
        console.error("Error fetching entities:", error);
      });
  }, []);

  return (
    <div className="dashboard-layout">
      <SidebarGuru />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Pramsus Pr" role="GURU" avatarText="P" />
          </div>
        </header>

        <div className="dashboard-content" style={{padding: 0}}>
          <div className="fw-container" style={{backgroundColor: '#f9f9f9', minHeight: '100%', padding: '32px'}}>
            
            {/* Page Header */}
            <div className="fw-header">
              <div className="fw-header-top">
                <h1>WebGIS Monitoring Distribusi MBG</h1>
              </div>
              <p>Monitoring real-time status sekolah penerima Makan Bergizi Gratis (MBG) dan pengelolaan food waste.</p>
            </div>

            <FoodWasteMap entities={entities} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default WebGISGuru;
