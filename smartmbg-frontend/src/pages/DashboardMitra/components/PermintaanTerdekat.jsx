import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Link } from 'react-router-dom';

const PermintaanTerdekat = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Koordinat default Mitra (SPPG Ketintang)
    const mitraLat = -7.3115;
    const mitraLng = 112.7275;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat2 || !lon2) return (Math.random() * 5 + 1).toFixed(1); // fallback
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      return d.toFixed(1);
    };

    axios.get('/sppg/food-wastes')
      .then(response => {
        const mappedData = response.data.map(item => ({
          id: item.id,
          school: item.lokasi,
          distance: calculateDistance(mitraLat, mitraLng, item.lat, item.lng) + ' km',
          qty: item.berat,
          status: item.status.toUpperCase(),
          image: item.image_path ? `https://8fb6-182-8-68-206.ngrok-free.app/${item.image_path}` : null
        }));
        
        // Sort by shortest distance
        mappedData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
        setRequests(mappedData.slice(0, 5)); // Show top 5 nearest
      })
      .catch(error => {
        console.error("Error fetching food waste requests:", error);
      });
  }, []);

  return (
    <div className="mitra-section-card">
      <div className="mitra-section-header">
        <div>
          <h3 className="mitra-section-title">Permintaan Terdekat</h3>
          <p className="mitra-section-subtitle">Daftar sisa pangan yang tersedia</p>
        </div>
        <Link to="/dashboard-mitra/food-waste" className="mitra-link">Lihat Semua</Link>
      </div>

      <div className="mitra-req-list">
        {requests.map((req) => (
          <div className="mitra-req-item" key={req.id}>
            <div className="mitra-req-left">
              <div className="mitra-req-icon" style={{ padding: 0, overflow: 'hidden', backgroundColor: 'transparent' }}>
                {req.image ? (
                  <img src={req.image} alt={req.school} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#e8f5e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                )}
              </div>
              <div className="mitra-req-info">
                <h4>{req.school}</h4>
                <div className="mitra-req-distance">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  {req.distance}
                </div>
              </div>
            </div>

            <div className="mitra-req-center">
              <div className="mitra-req-qty-label">TOTAL SISA</div>
              <div className="mitra-req-qty-val">{req.qty} <span style={{fontSize:'0.8rem', color:'#666'}}>Kg</span></div>
            </div>

            <div className="mitra-req-right">
              <div className="mitra-req-badge" style={{ backgroundColor: req.status === 'SELESAI' ? '#e8f5e9' : req.status === 'DIAMBIL' ? '#e3f2fd' : '#fff3e0', color: req.status === 'SELESAI' ? '#2e7d32' : req.status === 'DIAMBIL' ? '#1565c0' : '#ed6c02', border: req.status === 'SELESAI' ? '1px solid #c8e6c9' : req.status === 'DIAMBIL' ? '1px solid #bbdefb' : '1px solid #ffe0b2' }}>{req.status}</div>
              {req.status === 'BELUM DIAMBIL' && <button className="mitra-btn-ambil">Ambil</button>}
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Tidak ada permintaan saat ini.</div>
        )}
      </div>
    </div>
  );
};

export default PermintaanTerdekat;
