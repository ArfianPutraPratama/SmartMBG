import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MitraStats = () => {
  const [stats, setStats] = useState({
    permintaanBaru: 0,
    sisaMakanan: 0,
    pickupSelesai: 0,
    maggotDihasilkan: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const foodWastesRes = await axios.get('https://9c6d-182-8-68-206.ngrok-free.app/api/sppg/food-wastes');
        const dataFW = foodWastesRes.data;
        
        let permintaanBaru = 0;
        let sisaMakanan = 0;
        let pickupSelesai = 0;

        dataFW.forEach(item => {
          if (item.status === 'Belum Diambil') {
            permintaanBaru++;
            sisaMakanan += parseFloat(item.berat) || 0;
          } else if (item.status === 'Selesai') {
            pickupSelesai++;
          }
        });

        let maggotDihasilkan = 0;
        try {
          const laporanRes = await axios.get('https://9c6d-182-8-68-206.ngrok-free.app/api/laporan-mitra');
          const dataLaporan = laporanRes.data;
          dataLaporan.forEach(laporan => {
            maggotDihasilkan += parseFloat(laporan.volume) || 0;
          });
        } catch (err) {
          console.error("Error fetching laporan:", err);
        }

        setStats({
          permintaanBaru,
          sisaMakanan: sisaMakanan.toFixed(1),
          pickupSelesai,
          maggotDihasilkan: maggotDihasilkan.toFixed(1)
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mitra-stats-row">
      <div className="mitra-stat-card">
        <div className="mitra-stat-icon-wrapper">
          <div className="mitra-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div className="mitra-stat-badge">Real-time</div>
        </div>
        <div className="mitra-stat-label">Permintaan Baru</div>
        <div className="mitra-stat-val">{stats.permintaanBaru} <span className="mitra-stat-unit">Lokasi</span></div>
      </div>
      
      <div className="mitra-stat-card">
        <div className="mitra-stat-icon-wrapper">
          <div className="mitra-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </div>
        </div>
        <div className="mitra-stat-label">Sisa Pangan Tersedia</div>
        <div className="mitra-stat-val">{stats.sisaMakanan} <span className="mitra-stat-unit">Kg</span></div>
      </div>

      <div className="mitra-stat-card">
        <div className="mitra-stat-icon-wrapper">
          <div className="mitra-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="mitra-stat-badge" style={{color:'#666'}}>Bulan ini</div>
        </div>
        <div className="mitra-stat-label">Pickup Selesai</div>
        <div className="mitra-stat-val">{stats.pickupSelesai} <span className="mitra-stat-unit">Lokasi</span></div>
      </div>

      <div className="mitra-stat-card">
        <div className="mitra-stat-icon-wrapper">
          <div className="mitra-stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div className="mitra-stat-label">Maggot Dihasilkan</div>
        <div className="mitra-stat-val">{stats.maggotDihasilkan} <span className="mitra-stat-unit">Kg</span></div>
      </div>
    </div>
  );
};

export default MitraStats;
