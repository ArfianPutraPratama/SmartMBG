import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import SidebarMitra from '../components/SidebarMitra';
import './TambahLaporanMitra.css';

const EditLaporanMitra = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [status, setStatus] = useState('diproses');
  const [volumeInput, setVolumeInput] = useState('');
  const [hargaInput, setHargaInput] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [baseFilledTon, setBaseFilledTon] = useState(0);
  const [isEditingMax, setIsEditingMax] = useState(false);

  // Form State
  const [batchId, setBatchId] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [hasilOlahan, setHasilOlahan] = useState('');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    // Fetch Existing Report
    const fetchReport = async () => {
      try {
        const response = await axios.get(`https://violet-cups-wish.loca.lt/api/laporan-mitra/${id}`);
        const data = response.data;
        setBatchId(data.batch_id);
        setTanggal(data.tanggal_operasional);
        setHasilOlahan(data.hasil_olahan);
        setVolumeInput(data.volume);
        setHargaInput(data.harga);
        setCatatan(data.catatan || '');
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching report:', error);
        Swal.fire('Error', 'Data laporan tidak ditemukan.', 'error');
        navigate('/dashboard-mitra/laporan');
      }
    };
    if (id) fetchReport();

    // Fetch Gudang capacity
    const fetchGudang = async () => {
      try {
        const response = await axios.get('https://violet-cups-wish.loca.lt/api/gudang-mitra');
        setBaseFilledTon(parseFloat(response.data.terisi) || 0);
        setMaxCapacity(parseFloat(response.data.kapasitas_maksimal) || 10);
      } catch (error) {
        console.error('Error fetching gudang:', error);
      }
    };
    fetchGudang();
  }, [id, navigate]);

  // Calculate dynamic capacity
  const inputVolumeTon = parseFloat(volumeInput || 0) / 1000;
  const totalFilledTon = baseFilledTon + inputVolumeTon;
  const fillPercentage = Math.min(100, Math.max(0, (totalFilledTon / maxCapacity) * 100));
  const remainingTon = Math.max(0, maxCapacity - totalFilledTon);

  const handleSubmit = async () => {
    if (!hasilOlahan || !volumeInput || !hargaInput) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Mohon lengkapi semua field yang diperlukan (Hasil Olahan, Volume, Harga).',
        confirmButtonColor: '#1a5d2c'
      });
      return;
    }

    try {
      const payload = {
        batch_id: batchId,
        tanggal_operasional: tanggal,
        hasil_olahan: hasilOlahan,
        volume: parseFloat(volumeInput) || 0,
        harga: parseFloat(hargaInput) || 0,
        catatan: catatan,
        status: status
      };

      const response = await axios.put(`https://violet-cups-wish.loca.lt/api/laporan-mitra/${id}`, payload);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Laporan operasional berhasil diperbarui.',
          confirmButtonColor: '#1a5d2c'
        }).then(() => {
          navigate('/dashboard-mitra/laporan');
        });
      }
    } catch (error) {
      console.error('Error updating laporan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat memperbarui laporan. Pastikan data valid.',
        confirmButtonColor: '#1a5d2c'
      });
    }
  };

  const handleUpdateMaxCapacity = async (newMax) => {
    setMaxCapacity(newMax);
    setIsEditingMax(false);
    try {
      await axios.post('https://violet-cups-wish.loca.lt/api/gudang-mitra/capacity', {
        kapasitas_maksimal: newMax
      });
    } catch (error) {
      console.error('Error updating capacity:', error);
    }
  };

  const handleResetGudang = async () => {
    Swal.fire({
      title: 'Reset Gudang?',
      text: "Anda yakin ingin mengosongkan kapasitas gudang yang terisi? (Data laporan lama tidak akan terhapus)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#666',
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('https://violet-cups-wish.loca.lt/api/gudang-mitra/reset');
          setBaseFilledTon(0);
          Swal.fire({
            icon: 'success',
            title: 'Direset!',
            text: 'Kapasitas gudang berhasil dikosongkan.',
            confirmButtonColor: '#1a5d2c'
          });
        } catch (error) {
          console.error('Error resetting gudang:', error);
          Swal.fire('Error', 'Gagal mereset gudang.', 'error');
        }
      }
    });
  };

  return (
    <div className="dashboard-layout">
      <SidebarMitra />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">Edit Laporan</div>
          
          <div className="topbar-right">
            <div className="topbar-search">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search report ID..." />
            </div>
            <NotificationBell />
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#666" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="A" />
          </div>
        </header>

        <div className="dashboard-content tambah-laporan-container">
          
          <div className="tambah-laporan-left">
            <div className="form-card">
              <div className="form-card-header">
                <div className="form-card-title">
                  <h2>Data Operasional Harian</h2>
                  <p>Silakan perbarui formulir di bawah ini untuk mengedit aktivitas harian.</p>
                </div>
                <div className="draft-badge">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Draft Otomatis
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>ID Laporan / Batch ID</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={batchId} 
                    readOnly 
                    style={{backgroundColor: '#f5f5f5', color: '#666', cursor: 'not-allowed'}} 
                  />
                </div>
                
                <div className="form-group">
                  <label>Tanggal Operasional</label>
                  <div className="input-addon-group">
                    <div className="input-addon right" style={{background: '#fff'}}>
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Diolah Menjadi Apa</label>
                  <select className="form-control" value={hasilOlahan} onChange={(e) => setHasilOlahan(e.target.value)}>
                    <option value="">Pilih Hasil Olahan...</option>
                    <option value="Maggot Kering">Maggot Kering</option>
                    <option value="Pupuk Organik">Pupuk Organik</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Volume Input</label>
                  <div className="input-addon-group">
                    <input type="number" value={volumeInput} onChange={(e) => setVolumeInput(e.target.value)} placeholder="0" />
                    <div className="input-addon">Kg</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Harga</label>
                  <div className="input-addon-group">
                    <div className="input-addon">Rp</div>
                    <input 
                      type="text" 
                      value={hargaInput ? Number(hargaInput).toLocaleString('id-ID') : ''} 
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        setHargaInput(rawValue);
                      }} 
                      placeholder="0" 
                    />
                    <div className="input-addon">/ Kg</div>
                  </div>
                </div>

                <div className="form-group full-width" style={{marginTop: '12px'}}>
                  <label>Catatan / Keterangan Tambahan</label>
                  <textarea className="form-control" value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Contoh: Kondisi sisa makanan sedikit lembab, sudah dipilah dari plastik."></textarea>
                </div>

                <div className="form-group full-width" style={{marginTop: '12px'}}>
                  <label>Status Pengerjaan</label>
                  <div className="status-options">
                    
                    <label className={`status-option ${status === 'diproses' ? 'active' : ''}`}>
                      <input type="radio" name="status" checked={status === 'diproses'} onChange={() => setStatus('diproses')} />
                      <div className="status-text">
                        <span>Diproses</span>
                        <p>Sedang dalam tahap awal</p>
                      </div>
                    </label>

                    <label className={`status-option ${status === 'selesai' ? 'active' : ''}`}>
                      <input type="radio" name="status" checked={status === 'selesai'} onChange={() => setStatus('selesai')} />
                      <div className="status-text">
                        <span>Selesai</span>
                        <p>Data sudah final & diverifikasi</p>
                      </div>
                    </label>

                    <label className={`status-option ${status === 'dibatalkan' ? 'active' : ''}`}>
                      <input type="radio" name="status" checked={status === 'dibatalkan'} onChange={() => setStatus('dibatalkan')} />
                      <div className="status-text">
                        <span>Dibatalkan</span>
                        <p>Laporan ini tidak dilanjutkan</p>
                      </div>
                    </label>

                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-save" onClick={handleSubmit}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Update Laporan
                </button>
                <button className="btn-cancel" onClick={() => navigate('/dashboard-mitra/laporan')}>Batal</button>
              </div>

            </div>
          </div>

          <div className="tambah-laporan-right">
            
            <div className="side-card">
              <h3>Ringkasan Input</h3>
              
              <div className="summary-row">
                <span className="label">ID Laporan</span>
                <span className="value">{batchId || 'Memuat...'}</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Volume Input</span>
                <span className="value">{volumeInput || 0} Kg</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Harga</span>
                <span className="value">Rp {hargaInput ? Number(hargaInput).toLocaleString('id-ID') : 0} / Kg</span>
              </div>

              <div className="tips-box">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 0-5 5c0 2 1.5 3 2 5h6c.5-2 2-3 2-5a5 5 0 0 0-5-5z"/></svg>
                <div className="tips-content">
                  <h4>Tips Pengisian</h4>
                  <p>Pastikan volume ditimbang dalam keadaan kering untuk akurasi data pengolahan maggot. Gunakan timbangan digital terkalibrasi.</p>
                </div>
              </div>
            </div>

            <div className="capacity-card">
              <div className="capacity-image">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>Kapasitas Gudang</h3>
                  <button 
                    onClick={handleResetGudang}
                    style={{
                      background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white',
                      padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                    Reset
                  </button>
                </div>
                <p>Penyimpanan Batch B-01</p>
              </div>
              <div className="capacity-content">
                <div className="capacity-progress-header">
                  <span className="percent" style={{ color: fillPercentage > 90 ? '#e53e3e' : '#333' }}>
                    {fillPercentage.toFixed(1)}% Terisi
                  </span>
                  <span className="amount" style={{display: 'flex', alignItems: 'center'}}>
                    {totalFilledTon.toFixed(2)} / 
                    {isEditingMax ? (
                      <input 
                        type="number" 
                        defaultValue={maxCapacity}
                        onBlur={(e) => handleUpdateMaxCapacity(parseFloat(e.target.value) || 10)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateMaxCapacity(parseFloat(e.target.value) || 10)}
                        autoFocus
                        style={{
                          width: '40px', margin: '0 6px', border: '1px solid #1a5d2c', 
                          borderRadius: '4px', padding: '2px 4px', fontSize: '13px', textAlign: 'center'
                        }}
                      />
                    ) : (
                      <span 
                        onClick={() => setIsEditingMax(true)} 
                        title="Klik untuk mengubah kapasitas maksimal"
                        style={{
                          cursor: 'pointer', borderBottom: '1px dashed #888', 
                          margin: '0 6px', paddingBottom: '1px', color: '#1a5d2c', fontWeight: '600'
                        }}
                      >
                        {maxCapacity}
                      </span>
                    )}
                    Ton
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${fillPercentage}%`, 
                      backgroundColor: fillPercentage > 90 ? '#e53e3e' : '#388e3c',
                      transition: 'width 0.3s ease, background-color 0.3s ease'
                    }}
                  ></div>
                </div>
                <div className="capacity-info" style={{ color: remainingTon < 1 ? '#e53e3e' : '#666' }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Tersisa {remainingTon.toFixed(2)} Ton untuk batch hari ini.
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default EditLaporanMitra;
