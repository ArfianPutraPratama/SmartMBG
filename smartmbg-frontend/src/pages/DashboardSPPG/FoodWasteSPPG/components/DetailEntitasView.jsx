import React from 'react';
import './TambahEntitasForm.css'; // Reusing the same CSS for identical layout

const DetailEntitasView = ({ entity, onBack }) => {
  if (!entity) return null;

  return (
    <div className="tef-wrapper">
      <div className="tef-header">
        <button className="tef-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Kembali ke Daftar
        </button>
      </div>
      
      <div className="tef-content">
        <div className="tef-form-card">
          <div className="tef-card-header">
            <h3>Informasi Lengkap Entitas</h3>
            <p>Detail profil sekolah, SPPG, atau mitra dalam jaringan Anda.</p>
          </div>
          
          <div className="tef-form">
            <div className="tef-form-group">
              <label>Nama Entitas</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <input type="text" readOnly value={entity.nama} style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Tipe Entitas</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <input type="text" readOnly value={entity.tipe} style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Status Penerimaan MBG</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <input type="text" readOnly value={entity.statusMBG} style={{ backgroundColor: '#f5f5f5', color: entity.statusMBG === 'Belum menerima MBG' ? '#f57c00' : '#2e7d32', fontWeight: '500' }} />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Alamat Lengkap</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <input type="text" readOnly value={entity.alamat} style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Tanggal Terdaftar</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <input type="text" readOnly value={entity.tanggal} style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>

            <div className="tef-form-group">
              <label>Koordinat Titik Peta</label>
              <div className="tef-input-wrapper">
                <svg className="tef-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                <input type="text" readOnly value={`Lat: ${entity.lat}, Lng: ${entity.lng}`} style={{ backgroundColor: '#f5f5f5', color: '#333' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="tef-tips-card">
          <div className="tef-tips-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h4>Profil Entitas</h4>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#2e7d32', lineHeight: '1.5', marginTop: '8px' }}>
            Ini adalah tampilan detail untuk entitas terpilih. Pastikan setiap informasi seperti alamat dan koordinat sudah sesuai. Anda bisa mengubah atau menghapus data ini pada menu aksi di tabel sebelumnya.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailEntitasView;
