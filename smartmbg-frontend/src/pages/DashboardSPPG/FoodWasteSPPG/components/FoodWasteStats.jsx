import React from 'react';

const FoodWasteStats = ({ totalPorsi = 0, sekolahAktif = 0, limbahMakanan = 0, ratingMBG = 0, totalUlasan = 0 }) => {
  return (
    <div className="fw-stats-grid">
      <div className="fw-stat-card">
        <div className="fw-stat-title">Total Porsi</div>
        <div className="fw-stat-value green">{totalPorsi.toLocaleString('id-ID')}</div>
        <div className="fw-stat-footer positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          Berdasarkan Riwayat Distribusi
        </div>
      </div>
      
      <div className="fw-stat-card">
        <div className="fw-stat-title">Sekolah Aktif</div>
        <div className="fw-stat-value green">{sekolahAktif}</div>
        <div className="fw-stat-footer positive">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Total Entitas Terdaftar
        </div>
      </div>

      <div className="fw-stat-card">
        <div className="fw-stat-title">Limbah Makanan</div>
        <div className="fw-stat-value red">{limbahMakanan} Kg</div>
        <div className="fw-stat-footer warning">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Total Sisa Makanan
        </div>
      </div>

      <div className="fw-stat-card">
        <div className="fw-stat-title">Peringkat MBG</div>
        <div className="fw-stat-value">{ratingMBG.toFixed(1).replace('.', ',')} <span className="star-icon">★</span></div>
        <div className="fw-stat-footer neutral">
          Berdasarkan {totalUlasan} Ulasan
        </div>
      </div>
    </div>
  );
};

export default FoodWasteStats;
