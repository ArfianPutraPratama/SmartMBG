import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosInstance from '../../../api/axios';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import SidebarSPPG from '../components/SidebarSPPG';
import './TambahDistribusiSPPG.css';

const TambahDistribusiSPPG = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    namaSekolah: '',
    status: 'inprogress', // default to inprogress
    tanggal: '',
    waktu: '',
    totalPorsi: '',
    namaKurir: '',
    catatan: ''
  });

  const [sekolahList, setSekolahList] = useState([]);

  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        const response = await axiosInstance.get('/schools');
        setSekolahList(response.data);
      } catch (error) {
        console.error("Gagal mengambil data sekolah", error);
      }
    };
    fetchSekolah();

    if (isEditMode) {
      const existingData = JSON.parse(localStorage.getItem('sppg_distribusi_data') || '[]');
      const itemToEdit = existingData.find(item => item.id.toString() === id);
      if (itemToEdit) {
        // Reverse map status display to option value
        let statusValue = 'inprogress';
        if (itemToEdit.status === 'Delivered') statusValue = 'delivered';
        if (itemToEdit.status === 'Delayed') statusValue = 'delayed';
        
        setFormData({
          namaSekolah: itemToEdit.namaSekolah,
          status: statusValue,
          tanggal: itemToEdit.tanggal.includes('-') ? itemToEdit.tanggal : new Date().toISOString().split('T')[0], // Approximation
          waktu: itemToEdit.waktu.replace(' WIB', '').replace('Estimasi ', ''),
          totalPorsi: itemToEdit.totalPorsi.replace(' Box', ''),
          namaKurir: itemToEdit.kurir || '',
          catatan: itemToEdit.catatan || ''
        });
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaSekolah || !formData.totalPorsi) {
      Swal.fire('Error', 'Nama Sekolah dan Total Porsi wajib diisi!', 'error');
      return;
    }

    // Convert status to display text
    let statusDisplay = 'In Progress';
    if (formData.status === 'delivered') statusDisplay = 'Delivered';
    if (formData.status === 'delayed') statusDisplay = 'Delayed';

    const existingData = JSON.parse(localStorage.getItem('sppg_distribusi_data') || '[]');

    if (isEditMode) {
      const updatedData = existingData.map(item => {
        if (item.id.toString() === id) {
          return {
            ...item,
            tanggal: formData.tanggal,
            namaSekolah: formData.namaSekolah,
            totalPorsi: `${formData.totalPorsi} Box`,
            status: statusDisplay,
            waktu: formData.waktu,
            kurir: formData.namaKurir,
            catatan: formData.catatan
          };
        }
        return item;
      });
      localStorage.setItem('sppg_distribusi_data', JSON.stringify(updatedData));
      Swal.fire('Berhasil!', 'Laporan distribusi berhasil diubah.', 'success').then(() => {
        navigate('/dashboard-sppg/riwayat-distribusi');
      });
    } else {
      const newEntry = {
        id: Date.now(),
        tanggal: formData.tanggal,
        namaSekolah: formData.namaSekolah,
        totalPorsi: `${formData.totalPorsi} Box`,
        status: statusDisplay,
        waktu: formData.waktu,
        kurir: formData.namaKurir,
        catatan: formData.catatan
      };
      
      const updatedData = [newEntry, ...existingData];
      localStorage.setItem('sppg_distribusi_data', JSON.stringify(updatedData));
      Swal.fire('Berhasil!', 'Laporan distribusi berhasil ditambahkan.', 'success').then(() => {
        navigate('/dashboard-sppg/riwayat-distribusi');
      });
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Special Header for this page */}
        <header className="dashboard-topbar sppg-td-topbar">
          <div className="sppg-td-topbar-left" onClick={() => navigate(-1)} style={{cursor: 'pointer'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <h2>{isEditMode ? 'Edit Laporan Distribusi' : 'Tambah Laporan Distribusi'}</h2>
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
          

          <div className="sppg-td-card">
            <div className="sppg-td-card-header">
              <h3>Informasi Pengiriman</h3>
              <p>{isEditMode ? 'Silakan ubah formulir di bawah ini untuk memperbarui catatan distribusi harian.' : 'Silakan lengkapi formulir di bawah ini untuk mencatat distribusi makanan harian.'}</p>
            </div>

            <form className="sppg-td-form" onSubmit={handleSubmit}>
              
              <div className="sppg-td-grid">
                {/* Nama Sekolah */}
                <div className="sppg-td-form-group">
                  <label>Nama Sekolah</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    <select name="namaSekolah" value={formData.namaSekolah} onChange={handleChange} required>
                      <option value="" disabled>Pilih sekolah...</option>
                      {sekolahList.map((sekolah) => (
                        <option key={sekolah.id} value={sekolah.name}>{sekolah.name}</option>
                      ))}
                    </select>
                    <svg className="sppg-td-select-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                {/* Status Pengiriman */}
                <div className="sppg-td-form-group">
                  <label>Status Pengiriman</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <select name="status" value={formData.status} onChange={handleChange}>
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
                    <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} style={{ paddingLeft: '1rem' }} />
                  </div>
                </div>

                {/* Waktu Pengiriman */}
                <div className="sppg-td-form-group">
                  <label>Waktu Pengiriman</label>
                  <div className="sppg-td-input-wrapper">
                    <input type="time" name="waktu" value={formData.waktu} onChange={handleChange} style={{ paddingLeft: '1rem' }} />
                  </div>
                </div>

                {/* Total Porsi */}
                <div className="sppg-td-form-group">
                  <label>Total Porsi</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
                    <input type="number" name="totalPorsi" value={formData.totalPorsi} onChange={handleChange} placeholder="Contoh: 150" required />
                    <span className="sppg-td-suffix">KOTAK</span>
                  </div>
                </div>

                {/* Nama Kurir / Driver */}
                <div className="sppg-td-form-group">
                  <label>Nama Kurir / Driver</label>
                  <div className="sppg-td-input-wrapper">
                    <svg className="sppg-td-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" name="namaKurir" value={formData.namaKurir} onChange={handleChange} placeholder="Masukkan nama pengemudi..." />
                  </div>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="sppg-td-form-group sppg-td-full-width">
                <label>Catatan Tambahan</label>
                <div className="sppg-td-input-wrapper textarea-wrapper">
                  <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Informasi tambahan mengenai rute, kendala, atau instruksi khusus..."></textarea>
                </div>
              </div>

              {/* Actions */}
              <div className="sppg-td-actions">
                <button type="button" className="sppg-td-btn-cancel" onClick={() => navigate(-1)}>Batal</button>
                <button type="submit" className="sppg-td-btn-save">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  {isEditMode ? 'Perbarui Data' : 'Simpan Data'}
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
