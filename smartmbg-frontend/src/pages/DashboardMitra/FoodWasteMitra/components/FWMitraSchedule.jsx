import React, { useState, useEffect } from 'react';

const FWMitraSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedule = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://a5a1-182-8-68-206.ngrok-free.app/api/sppg/food-wastes?status=Diambil');
      if (response.ok) {
        const data = await response.json();
        // Limit to 5 items for schedule display, maybe order is already desc
        setScheduleData(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-box" style={{height: '100%'}}>
      <div className="fw-mitra-section-header" style={{marginBottom: '20px'}}>
        <h3 className="section-title">Jadwal Pengambilan Hari Ini</h3>
        <a href="#" className="btn-text-green" style={{fontSize:'0.85rem'}}>Lihat Semua</a>
      </div>

      <div className="fw-mitra-schedule-container" style={{display:'flex', alignItems:'center', gap:'16px', overflowX:'auto', paddingBottom:'8px'}}>
        {isLoading && scheduleData.length === 0 ? (
          <div style={{color:'#888', fontSize:'0.9rem'}}>Memuat jadwal...</div>
        ) : scheduleData.length === 0 ? (
          <div style={{color:'#888', fontSize:'0.9rem'}}>Belum ada jadwal pengambilan hari ini. Silakan "Ambil" sisa makanan yang tersedia.</div>
        ) : (
          scheduleData.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="schedule-card" style={{border:'1px solid #eee', borderRadius:'8px', padding:'16px', minWidth:'220px', backgroundColor:'#fafafa'}}>
                <div style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                  <div style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor: '#e8f5e9', color: '#2e7d32', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:'0.75rem', color:'#666', fontWeight:'600'}}>{item.waktu_input || '-'}</div>
                    <div style={{fontSize:'0.9rem', color:'#111', fontWeight:'600', textTransform:'capitalize'}}>{item.lokasi.split(',')[0]}</div>
                  </div>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontSize:'0.85rem', color:'#2e7d32', fontWeight:'700'}}>{item.berat} Kg</div>
                  <div style={{fontSize:'0.7rem', fontWeight:'700', color: '#1976d2', letterSpacing:'0.5px'}}>DIJADWALKAN</div>
                </div>
              </div>
              
              {index < scheduleData.length - 1 && (
                <div className="schedule-arrow" style={{color:'#ccc'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default FWMitraSchedule;
