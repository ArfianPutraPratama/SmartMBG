import React from 'react';

const ProduktivitasMaggot = () => {
  // Mock data for bar heights (percentages)
  const data = [
    { day: 'Sen', height: '35%' },
    { day: 'Sel', height: '45%' },
    { day: 'Rab', height: '40%' },
    { day: 'Kam', height: '80%' },
    { day: 'Jum', height: '65%' },
    { day: 'Sab', height: '35%' },
    { day: 'Min', height: '25%' },
  ];

  return (
    <div className="mitra-section-card" style={{marginBottom: 0}}>
      <div className="mitra-section-header">
        <h3 className="mitra-section-title">Produktivitas Maggot</h3>
        <select style={{padding:'4px 8px', borderRadius:'4px', border:'1px solid #ddd', fontSize:'0.8rem', color:'#666'}}>
          <option>7 Hari Terakhir</option>
        </select>
      </div>

      <div className="mitra-chart-wrapper">
        <div className="mitra-chart-bars">
          {data.map((d, index) => (
            <div className="mitra-bar-col" key={index}>
              <div className="mitra-bar" style={{height: d.height}}></div>
              <span className="mitra-bar-label">{d.day}</span>
            </div>
          ))}
        </div>
        
        <div className="mitra-chart-legend">
          <div className="mitra-legend-dot"></div>
          <span>Produksi (Kg)</span>
          <span style={{marginLeft: 'auto'}}>Kenaikan 15% dari minggu lalu</span>
        </div>
      </div>
    </div>
  );
};

export default ProduktivitasMaggot;
