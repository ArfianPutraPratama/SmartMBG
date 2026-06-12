import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarSPPG from '../components/SidebarSPPG';
import './RiwayatDistribusiSPPG.css';

const RiwayatDistribusiSPPG = () => {
  const [distribusiList, setDistribusiList] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('sppg_distribusi_data');
    if (saved) {
      setDistribusiList(JSON.parse(saved));
    } else {
      // Default hardcoded data to initialize
      const defaultData = [
        { id: 1, tanggal: '23 Mei 2025', namaSekolah: 'SDN Ketintang 1 Surabaya', totalPorsi: '450 Box', status: 'Delivered', waktu: '09:15 WIB', detailInfo: '' },
        { id: 2, tanggal: '23 Mei 2025', namaSekolah: 'SMPN 12 Surabaya', totalPorsi: '820 Box', status: 'In Progress', waktu: 'Estimasi 11:00', detailInfo: '' },
        { id: 3, tanggal: '22 Mei 2025', namaSekolah: 'SDK Petra 1', totalPorsi: '320 Box', status: 'Delivered', waktu: '08:45 WIB', detailInfo: '' },
        { id: 4, tanggal: '22 Mei 2025', namaSekolah: 'SMKN 1 Surabaya', totalPorsi: '1,200 Box', status: 'Delayed', waktu: '09:55 WIB (+25m)', detailInfo: '' },
        { id: 5, tanggal: '21 Mei 2025', namaSekolah: 'TK Pembina Nasional', totalPorsi: '150 Box', status: 'Delivered', waktu: '08:10 WIB', detailInfo: '' }
      ];
      setDistribusiList(defaultData);
      localStorage.setItem('sppg_distribusi_data', JSON.stringify(defaultData));
    }
  }, []);

  const getStatusClass = (status) => {
    if (status === 'Delivered') return 'delivered';
    if (status === 'Delayed') return 'delayed';
    return 'inprogress';
  };

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

        <div className="sppg-rd-container">
          
          {/* Breadcrumbs */}
          <div className="sppg-rd-breadcrumbs">
            <Link to="/sppg/dashboard">Distribusi</Link> &rsaquo; <span>Laporan</span> &rsaquo; <span className="active">Riwayat</span>
          </div>

          {/* Page Header */}
          <div className="sppg-rd-header">
            <h2>Riwayat Distribusi</h2>
            <div className="sppg-rd-header-actions">
              <button className="sppg-rd-btn-export">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export Data
              </button>
              <Link to="/dashboard-sppg/tambah-distribusi" className="sppg-rd-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Input Distribusi
              </Link>
            </div>
          </div>

          <div className="sppg-rd-card">
            
            {/* Filter Bar */}
            <div className="sppg-rd-filters">
              <div className="sppg-rd-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Cari Nama Sekolah..." />
              </div>
              <div className="sppg-rd-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="text" defaultValue="21 Mei - 23 Mei 2025" />
              </div>
              <div className="sppg-rd-select-wrapper">
                <svg className="sppg-rd-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                <select className="sppg-rd-select">
                  <option>Semua Status</option>
                  <option>Delivered</option>
                  <option>In Progress</option>
                  <option>Delayed</option>
                </select>
              </div>
              <button className="sppg-rd-reset">Reset Filter</button>
            </div>

            {/* Table Header Section */}
            <div className="sppg-rd-table-top">
              <h3>Data Distribusi</h3>
              <span>MENAMPILKAN {distribusiList.length} HASIL</span>
            </div>

            {/* Table */}
            <div className="sppg-rd-table-container">
              <table className="sppg-rd-table">
                <thead>
                  <tr>
                    <th>TANGGAL</th>
                    <th>NAMA SEKOLAH</th>
                    <th>TOTAL PORSI</th>
                    <th>STATUS</th>
                    <th>WAKTU TERIMA</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.tanggal}</td>
                      <td className="sppg-rd-school-name">{item.namaSekolah}</td>
                      <td>{item.totalPorsi}</td>
                      <td><span className={`sppg-rd-badge ${getStatusClass(item.status)}`}>{item.status}</span></td>
                      <td>{item.waktu}</td>
                      <td><a href="#" onClick={(e) => e.preventDefault()} className="sppg-rd-action-link">Lihat Detail</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="sppg-rd-pagination">
              <div className="sppg-rd-page-info">
                Halaman 1 dari 13
              </div>
              <div className="sppg-rd-page-controls">
                <button className="sppg-rd-page-btn prev" disabled>&lsaquo;</button>
                <button className="sppg-rd-page-btn active">1</button>
                <button className="sppg-rd-page-btn">2</button>
                <button className="sppg-rd-page-btn">3</button>
                <span className="sppg-rd-page-dots">...</span>
                <button className="sppg-rd-page-btn">13</button>
                <button className="sppg-rd-page-btn next">&rsaquo;</button>
              </div>
            </div>

          </div>

          <div className="sppg-rd-footer">
            &copy; 2025 SmartMBG System - Monitoring Gizi & Distribusi Pangan
          </div>

        </div>
      </main>
    </div>
  );
};

export default RiwayatDistribusiSPPG;
