import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import SidebarMitra from '../components/SidebarMitra';
import './LaporanMitra.css';

const chartData = [
  { name: 'Sen', produksi: 30 },
  { name: 'Sel', produksi: 60 },
  { name: 'Rab', produksi: 45 },
  { name: 'Kam', produksi: 110 },
  { name: 'Jum', produksi: 150 },
  { name: 'Sab', produksi: 140 },
  { name: 'Min', produksi: 170 },
];

const LaporanMitra = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ totalMaggot: 0, konversi: 0, batchAktif: 0 });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/laporan-mitra');
      const data = response.data;
      
      let totalMaggotRaw = 0;
      let batchAktifCount = 0;

      const formattedData = data.map(item => {
        if (item.hasil_olahan === 'Maggot Kering') {
          totalMaggotRaw += parseFloat(item.volume) || 0;
        }
        if (item.status.toUpperCase() === 'DIPROSES') {
          batchAktifCount++;
        }
        return {
          realId: item.id,
          id: item.batch_id,
          tanggal: new Date(item.tanggal_operasional).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          }),
          hasil: item.hasil_olahan,
          volume: `${item.volume} Kg`,
          harga: `Rp ${Number(item.harga).toLocaleString('id-ID')}`,
          status: item.status.toUpperCase()
        };
      });
      setTableData(formattedData);

      // Fetch food wastes to calculate conversion rate
      let totalFoodWaste = 0;
      try {
        const responseFW = await axios.get('http://localhost:8000/api/sppg/food-wastes');
        totalFoodWaste = responseFW.data.reduce((acc, curr) => {
          if (curr.status === 'Diambil' || curr.status === 'Selesai') {
            return acc + (parseFloat(curr.berat) || 0);
          }
          return acc;
        }, 0);
      } catch (e) {
        console.error('Error fetching food wastes for konversi:', e);
      }

      let konversiRate = 0;
      if (totalFoodWaste > 0) {
        konversiRate = ((totalMaggotRaw / totalFoodWaste) * 100).toFixed(1);
      }

      setStats({
        totalMaggot: totalMaggotRaw,
        konversi: konversiRate,
        batchAktif: batchAktifCount
      });

      // Process for chart (Last 7 days)
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
        const itemDate = item.tanggal_operasional.split('T')[0];
        const dayIndex = last7Days.findIndex(day => day.dateString === itemDate);
        if (dayIndex !== -1 && item.status.toLowerCase() === 'selesai') {
          last7Days[dayIndex].produksi += parseFloat(item.volume) || 0;
        }
      });

      setChartData(last7Days);

    } catch (error) {
      console.error('Error fetching laporan:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Hapus Laporan?',
      text: "Data ini tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#666',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/laporan-mitra/${id}`);
          Swal.fire('Terhapus!', 'Laporan berhasil dihapus.', 'success');
          fetchData(); // Refresh table data
        } catch (error) {
          console.error('Error deleting laporan:', error);
          Swal.fire('Error', 'Gagal menghapus laporan.', 'error');
        }
      }
    });
  };

  const handleExport = () => {
    Swal.fire({
      title: 'Pilih Format Ekspor',
      text: 'Silakan pilih format laporan yang ingin Anda unduh:',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Excel',
      confirmButtonColor: '#217346',
      denyButtonText: 'PDF',
      denyButtonColor: '#d32f2f',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Mengunduh!', 'Laporan sedang diunduh dalam format Excel...', 'success');
        // TODO: Implement Excel download logic
      } else if (result.isDenied) {
        Swal.fire('Mengunduh!', 'Laporan sedang diunduh dalam format PDF...', 'success');
        // TODO: Implement PDF download logic
      }
    });
  };

  return (
    <div className="dashboard-layout">
      <SidebarMitra />

      <main className="dashboard-main">
        {/* Topbar matching the image structure */}
        <header className="dashboard-topbar">
          <div className="topbar-title">Laporan</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="A" />
          </div>
        </header>

        <div className="dashboard-content laporan-mitra-container">
          
          {/* Summary Cards */}
          <div className="laporan-summary-grid">
            <div className="summary-card">
              <div className="summary-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C21.12 21.5 13 22 11 20z" /><path d="M19 2c-3 4-5 5-9 5s-6 1-6 1"/></svg>
              </div>
              <div className="summary-badge">+12% vs bln lalu</div>
              <div className="summary-title">Total Maggot Dihasilkan</div>
              <div className="summary-value">
                {stats.totalMaggot.toLocaleString('id-ID')} <span className="summary-unit">Kg</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3"/><path d="M12 3v18"/><path d="m16 8-4-4-4 4"/><path d="m8 16 4 4 4-4"/></svg>
              </div>
              <div className="summary-badge optimal">Optimal</div>
              <div className="summary-title">Rata-rata Konversi</div>
              <div className="summary-value">
                {stats.konversi} <span className="summary-unit">%</span>
              </div>
            </div>

            <div className="summary-card">
              <div className="stacked-icons">
                <div className="stacked-icon"></div>
                <div className="stacked-icon"></div>
                <div className="stacked-icon"></div>
              </div>
              <div className="summary-icon-wrapper">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div className="summary-title">Jumlah Batch Aktif</div>
              <div className="summary-value">
                {stats.batchAktif} <span className="summary-unit">Unit</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section">
            <div className="chart-header">
              <div className="chart-title">
                <h2>Tren Produksi Maggot</h2>
                <p>Akumulasi panen harian dalam 7 hari terakhir</p>
              </div>
              <select className="chart-dropdown">
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
              </select>
            </div>

            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a5d2c" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1a5d2c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `${val}kg`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="produksi" stroke="#1a5d2c" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot"></div>
                <span>Produksi (Kg)</span>
              </div>
              <div className="legend-trend">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Kenaikan 15% dari minggu lalu
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-section">
            <div className="table-header">
              <h2>Riwayat Harvesting / Panen</h2>
              <div className="table-actions">
                <button className="btn-export" onClick={handleExport}>
                  Ekspor Laporan
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button className="btn-add-laporan" onClick={() => window.location.href = '/dashboard-mitra/tambah-laporan'}>
                  + Tambah Laporan
                </button>
              </div>
            </div>

            <table className="mitra-table">
              <thead>
                <tr>
                  <th>ID BATCH</th>
                  <th>TANGGAL PANEN</th>
                  <th>HASIL OLAHAN</th>
                  <th>VOLUME (KG)</th>
                  <th>HARGA (RP/KG)</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="table-id-batch">{row.id}</td>
                    <td>{row.tanggal}</td>
                    <td>{row.hasil}</td>
                    <td className="table-volume">{row.volume}</td>
                    <td className="table-harga">{row.harga}</td>
                    <td>
                      <span className={`status-badge ${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-row-actions">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer'}} onClick={() => navigate(`/dashboard-mitra/edit-laporan/${row.realId}`)}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        <svg viewBox="0 0 24 24" stroke="#d32f2f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{cursor: 'pointer', marginLeft: '4px'}} onClick={() => handleDelete(row.realId)}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="load-more">
              Muat Lebih Banyak Riwayat
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LaporanMitra;
