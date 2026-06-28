import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarSPPG from '../components/SidebarSPPG';
import axios from '../../../api/axios';
import './DetailDistribusiSPPG.css';

const DetailDistribusiSPPG = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [distribusi, setDistribusi] = useState(null);
  const [sekolahDetail, setSekolahDetail] = useState(null);

  useEffect(() => {
    // Get Data from LocalStorage
    const existingData = JSON.parse(localStorage.getItem('sppg_distribusi_data') || '[]');
    const item = existingData.find(d => d.id.toString() === id);
    if (item) {
      setDistribusi(item);
      
      // Fetch schools to get address if available
      axios.get('/schools').then(res => {
        const school = res.data.find(s => s.name === item.namaSekolah);
        if (school) {
          setSekolahDetail(school);
        }
      }).catch(err => console.error(err));
    }
  }, [id]);

  if (!distribusi) {
    return (
      <div className="dashboard-layout">
        <SidebarSPPG />
        <main className="dashboard-main" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h2>Data tidak ditemukan.</h2>
        </main>
      </div>
    );
  }

  // Formatting tools
  const isDelivered = distribusi.status === 'Delivered';
  const badgeClass = isDelivered ? 'delivered' : (distribusi.status === 'Delayed' ? 'delayed' : 'inprogress');
  const badgeText = isDelivered ? 'Selesai (Delivered)' : (distribusi.status === 'Delayed' ? 'Terlambat (Delayed)' : 'Dalam Perjalanan');
  
  // Dummy generate ID if not exists
  const displayId = `#DIST-${distribusi.tanggal.replace(/\D/g, '')}-${id.substring(id.length - 4)}`;

  return (
    <div className="dashboard-layout">
      <SidebarSPPG />

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar sppg-td-topbar">
          <div className="sppg-td-topbar-left" onClick={() => navigate(-1)} style={{cursor: 'pointer'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a5d2c" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <h2 style={{ color: '#1a5d2c', margin: 0, fontSize: '18px' }}>Detail Laporan Distribusi</h2>
          </div>
          <div className="topbar-right sppg-td-topbar-right-custom">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="Logistics" avatarText="A" />
          </div>
        </header>

        <div className="sppg-detail-container">
          
          {/* Action Header */}
          <div className="sppg-detail-header-actions">
            <div className="sppg-detail-status-info">
              <span className="sppg-detail-id" style={{fontWeight: '600'}}>ID Laporan: {displayId}</span>
            </div>
            <div className="sppg-detail-buttons">
              <button className="sppg-detail-btn-outline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Cetak Laporan
              </button>
              <button className="sppg-detail-btn-primary" onClick={() => navigate(`/dashboard-sppg/edit-distribusi/${distribusi.id}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Data
              </button>
            </div>
          </div>

          <div className="sppg-detail-grid">
            {/* Left Card: Informasi Pengiriman */}
            <div className="sppg-detail-card left-card">
              <div className="sppg-card-title-row">
                <div>
                  <h3>Informasi Pengiriman</h3>
                  <p>Data tujuan dan penjadwalan distribusi</p>
                </div>
                <div className="sppg-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
              </div>

              <div className="sppg-info-split">
                <div className="sppg-info-col">
                  <div className="sppg-info-group">
                    <label>Nama Sekolah</label>
                    <div className="sppg-info-value school-value">
                      <div className="sppg-school-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      </div>
                      {distribusi.namaSekolah}
                    </div>
                  </div>
                  <div className="sppg-info-group mt-3">
                    <label>Jam Keberangkatan</label>
                    <div className="sppg-info-value time-value">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {distribusi.waktu}
                    </div>
                  </div>
                </div>

                <div className="sppg-route-col">
                  <div className="sppg-route-box">
                    <span className="route-label">Estimasi Rute</span>
                    <div className="route-timeline">
                      <div className="route-point origin">
                        <div className="dot green-dot"></div>
                        <div className="route-text">
                          <strong>SPPG Pusat</strong>
                          <span>Origin</span>
                        </div>
                      </div>
                      <div className="route-line"></div>
                      <div className="route-point destination">
                        <div className="dot red-dot"></div>
                        <div className="route-text">
                          <strong>{distribusi.namaSekolah}</strong>
                          <span>Destination</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sppg-notes-box">
                <label>Catatan Tambahan</label>
                <div className="sppg-notes-content">
                  {distribusi.catatan || 'Tidak ada catatan tambahan untuk pengiriman ini.'}
                </div>
              </div>
            </div>

            {/* Right Card: Detail Logistik */}
            <div className="sppg-detail-card right-card">
              <h3>Detail Logistik</h3>
              
              <div className="logistic-item">
                <div className="logistic-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5d2c" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  Total Muatan
                </div>
                <div className="logistic-value highlight">{distribusi.totalPorsi}</div>
              </div>

              <div className="logistic-item">
                <div className="logistic-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5d2c" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Nama Driver
                </div>
                <div className="logistic-value">{distribusi.kurir || '-'}</div>
              </div>

              <div className="logistic-item" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                <div className="logistic-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a5d2c" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Status Armada
                </div>
                <div className="logistic-value status-ok" style={{ background: '#eaf3ed', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', marginLeft: '32px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Dalam Perjalanan
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailDistribusiSPPG;
