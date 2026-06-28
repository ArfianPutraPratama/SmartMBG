import React, { useState, useEffect } from 'react';

const FWMitraStats = () => {
  const [stats, setStats] = useState({
    permintaanBaru: 0,
    sisaPanganBerat: 0,
    sisaPanganLokasi: 0,
    pickupSelesai: 0,
    maggotDihasilkan: 0
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://violet-cups-wish.loca.lt/api/sppg/food-wastes');
      if (response.ok) {
        const data = await response.json();
        
        // Permintaan Baru = jumlah data yang statusnya 'Belum Diambil'
        const availableItems = data.filter(item => item.status === 'Belum Diambil');
        const permintaanBaru = availableItems.length;

        // Sisa Pangan Tersedia (Berat & Lokasi Unik)
        let totalBeratAvailable = 0;
        const uniqueLocations = new Set();
        availableItems.forEach(item => {
          totalBeratAvailable += parseFloat(item.berat) || 0;
          if (item.lokasi) uniqueLocations.add(item.lokasi);
        });

        // Pickup Selesai (hari ini atau total sementara)
        const completedItems = data.filter(item => item.status === 'Selesai');
        const pickupSelesai = completedItems.length;

        // Maggot Dihasilkan = Asumsi 1 Kg sisa pangan -> 0.3 Kg maggot
        let totalBeratCompleted = 0;
        completedItems.forEach(item => {
          totalBeratCompleted += parseFloat(item.berat) || 0;
        });
        const maggotDihasilkan = (totalBeratCompleted * 0.3).toFixed(1);

        setStats({
          permintaanBaru,
          sisaPanganBerat: totalBeratAvailable.toFixed(1),
          sisaPanganLokasi: uniqueLocations.size,
          pickupSelesai,
          maggotDihasilkan
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="fw-mitra-stats-row">
      <div className="fw-mitra-stat-card">
        <div className="fw-mitra-stat-top">
          <div className="fw-mitra-icon-box green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div className="fw-mitra-stat-badge positive">Real-time</div>
        </div>
        <div className="fw-mitra-stat-val">{stats.permintaanBaru}</div>
        <div className="fw-mitra-stat-label">Permintaan Baru</div>
      </div>
      
      <div className="fw-mitra-stat-card">
        <div className="fw-mitra-stat-top">
          <div className="fw-mitra-icon-box blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          </div>
        </div>
        <div className="fw-mitra-stat-val">{stats.sisaPanganBerat} <span className="unit">Kg</span></div>
        <div className="fw-mitra-stat-label">Sisa Pangan Tersedia</div>
        <div className="fw-mitra-stat-sub">di {stats.sisaPanganLokasi} lokasi berbeda</div>
      </div>

      <div className="fw-mitra-stat-card">
        <div className="fw-mitra-stat-top">
          <div className="fw-mitra-icon-box orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div className="fw-mitra-stat-val">{stats.pickupSelesai}</div>
        <div className="fw-mitra-stat-label">Pickup Selesai</div>
        <div className="fw-mitra-stat-sub">total riwayat penjemputan</div>
      </div>

      <div className="fw-mitra-stat-card">
        <div className="fw-mitra-stat-top">
          <div className="fw-mitra-icon-box purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div className="fw-mitra-stat-val">{stats.maggotDihasilkan} <span className="unit">Kg</span></div>
        <div className="fw-mitra-stat-label">Estimasi Maggot</div>
        <div className="fw-mitra-stat-sub">berdasarkan pickup selesai</div>
      </div>
    </div>
  );
};

export default FWMitraStats;
