import React, { useState } from 'react';
import './TambahEntitasForm.css';

const TambahEntitasForm = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    nama: '',
    statusMBG: 'Sudah menerima MBG',
    alamat: '',
    catatan: '',
    lat: null,
    lng: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error(error);
          alert("Gagal mengambil lokasi. Mohon izinkan akses lokasi (Location Access) di browser Anda.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung fitur lokasi (Geolocation).");
    }
  };

  const handleSaveClick = () => {
    if(!formData.nama || !formData.alamat) {
        alert("Nama dan Alamat wajib diisi!");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="tef-wrapper">
      <div className="tef-header">
        <button className="tef-back-btn" onClick={onCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Tambah Entitas Baru
        </button>
      </div>
      
      <div className="tef-content">
        <div className="tef-form-card">
          <div className="tef-card-header">
            <h3>Detail Entitas Baru</h3>
            <p>Lengkapi data informasi untuk menambahkan entitas baru ke dalam sistem WebGIS.</p>
          </div>
          
          <form className="tef-form">
            <div className="tef-form-group">
              <label>Nama Entitas</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <input 
                  type="text" 
                  name="nama"
                  placeholder="Masukkan nama entitas (contoh: SDN Ketintang 1)" 
                  value={formData.nama}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Status Penerimaan MBG</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <select name="statusMBG" value={formData.statusMBG} onChange={handleChange}>
                  <option>Sudah menerima MBG</option>
                  <option>Belum menerima MBG</option>
                </select>
              </div>
            </div>

            <div className="tef-form-group">
              <label>Alamat Lengkap</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <input 
                  type="text" 
                  name="alamat"
                  placeholder="Masukkan alamat lengkap entitas..." 
                  value={formData.alamat}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Koordinat Titik Peta (Otomatis)</label>
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <button 
                  type="button" 
                  onClick={handleGetLocation} 
                  style={{padding: '10px 16px', backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  Gunakan Lokasi Saat Ini
                </button>
                <div style={{flex: 1, padding: '10px 16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.9rem', color: '#666'}}>
                  {formData.lat && formData.lng ? `Lat: ${formData.lat.toFixed(5)}, Lng: ${formData.lng.toFixed(5)}` : 'Titik koordinat belum diatur'}
                </div>
              </div>
            </div>

            <div className="tef-form-group">
              <label>Catatan Tambahan (Opsional)</label>
              <textarea 
                name="catatan"
                placeholder="Informasi tambahan mengenai entitas ini..."
                value={formData.catatan}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="tef-form-actions">
              <button type="button" className="tef-btn-cancel" onClick={onCancel}>Batalkan</button>
              <button type="button" className="tef-btn-save" onClick={handleSaveClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Simpan Entitas
              </button>
            </div>
          </form>
        </div>

        <div className="tef-tips-card">
          <div className="tef-tips-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5"/></svg>
            <h4>Tips Distribusi</h4>
          </div>
          <ul className="tef-tips-list">
            <li>Pastikan kotak makan tersegel rapat sebelum masuk ke kendaraan pendingin.</li>
            <li>Verifikasi jumlah porsi dengan pihak sekolah segera setelah tiba di lokasi.</li>
            <li>Dokumentasikan penyerahan dalam aplikasi untuk pelaporan real-time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TambahEntitasForm;
