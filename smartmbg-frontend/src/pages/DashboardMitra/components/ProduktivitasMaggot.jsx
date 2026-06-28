import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProduktivitasMaggot = () => {
  const [chartData, setChartData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [filterDays, setFilterDays] = useState(7);

  const generateChartData = (data, days) => {
    const pastDays = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      pastDays.push({
        dateObj: d,
        name: days === 7 ? d.toLocaleDateString('id-ID', { weekday: 'short' }) : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        dateString: d.toISOString().split('T')[0],
        produksi: 0
      });
    }

    data.forEach(item => {
      if (!item.tanggal_operasional) return;
      const itemDate = item.tanggal_operasional.split('T')[0];
      const dayIndex = pastDays.findIndex(day => day.dateString === itemDate);
      if (dayIndex !== -1 && item.status.toLowerCase() === 'selesai') {
        pastDays[dayIndex].produksi += parseFloat(item.volume) || 0;
      }
    });

    setChartData(pastDays);
  };

  useEffect(() => {
    axios.get('/laporan-mitra')
      .then(response => {
        setRawData(response.data);
        generateChartData(response.data, 7);
      })
      .catch(error => {
        console.error("Error fetching laporan mitra:", error);
      });
  }, []);

  return (
    <div className="mitra-section-card" style={{marginBottom: 0}}>
      <div className="mitra-section-header">
        <h3 className="mitra-section-title">Produktivitas Maggot</h3>
        <select 
          className="chart-dropdown"
          style={{padding:'4px 8px', borderRadius:'4px', border:'1px solid #ddd', fontSize:'0.8rem', color:'#666'}}
          value={filterDays}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            setFilterDays(val);
            generateChartData(rawData, val);
          }}
        >
          <option value={7}>7 Hari Terakhir</option>
          <option value={30}>30 Hari Terakhir</option>
        </select>
      </div>

      <div className="mitra-chart-wrapper" style={{ marginTop: '16px' }}>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProdMitraMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a5d2c" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a5d2c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `${val}kg`} />
              <Tooltip />
              <Area type="monotone" dataKey="produksi" stroke="#1a5d2c" strokeWidth={2} fillOpacity={1} fill="url(#colorProdMitraMain)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mitra-chart-legend" style={{marginTop: '12px'}}>
          <div className="mitra-legend-dot"></div>
          <span>Produksi (Kg)</span>
          <span style={{marginLeft: 'auto'}}>Kenaikan 15% dari minggu lalu</span>
        </div>
      </div>
    </div>
  );
};

export default ProduktivitasMaggot;
