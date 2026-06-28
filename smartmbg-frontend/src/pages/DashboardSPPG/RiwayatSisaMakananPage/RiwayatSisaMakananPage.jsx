import React, { useState, useEffect } from 'react';
import NgrokImage from '../../../components/NgrokImage/NgrokImage';
import { Link } from 'react-router-dom';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarSPPG from '../components/SidebarSPPG';

const RiwayatSisaMakananPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('https://8fb6-182-8-68-206.ngrok-free.app/api/sppg/food-wastes');
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
    <div className="dashboard-layout">
      <SidebarSPPG />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">Seluruh Riwayat Sisa Makanan</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="dashboard-content">
          <div style={{marginBottom:'20px'}}>
            <Link to="/dashboard-sppg/upload-sisa-makanan" style={{display:'inline-flex', alignItems:'center', gap:'8px', textDecoration:'none', color:'#555', fontWeight:'600'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Kembali
            </Link>
          </div>

          <div className="card-box" style={{minHeight:'400px'}}>
            <h2 style={{marginTop:0, marginBottom:'20px', color:'#111', fontSize:'1.2rem', display:'flex', alignItems:'center', gap:'8px'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Semua Riwayat Sisa Makanan
            </h2>

            {isLoading ? (
              <div style={{color:'#888', padding:'20px', textAlign:'center'}}>Memuat data riwayat...</div>
            ) : historyData.length === 0 ? (
              <div style={{color:'#888', padding:'20px', textAlign:'center'}}>Belum ada data sisa makanan yang tercatat.</div>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px'}}>
                {historyData.map((item) => (
                  <div key={item.id} style={{display:'flex', gap:'12px', padding:'16px', border:'1px solid #eee', borderRadius:'12px', backgroundColor:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.02)'}}>
                    <div style={{width:'80px', height:'80px', borderRadius:'8px', overflow:'hidden', backgroundColor:'#f5f5f5', flexShrink:0}}>
                      {item.image_path ? (
                      <NgrokImage src={`https://8fb6-182-8-68-206.ngrok-free.app/api/file/${item.image_path?.replace('storage/', '')}`} alt="Food Waste" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                      ) : (
                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc'}}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}
                    </div>
                    <div style={{flexGrow:1}}>
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                        <span style={{fontWeight:'700', color:'#111', fontSize:'1rem'}}>{item.jenis_makanan}</span>
                      </div>
                      <div style={{color:'#2e7d32', fontWeight:'600', fontSize:'0.9rem', marginBottom:'8px'}}>{item.berat} KG</div>
                      <div style={{display:'flex', alignItems:'flex-start', gap:'6px', color:'#666', fontSize:'0.85rem', marginBottom:'4px'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginTop:'2px', flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span style={{lineHeight:'1.3'}}>{item.lokasi}</span>
                      </div>
                      <div style={{display:'flex', alignItems:'center', gap:'6px', color:'#888', fontSize:'0.8rem'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Waktu Input: {item.waktu_input || '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RiwayatSisaMakananPage;
