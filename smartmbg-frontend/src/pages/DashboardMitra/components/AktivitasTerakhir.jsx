import React from 'react';

const activities = [
  {
    id: 1,
    title: 'Pickup Berhasil: SDN Gayungan 2',
    desc: '32 Kg sisa makanan telah diterima dan diproses.',
    time: '10:45 AM',
    iconType: 'truck'
  },
  {
    id: 2,
    title: 'Panen Maggot: Batch A-12',
    desc: 'Total 45 Kg pupuk organik dan 12 Kg maggot kering.',
    time: '08:20 AM',
    iconType: 'box'
  },
  {
    id: 3,
    title: 'Pendaftaran Mitra Baru',
    desc: 'EcoMaggot Sidoarjo bergabung ke jaringan.',
    time: 'Kemarin, 16:30 PM',
    iconType: 'user'
  }
];

const AktivitasTerakhir = () => {
  return (
    <div className="mitra-section-card" style={{marginBottom: 0}}>
      <h3 className="mitra-section-title" style={{marginBottom: '20px'}}>Aktivitas Terakhir</h3>

      <div className="mitra-timeline">
        {activities.map((act) => (
          <div className="mitra-timeline-item" key={act.id}>
            <div className={`mitra-timeline-icon ${act.iconType === 'truck' ? 'green' : (act.iconType === 'box' ? 'green' : 'gray')}`}>
              {act.iconType === 'truck' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
              {act.iconType === 'box' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
              {act.iconType === 'user' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
            </div>
            
            <div className="mitra-timeline-content">
              <h4>{act.title}</h4>
              <p>{act.desc}</p>
              <div className="mitra-timeline-time">{act.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AktivitasTerakhir;
