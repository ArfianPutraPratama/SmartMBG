import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import './FoodWasteSPPG.css';
import '../DashboardSPPG.css'; // For layout stuff
import FoodWasteStats from './components/FoodWasteStats';
import FoodWasteMap from './components/FoodWasteMap';
import ManajemenEntitasTable from './components/ManajemenEntitasTable';
import TambahEntitasForm from './components/TambahEntitasForm';
import SidebarSPPG from '../components/SidebarSPPG';

const initialEntities = [];

const FoodWasteSPPG = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [entities, setEntities] = useState(initialEntities);

  useEffect(() => {
    // Fetch initial data from backend
    axios.get('http://localhost:8000/api/entitas')
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

  const handleSaveEntity = (newEntityData) => {
    // Post to backend
    const payload = {
      nama: newEntityData.nama,
      status_mbg: newEntityData.statusMBG,
      alamat: newEntityData.alamat,
      tipe: "Sekolah",
      catatan: null,
      lat: newEntityData.lat || (-7.35 + Math.random() * 0.15), // Use real location if provided, else fallback random
      lng: newEntityData.lng || (112.6 + Math.random() * 0.2)
    };

    axios.post('http://localhost:8000/api/entitas', payload)
      .then(response => {
        const item = response.data;
        let color = '#ffeb3b'; // Yellow default for Belum
        if(item.status_mbg === 'Sudah menerima MBG' || item.status_mbg === 'Sudah Mendapat MBG') color = 'green';
        if(item.status_mbg === 'Ada Food Waste') color = 'orange';

        const date = new Date(item.created_at);
        const formattedDate = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`;

        const newEntity = {
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

        setEntities([newEntity, ...entities]);
        setShowForm(false);
      })
      .catch(error => {
        console.error("Error saving entity:", error);
        alert("Gagal menyimpan entitas. Silakan coba lagi.");
      });
  };

  return (
    <div className="dashboard-layout">
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
          <div className="fw-container" style={{backgroundColor: '#f9f9f9', minHeight: '100%', padding: '32px'}}>
            
            {!showForm ? (
              <>
                {/* Page Header with Filters */}
                <div className="fw-header">
                  <div className="fw-header-top">
                    <h1>WebGIS Monitoring Distribusi MBG</h1>
                    <div className="fw-filters">
                      <select className="fw-filter-select">
                        <option>Semua Status</option>
                        <option>Sudah Diterima</option>
                        <option>Belum Diterima</option>
                      </select>
                      <select className="fw-filter-select">
                        <option>Kecamatan Ketintang</option>
                        <option>Kecamatan Wonokromo</option>
                      </select>
                    </div>
                  </div>
                  <p>Monitoring real-time status sekolah penerima Makan Bergizi Gratis (MBG) dan pengelolaan food waste.</p>
                </div>

                <FoodWasteStats />
                <FoodWasteMap entities={entities} />
                <ManajemenEntitasTable entities={entities} onAddClick={() => setShowForm(true)} />
              </>
            ) : (
              <TambahEntitasForm onCancel={() => setShowForm(false)} onSave={handleSaveEntity} />
            )}


          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodWasteSPPG;
