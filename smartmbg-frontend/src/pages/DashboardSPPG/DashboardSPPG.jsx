import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopbarProfile from '../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../components/CurrentDate/CurrentDate';
import axios from '../../api/axios';
import './DashboardSPPG.css';
import '../DashboardGuru/DashboardGuru.css'; // Reuse sidebar/header styles
import SidebarSPPG from './components/SidebarSPPG';

const DashboardSPPG = () => {
  const [latestReviews, setLatestReviews] = useState([]);
  const [distribusiList, setDistribusiList] = useState([]);
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    // Fetch Latest Reviews
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/reviews');
        // Sort descending by date and take the top 2
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLatestReviews(sorted.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();

    // Fetch Schools for Address (Wilayah)
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/schools');
        setSchools(response.data);
      } catch (err) {
        console.error('Failed to fetch schools:', err);
      }
    };
    fetchSchools();

    // Fetch Distribusi Data
    const savedDistribusi = localStorage.getItem('sppg_distribusi_data');
    if (savedDistribusi) {
      setDistribusiList(JSON.parse(savedDistribusi).slice(0, 3));
    } else {
      const defaultData = [
        { id: 1, tanggal: '23 Mei 2025', namaSekolah: 'SDN Ketintang 1 Surabaya', totalPorsi: '450 Box', status: 'Delivered', waktu: '09:15 WIB', wilayah: 'Ketintang', kurir: 'Budi Santoso' },
        { id: 2, tanggal: '23 Mei 2025', namaSekolah: 'SMPN 12 Surabaya', totalPorsi: '820 Box', status: 'In Progress', waktu: 'Estimasi 11:00', wilayah: 'Ngagel', kurir: 'Siti Aminah' },
        { id: 3, tanggal: '22 Mei 2025', namaSekolah: 'SDK Petra 1', totalPorsi: '320 Box', status: 'Delivered', waktu: '08:45 WIB', wilayah: 'Manyar', kurir: 'Andi Wijaya' }
      ];
      setDistribusiList(defaultData);
      localStorage.setItem('sppg_distribusi_data', JSON.stringify(defaultData));
    }
  }, []);
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

        <div className="sppg-dashboard-container">
          
          {/* Overview Header */}
          <div className="sppg-overview-header">
            <div className="sppg-overview-title">
              <h2>Dashboard Overview</h2>
              <p>Monitoring SPPG daily performance and logistics sustainability.</p>
            </div>
            <button className="sppg-btn-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Cetak Laporan
            </button>
          </div>

          {/* Top Stats Grid */}
          <div className="sppg-stats-row">
            {/* Stat 1: Total Distribusi */}
            <div className="sppg-stat-card-new">
              <div className="sppg-stat-info">
                <span className="sppg-stat-label">TOTAL DISTRIBUSI</span>
                <div className="sppg-stat-value">12,450</div>
                <div className="sppg-stat-trend positive">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                  +5.2% dari kemarin
                </div>
              </div>
              <div className="sppg-stat-icon-wrapper green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 21H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h5l2 3h9a2 2 0 0 1 2 2v2M19 15v6M16 18h6"/></svg>
              </div>
            </div>

            {/* Stat 2: Rata-rata Rating */}
            <div className="sppg-stat-card-new">
              <div className="sppg-stat-info">
                <span className="sppg-stat-label">RATA-RATA RATING</span>
                <div className="sppg-stat-value">
                  4.8
                  <span className="sppg-stars">
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg className="empty" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </span>
                </div>
                <div className="sppg-stat-trend neutral">
                  Berdasarkan 850 ulasan
                </div>
              </div>
              <div className="sppg-stat-icon-wrapper green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><polygon points="12 6 13.54 9.12 17 9.62 14.5 12.06 15.09 15.5 12 13.88 8.91 15.5 9.5 12.06 7 9.62 10.46 9.12 12 6"/></svg>
              </div>
            </div>

            {/* Stat 3: Total Food Waste */}
            <div className="sppg-stat-card-new">
              <div className="sppg-stat-info">
                <span className="sppg-stat-label">TOTAL FOOD WASTE</span>
                <div className="sppg-stat-value">42.5 <span className="sppg-stat-unit">Kg</span></div>
                <div className="sppg-stat-trend negative">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                  -2.1% (Eco Target)
                </div>
              </div>
              <div className="sppg-stat-icon-wrapper red">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
            </div>
          </div>

          {/* Riwayat Distribusi */}
          <div className="sppg-section-card">
            <div className="sppg-section-header">
              <h3 className="sppg-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                Riwayat Distribusi
              </h3>
              <div className="sppg-section-actions">
                <select className="sppg-select">
                  <option>Semua Wilayah</option>
                  <option>Jakarta Pusat</option>
                  <option>Jakarta Selatan</option>
                </select>
                <Link to="/dashboard-sppg/riwayat-distribusi" className="sppg-link-action">Lihat Semua</Link>
              </div>
            </div>
            
            <table className="sppg-table">
              <thead>
                <tr>
                  <th>Nama Sekolah</th>
                  <th>Wilayah</th>
                  <th>Status</th>
                  <th>Kurir</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {distribusiList.length > 0 ? (
                  distribusiList.map((item) => {
                    let badgeClass = 'delivered';
                    if (item.status === 'In Progress') badgeClass = 'inprogress';
                    if (item.status === 'Delayed') badgeClass = 'delayed';

                    // Cari alamat sekolah dari data users
                    const schoolData = schools.find(s => s.name === item.namaSekolah);
                    const wilayahDisplay = schoolData && schoolData.address ? schoolData.address : (item.wilayah || '-');

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="sppg-table-school">
                            <div className="sppg-school-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                            </div>
                            {item.namaSekolah}
                          </div>
                        </td>
                        <td>{wilayahDisplay}</td>
                        <td><span className={`sppg-badge ${badgeClass}`}>{item.status.toUpperCase()}</span></td>
                        <td>{item.kurir || '-'}</td>
                        <td>{item.waktu || '-'}</td>
                        <td className="sppg-table-arrow">&rsaquo;</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#666'}}>Belum ada data distribusi terbaru.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ulasan Terbaru */}
          <div className="sppg-section-card">
            <div className="sppg-section-header">
              <h3 className="sppg-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Ulasan Terbaru
              </h3>
              <Link to="/dashboard-sppg/evaluasi-menu" className="sppg-link-action">Lihat Semua Review</Link>
            </div>
            
            <div className="sppg-reviews-grid">
              {latestReviews.length > 0 ? (
                latestReviews.map((review) => (
                  <div key={review.id} className="sppg-review-card">
                    <div className="sppg-review-header">
                      <div className="sppg-review-user">
                        <div className="sppg-avatar">{review.school_name ? review.school_name.substring(0, 2).toUpperCase() : 'SK'}</div>
                        <div className="sppg-user-info">
                          <h4>{review.school_name}</h4>
                          <span>{new Date(review.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</span>
                        </div>
                      </div>
                      <div className="sppg-stars">
                        {[...Array(5)].map((_, index) => (
                          <svg key={index} viewBox="0 0 24 24" className={index >= Math.floor(review.rating) ? "empty" : ""}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="sppg-review-text">
                      "{review.description || 'Tidak ada deskripsi'}"
                    </div>
                    <div className="sppg-review-footer">
                      <div className={`sppg-review-status ${review.is_match ? 'verified' : 'attention'}`}>
                        {review.is_match ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Verified Feedback
                          </>
                        ) : (
                          <>! Needs Attention</>
                        )}
                      </div>
                      <button className="sppg-btn-balas">Balas</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#666'}}>
                  Belum ada ulasan terbaru.
                </div>
              )}
            </div>
            

          </div>

          {/* Riwayat Food Waste */}
          <div className="sppg-section-card">
            <div className="sppg-section-header">
              <h3 className="sppg-section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Riwayat Food Waste
              </h3>
              <div className="sppg-section-actions">
                <select className="sppg-select">
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
            </div>
            
            <div className="sppg-fw-split">
              {/* Chart Side */}
              <div className="sppg-fw-chart-col">
                <h4>Volume Tren (Kg)</h4>
                <div className="sppg-mock-chart">
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '40%'}}></div>
                    <span className="sppg-chart-label">Sen</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '75%'}}></div>
                    <span className="sppg-chart-label">Sel</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '30%'}}></div>
                    <span className="sppg-chart-label">Rab</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '90%'}}></div>
                    <span className="sppg-chart-label">Kam</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '55%'}}></div>
                    <span className="sppg-chart-label">Jum</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar" style={{height: '45%'}}></div>
                    <span className="sppg-chart-label">Sab</span>
                  </div>
                  <div className="sppg-chart-bar-wrapper">
                    <div className="sppg-chart-bar active" style={{height: '80%'}}></div>
                    <span className="sppg-chart-label">Min</span>
                  </div>
                </div>
              </div>

              {/* List Side */}
              <div className="sppg-fw-list-col">
                <h4>Input Terbaru</h4>
                <div className="sppg-fw-list">
                  <div className="sppg-fw-item">
                    <div className="sppg-fw-item-left">
                      <div className="sppg-fw-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </div>
                      <div className="sppg-fw-info">
                        <h5>SDN 01 Merdeka</h5>
                        <p>Nasi, Sayur Mayur • 2 Jam yang lalu</p>
                      </div>
                    </div>
                    <div className="sppg-fw-item-right">
                      <div className="sppg-fw-weight">2.4 <span>Kg</span></div>
                      <a href="#" className="sppg-fw-detail">DETAIL</a>
                    </div>
                  </div>

                  <div className="sppg-fw-item">
                    <div className="sppg-fw-item-left">
                      <div className="sppg-fw-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </div>
                      <div className="sppg-fw-info">
                        <h5>SMPN 04 Nusantara</h5>
                        <p>Sisa Lauk Pauk • 5 Jam yang lalu</p>
                      </div>
                    </div>
                    <div className="sppg-fw-item-right">
                      <div className="sppg-fw-weight">1.8 <span>Kg</span></div>
                      <a href="#" className="sppg-fw-detail">DETAIL</a>
                    </div>
                  </div>

                  <div className="sppg-fw-item">
                    <div className="sppg-fw-item-left">
                      <div className="sppg-fw-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </div>
                      <div className="sppg-fw-info">
                        <h5>SMKN 12 Bina Bangsa</h5>
                        <p>Nasi & Sisa Buah • Tadi Pagi</p>
                      </div>
                    </div>
                    <div className="sppg-fw-item-right">
                      <div className="sppg-fw-weight">3.1 <span>Kg</span></div>
                      <a href="#" className="sppg-fw-detail">DETAIL</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default DashboardSPPG;
