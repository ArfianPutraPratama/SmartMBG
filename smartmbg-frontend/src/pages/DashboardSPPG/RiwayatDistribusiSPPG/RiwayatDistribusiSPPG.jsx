import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarSPPG from '../components/SidebarSPPG';
import axios from '../../../api/axios';
import './RiwayatDistribusiSPPG.css';

const RiwayatDistribusiSPPG = () => {
  const navigate = useNavigate();
  const [distribusiList, setDistribusiList] = useState([]);
  const [schools, setSchools] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch Schools
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Failed to fetch schools:', error);
      }
    };
    fetchSchools();

    const saved = localStorage.getItem('sppg_distribusi_data');
    if (saved) {
      setDistribusiList(JSON.parse(saved));
    } else {
      // Default hardcoded data to initialize
      const defaultData = [
        { id: 1, tanggal: '23 Mei 2025', namaSekolah: 'SDN Ketintang 1 Surabaya', totalPorsi: '450 Box', status: 'Delivered', waktu: '09:15 WIB', wilayah: 'Ketintang', kurir: 'Budi Santoso' },
        { id: 2, tanggal: '23 Mei 2025', namaSekolah: 'SMPN 12 Surabaya', totalPorsi: '820 Box', status: 'In Progress', waktu: 'Estimasi 11:00', wilayah: 'Ngagel', kurir: 'Siti Aminah' },
        { id: 3, tanggal: '22 Mei 2025', namaSekolah: 'SDK Petra 1', totalPorsi: '320 Box', status: 'Delivered', waktu: '08:45 WIB', wilayah: 'Manyar', kurir: 'Andi Wijaya' },
        { id: 4, tanggal: '22 Mei 2025', namaSekolah: 'SMKN 1 Surabaya', totalPorsi: '1,200 Box', status: 'Delayed', waktu: '09:55 WIB (+25m)', wilayah: 'Wonokromo', kurir: 'Hendra Saputra' },
        { id: 5, tanggal: '21 Mei 2025', namaSekolah: 'TK Pembina Nasional', totalPorsi: '150 Box', status: 'Delivered', waktu: '08:10 WIB', wilayah: 'Gubeng', kurir: 'Joko Widodo' }
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

  const handleView = (id) => {
    navigate(`/dashboard-sppg/distribusi/detail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dashboard-sppg/edit-distribusi/${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Data?',
      text: "Data distribusi ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#999',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = distribusiList.filter(item => item.id !== id);
        setDistribusiList(updated);
        localStorage.setItem('sppg_distribusi_data', JSON.stringify(updated));
        
        // Handle if current page becomes empty
        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }

        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  // Hitung data untuk pagination
  const totalPages = Math.ceil(distribusiList.length / itemsPerPage);
  const currentData = distribusiList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate(-1)} title="Kembali">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Riwayat Distribusi
          </div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="sppg-rd-container">
          

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
                    <th>WILAYAH</th>
                    <th>TOTAL PORSI</th>
                    <th>STATUS</th>
                    <th>KURIR</th>
                    <th>WAKTU TERIMA</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item) => {
                      const schoolData = schools.find(s => s.name === item.namaSekolah);
                      const wilayahDisplay = schoolData && schoolData.address ? schoolData.address : (item.wilayah || '-');

                      return (
                        <tr key={item.id}>
                          <td>{item.tanggal}</td>
                          <td className="sppg-rd-school-name">{item.namaSekolah}</td>
                          <td>{wilayahDisplay}</td>
                          <td>{item.totalPorsi}</td>
                          <td><span className={`sppg-rd-badge ${getStatusClass(item.status)}`}>{item.status}</span></td>
                          <td>{item.kurir || '-'}</td>
                          <td>{item.waktu}</td>
                          <td style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleView(item.id)} style={{ background: '#eaf3ed', color: '#1a5d2c', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button onClick={() => handleEdit(item.id)} style={{ background: '#e1effe', color: '#1e429f', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Edit">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={{ background: '#fde8e8', color: '#e53e3e', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }} title="Delete">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Belum ada data distribusi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="sppg-rd-pagination">
              <div className="sppg-rd-page-info">
                Halaman {currentPage} dari {totalPages || 1}
              </div>
              <div className="sppg-rd-page-controls">
                <button 
                  className="sppg-rd-page-btn prev" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  &lsaquo;
                </button>
                
                {Array.from({ length: totalPages || 1 }, (_, i) => (
                  <button 
                    key={i + 1} 
                    className={`sppg-rd-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  className="sppg-rd-page-btn next" 
                  disabled={currentPage === (totalPages || 1)} 
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  &rsaquo;
                </button>
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
