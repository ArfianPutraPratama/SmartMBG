import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProduktivitasMaggot = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/laporan-mitra');
      const data = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push({
          dateObj: d,
          name: d.toLocaleDateString('id-ID', { weekday: 'short' }),
          dateString: d.toISOString().split('T')[0],
          produksi: 0
        });
      }

      data.forEach(item => {
        if (!item.tanggal_operasional) return;
        const itemDate = item.tanggal_operasional.split('T')[0];
        const dayIndex = last7Days.findIndex(day => day.dateString === itemDate);
        // Bisa disesuaikan kondisinya (misal filter berdasar hasil_olahan Maggot)
        if (dayIndex !== -1 && item.hasil_olahan && item.hasil_olahan.toLowerCase().includes('maggot')) {
          last7Days[dayIndex].produksi += parseFloat(item.volume) || 0;
        }
      });

      setChartData(last7Days);
    } catch (error) {
      console.error('Error fetching laporan maggot:', error);
    }
  };

  return (
    <div className="mitra-section-card" style={{marginBottom: 0, padding: '20px'}}>
      <div className="chart-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div className="chart-title">
          <h2 style={{margin: 0, fontSize: '1.25rem', color: '#111'}}>Tren Produksi Maggot</h2>
          <p style={{margin: '4px 0 0 0', fontSize: '0.85rem', color: '#666'}}>Akumulasi panen harian dalam 7 hari terakhir</p>
        </div>
        <select style={{padding:'6px 12px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'0.85rem', color:'#333', backgroundColor: '#fff'}}>
          <option>7 Hari Terakhir</option>
          <option>30 Hari Terakhir</option>
        </select>
      </div>

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProdMitra" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a5d2c" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1a5d2c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `${val}kg`} />
            <Tooltip />
            <Area type="monotone" dataKey="produksi" stroke="#1a5d2c" strokeWidth={2} fillOpacity={1} fill="url(#colorProdMitra)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#666'}}>
        <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div className="legend-dot" style={{width: '12px', height: '12px', backgroundColor: '#1a5d2c', borderRadius: '2px'}}></div>
          <span>Produksi (Kg)</span>
        </div>
        <div className="legend-trend" style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#1a5d2c', fontWeight: '500'}}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          Kenaikan 15% dari minggu lalu
        </div>
      </div>
    </div>
  );
};

export default ProduktivitasMaggot;
