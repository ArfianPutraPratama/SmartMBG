import React from 'react';

const requests = [
  {
    id: 1,
    school: 'SDN Ketintang 1',
    distance: '1.2 km',
    qty: 20,
    status: 'TERSEDIA'
  },
  {
    id: 2,
    school: 'SDN Wonokromo 2',
    distance: '2.1 km',
    qty: 15,
    status: 'TERSEDIA'
  },
  {
    id: 3,
    school: 'SDN Jemur Wonosari 1',
    distance: '3.4 km',
    qty: 25,
    status: 'TERSEDIA'
  }
];

const PermintaanTerdekat = () => {
  return (
    <div className="mitra-section-card">
      <div className="mitra-section-header">
        <div>
          <h3 className="mitra-section-title">Permintaan Terdekat</h3>
          <p className="mitra-section-subtitle">Prioritas berdasarkan jarak & kuantitas</p>
        </div>
        <a href="#" className="mitra-link">Lihat Semua</a>
      </div>

      <div className="mitra-req-list">
        {requests.map((req) => (
          <div className="mitra-req-item" key={req.id}>
            <div className="mitra-req-left">
              <div className="mitra-req-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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
              <div className="mitra-req-badge">{req.status}</div>
              <button className="mitra-btn-ambil">Ambil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermintaanTerdekat;
