import React, { useState, useEffect } from 'react';

const FWMitraNotif = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://smart-mbg-coral.vercel.app/api/sppg/food-wastes');
      if (response.ok) {
        const data = await response.json();
        
        // Sort by updated_at or created_at descending
        const sortedData = data.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
        
        // Take top 4 for notifications
        setNotifications(sortedData.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
    return `${Math.floor(diff / 86400)} hari yang lalu`;
  };

  return (
    <div className="card-box" style={{height: '100%'}}>
      <div className="fw-mitra-section-header" style={{marginBottom: '20px'}}>
        <h3 className="section-title">Notifikasi Terbaru</h3>
        <a href="#" className="btn-text-green" style={{fontSize:'0.85rem'}}>Lihat Semua</a>
      </div>

      <div className="notif-list" style={{display:'flex', flexDirection:'column', gap:'16px', maxHeight: '350px', overflowY: 'auto'}}>
        {notifications.length === 0 ? (
          <div style={{color: '#888', fontSize: '0.9rem'}}>Tidak ada notifikasi</div>
        ) : (
          notifications.map(notif => {
            let icon, title, desc, iconBg, iconColor, isNew;
            const locName = notif.lokasi ? notif.lokasi.split(',')[0] : 'Sekolah';
            
            if (notif.status === 'Belum Diambil') {
              iconBg = '#e8f5e9'; iconColor = '#2e7d32'; isNew = true;
              title = `Permintaan baru dari ${locName}`;
              desc = `${notif.berat} Kg sisa makanan tersedia untuk diambil`;
              icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
            } else if (notif.status === 'Selesai') {
              iconBg = '#fff3e0'; iconColor = '#ef6c00'; isNew = false;
              title = `Pickup Selesai - ${locName}`;
              desc = `Tim pengolah sudah menerima ${notif.berat} Kg bahan`;
              icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
            } else { // Diambil
              iconBg = '#e3f2fd'; iconColor = '#1976d2'; isNew = false;
              title = `Dalam Perjalanan ke ${locName}`;
              desc = `Tim sedang menjemput ${notif.berat} Kg sisa makanan`;
              icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
            }

            return (
              <div key={notif.id} className="notif-item" style={{display:'flex', gap:'12px'}}>
                <div className="notif-icon" style={{width:'36px', height:'36px', borderRadius:'50%', backgroundColor:iconBg, color:iconColor, display:'flex', justifyContent:'center', alignItems:'center', flexShrink:0}}>
                  {icon}
                </div>
                <div>
                  <h4 style={{margin:'0 0 4px 0', fontSize:'0.9rem', color:'#111', display:'flex', alignItems:'center', gap:'8px'}}>
                    {title}
                    {isNew && <div style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'#d32f2f'}}></div>}
                  </h4>
                  <p style={{margin:'0 0 4px 0', fontSize:'0.8rem', color:'#666'}}>{desc}</p>
                  <div style={{fontSize:'0.75rem', color:'#aaa'}}>{getTimeAgo(notif.updated_at || notif.created_at)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FWMitraNotif;
