import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AktivitasTerakhir = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [fwRes, laporanRes] = await Promise.all([
          axios.get('http://localhost:8000/api/sppg/food-wastes').catch(() => ({ data: [] })),
          axios.get('http://localhost:8000/api/laporan-mitra').catch(() => ({ data: [] }))
        ]);

        let allActivities = [];

        // Process Food Wastes (Pickups)
        const fwData = fwRes.data || [];
        fwData.forEach(item => {
          if (item.status === 'Diambil' || item.status === 'Selesai') {
            allActivities.push({
              id: `fw-${item.id}`,
              type: 'pickup',
              title: `Pickup Berhasil: ${item.lokasi}`,
              desc: `${item.berat} Kg sisa makanan telah diterima.`,
              dateObj: new Date(item.updated_at || item.created_at),
              iconType: 'truck'
            });
          }
        });

        // Process Laporan (Panen)
        const laporanData = laporanRes.data || [];
        laporanData.forEach(item => {
          if (item.status.toLowerCase() === 'selesai') {
            allActivities.push({
              id: `lap-${item.id}`,
              type: 'panen',
              title: `Panen Maggot: Batch ${item.batch_id}`,
              desc: `Total ${item.volume} Kg ${item.hasil_olahan}.`,
              dateObj: new Date(item.updated_at || item.created_at || item.tanggal_operasional),
              iconType: 'box'
            });
          }
        });

        // Sort by date descending
        allActivities.sort((a, b) => b.dateObj - a.dateObj);

        // Format time
        const formattedActivities = allActivities.slice(0, 3).map(act => {
          const now = new Date();
          const actDate = act.dateObj;
          const isToday = now.toDateString() === actDate.toDateString();
          
          let timeStr = actDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          if (!isToday) {
             const isYesterday = new Date(new Date().setDate(now.getDate() - 1)).toDateString() === actDate.toDateString();
             if (isYesterday) {
               timeStr = `Kemarin, ${timeStr}`;
             } else {
               timeStr = `${actDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, ${timeStr}`;
             }
          }

          return { ...act, time: timeStr };
        });

        setActivities(formattedActivities);
      } catch (err) {
        console.error("Error fetching activities", err);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="mitra-section-card" style={{marginBottom: 0}}>
      <h3 className="mitra-section-title" style={{marginBottom: '20px'}}>Aktivitas Terakhir</h3>

      <div className="mitra-timeline">
        {activities.length > 0 ? activities.map((act) => (
          <div className="mitra-timeline-item" key={act.id}>
            <div className={`mitra-timeline-icon ${act.iconType === 'truck' ? 'green' : (act.iconType === 'box' ? 'green' : 'gray')}`}>
              {act.iconType === 'truck' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
              {act.iconType === 'box' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
            </div>
            
            <div className="mitra-timeline-content">
              <h4>{act.title}</h4>
              <p>{act.desc}</p>
              <div className="mitra-timeline-time">{act.time}</div>
            </div>
          </div>
        )) : (
          <p style={{color: '#888', fontSize: '0.85rem'}}>Belum ada aktivitas terbaru.</p>
        )}
      </div>
    </div>
  );
};

export default AktivitasTerakhir;
