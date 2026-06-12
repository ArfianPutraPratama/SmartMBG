import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import SidebarSPPG from '../components/SidebarSPPG';
import './TambahDistribusiSPPG.css';

const TambahDistribusiSPPG = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Special Header for this page */}
        <header className="dashboard-topbar sppg-td-topbar">
          <div className="sppg-td-topbar-left" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <h2>Tambah Laporan Distribusi</h2>
          </div>
          <div className="topbar-right sppg-td-topbar-right-custom">
            <div className="sppg-td-date-info">
              <span className="sppg-td-date">23 Mei 2025</span>
              <span className="sppg-td-day">JUMAT</span>
            </div>
            <div className="sppg-td-divider"></div>
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="Logistics Manager" avatarText="A" />
          </div>
        </header>

        <div className="sppg-td-container">
          
          {/* Breadcrumbs */}
          <div className="sppg-rd-breadcrumbs">
            <Link to="/dashboard-sppg/dashboard">Distribusi</Link> &rsaquo; <Link to="/dashboard-sppg/riwayat-distribusi">Laporan</Link> &rsaquo; <span className="active">Tambah Data</span>
          </div>

          <div className="sppg-td-card">
            <div className="sppg-td-card-header">
              <h3>Informasi Pengiriman</h3>
              <p>Silakan lengkapi formulir di bawah ini untuk mencatat distribusi makanan harian.</p>
            </div>

            <form className="sppg-td-form" onSubmit={(e) => e.preventDefault()}>
              
              <div className="sppg-td-grid">
                {/* Nama Sekolah */}
                <div className="sppg-td-form-group">
                  <label>Nama Sekolah</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <input type="text" placeholder="Cari atau pilih sekolah..." />
                  </div>
                </div>

                {/* Status Pengiriman */}
                <div className="sppg-td-form-group">
                  <label>Status Pengiriman</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <select defaultValue="inprogress">
                      <option value="delivered">Selesai (Delivered)</option>
                      <option value="inprogress">Dalam Perjalanan (In Progress)</option>
                      <option value="delayed">Terlambat (Delayed)</option>
                    </select>
                    <svg className="sppg-td-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                {/* Tanggal Distribusi */}
                <div className="sppg-td-form-group">
                  <label>Tanggal Distribusi</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input type="text" defaultValue="05/23/2025" />
                  </div>
                </div>

                {/* Waktu Pengiriman */}
                <div className="sppg-td-form-group">
                  <label>Waktu Pengiriman</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <input type="text" defaultValue="10:30 AM" />
                  </div>
                </div>

                {/* Total Porsi */}
                <div className="sppg-td-form-group">
                  <label>Total Porsi</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
                    <input type="text" placeholder="Contoh: 150" />
                    <span className="sppg-td-suffix">BOX</span>
                  </div>
                </div>

                {/* Nama Kurir / Driver */}
                <div className="sppg-td-form-group">
                  <label>Nama Kurir / Driver</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" placeholder="Masukkan nama pengemudi..." />
                  </div>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="sppg-td-form-group sppg-td-full-width">
                <label>Catatan Tambahan</label>
                <div className="sppg-td-input-wrapper textarea-wrapper">
                  <textarea placeholder="Informasi tambahan mengenai rute, kendala, atau instruksi khusus..."></textarea>
                </div>
              </div>

              {/* Actions */}
              <div className="sppg-td-actions">
                <button type="button" className="sppg-td-btn-cancel" onClick={() => navigate(-1)}>Batal</button>
                <button type="submit" className="sppg-td-btn-save">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Simpan Data
                </button>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TambahDistribusiSPPG;
