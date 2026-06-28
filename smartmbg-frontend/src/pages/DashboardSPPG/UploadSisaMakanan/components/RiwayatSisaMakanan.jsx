import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RiwayatSisaMakanan = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('https://a5a1-182-8-68-206.ngrok-free.app/api/sppg/food-wastes');
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-box" style={{marginBottom: '20px', minHeight: '150px', display: 'flex', flexDirection: 'column'}}>
      <div className="history-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <h3 style={{margin:0, fontSize:'1.1rem', color:'#111'}}>Riwayat Sisa Makanan</h3>
        </div>
        <Link to="/dashboard-sppg/riwayat-sisa-makanan" style={{color:'#2e7d32', fontSize:'0.85rem', fontWeight:'600', textDecoration:'none'}}>Lihat Semua</Link>
      </div>

      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        {isLoading ? (
          <div style={{margin:'auto', color:'#888', fontSize:'0.9rem'}}>Memuat data...</div>
        ) : historyData.length === 0 ? (
          <div style={{margin:'auto', color:'#888', fontSize:'0.9rem'}}>Belum ada data sisa makanan.</div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'12px', maxHeight:'300px', overflowY:'auto', paddingRight:'5px'}}>
            {historyData.slice(0, 5).map((item) => (
              <div key={item.id} style={{display:'flex', gap:'12px', padding:'12px', border:'1px solid #eee', borderRadius:'8px', backgroundColor:'#fff'}}>
                <div style={{width:'60px', height:'60px', borderRadius:'6px', overflow:'hidden', backgroundColor:'#f5f5f5', flexShrink:0}}>
                  {item.image_path ? (
                    <img src={`https://a5a1-182-8-68-206.ngrok-free.app/${item.image_path}`} alt="Food Waste" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc'}}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  )}
                </div>
                <div style={{flexGrow:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                    <span style={{fontWeight:'600', color:'#222', fontSize:'0.95rem'}}>{item.jenis_makanan}</span>
                    <span style={{color:'#666', fontSize:'0.8rem'}}>{item.waktu_input || '-'}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
                    <div style={{color:'#555', fontSize:'0.85rem'}}>Berat: {item.berat} KG</div>
                    <span style={{
                      fontSize:'0.7rem', fontWeight:'600', padding:'2px 8px', borderRadius:'4px',
                      backgroundColor: item.status === 'Belum Diambil' ? '#fff3e0' : (item.status === 'Diambil' ? '#e3f2fd' : '#e8f5e9'),
                      color: item.status === 'Belum Diambil' ? '#e65100' : (item.status === 'Diambil' ? '#1976d2' : '#2e7d32')
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'4px', color:'#888', fontSize:'0.8rem'}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {item.sppg_username ? `${item.sppg_username}, ` : ''}{item.lokasi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatSisaMakanan;
