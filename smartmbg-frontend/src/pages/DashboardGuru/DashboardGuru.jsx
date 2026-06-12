import React, { useState, useEffect } from 'react';
import TopbarProfile from '../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import SidebarGuru from './components/SidebarGuru';
import axiosInstance from '../../api/axios';
import './DashboardGuru.css';
import nasiImg from '../../assets/nasi_putih.png';
import ayamImg from '../../assets/ayam_kecap.png';
import sayurImg from '../../assets/sayur_bayam.png';
import jerukImg from '../../assets/jeruk.png';
import saladImg from '../../assets/salad_bowl.png';

const getFoodDetails = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('ayam')) return { img: ayamImg, type: 'Sumber Protein' };
  if (n.includes('sayur')) return { img: sayurImg, type: 'Serat & Vitamin' };
  if (n.includes('nasi')) return { img: nasiImg, type: 'Karbohidrat Utama' };
  if (n.includes('jeruk') || n.includes('buah')) return { img: jerukImg, type: 'Vitamin C Alami' };
  return { img: nasiImg, type: 'Menu Tambahan' }; // fallback
};

const DashboardGuru = () => {
  const navigate = useNavigate();
  const [latestHistory, setLatestHistory] = useState(null);
  const [latestReviews, setLatestReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    siswaTerlayani: 0,
    rataRataUlasan: 0,
    sisaMakanan: 0
  });

  useEffect(() => {
    const fetchHistoryAndStats = async () => {
      try {
        const res = await axiosInstance.get('/nutrition-histories');
        if (res.data?.status === 'success' && res.data.data && res.data.data.length > 0) {
          const latest = res.data.data[0];
          const latestDate = new Date(latest.created_at).toDateString();
          const todayDate = new Date().toDateString();
          
          if (latestDate === todayDate) {
            setLatestHistory(latest);
          } else {
            setLatestHistory(null);
          }
        }

        // Fetch dynamic stats
        const [reviewsRes, wastesRes, entitasRes] = await Promise.all([
          axiosInstance.get('/reviews').catch(() => ({ data: [] })),
          axiosInstance.get('/sppg/food-wastes').catch(() => ({ data: [] })),
          axiosInstance.get('/entitas').catch(() => ({ data: [] }))
        ]);

        const reviews = reviewsRes.data || [];
        const wastes = wastesRes.data || [];
        const entitas = entitasRes.data || [];

        const avgRating = reviews.length > 0 
          ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
          : 0;

        const sortedReviews = [...reviews].sort((a, b) => {
          const dateDiff = new Date(b.date) - new Date(a.date);
          return dateDiff === 0 ? b.id - a.id : dateDiff;
        });
        setLatestReviews(sortedReviews.slice(0, 3));

        const totalSisa = wastes.reduce((acc, w) => acc + parseFloat(w.berat_sisa || 0), 0).toFixed(1);
        
        // Asumsi tiap entitas punya ~80 siswa jika field jumlah_siswa tidak ada
        const totalSiswa = entitas.length > 0 
          ? entitas.reduce((acc, e) => acc + parseInt(e.jumlah_siswa || 80), 0)
          : 0;

        setStats({
          siswaTerlayani: totalSiswa,
          rataRataUlasan: avgRating,
          sisaMakanan: totalSisa
        });

      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryAndStats();
  }, []);

  const menuTerdeteksi = latestHistory?.menu_terdeteksi || [];
  const totalMenu = menuTerdeteksi.length;

  const renderStars = (score) => {
    const filled = '★'.repeat(score);
    const empty = '☆'.repeat(5 - score);
    return filled + empty;
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <SidebarGuru />

      {/* Main Container */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile 
              name={JSON.parse(localStorage.getItem('user'))?.name || 'Guru'} 
              role="GURU" 
              avatarText={(JSON.parse(localStorage.getItem('user'))?.name || 'G').charAt(0).toUpperCase()} 
            />
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>Halo, {JSON.parse(localStorage.getItem('user'))?.name?.split(' ')[0] || 'Guru'}! <span>👋</span></h1>
              <p>Berikut ringkasan nutrisi sekolah Anda hari ini.</p>
            </div>
            <div className="date-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span>Menu Hari Ini</span>
                <div className="stat-icon icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
              </div>
              <h2 className="stat-value">{isLoading ? '-' : (totalMenu > 0 ? totalMenu : 0)}</h2>
              <span className="stat-desc">Jenis</span>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Rata-rata Ulasan</span>
                <div className="stat-icon icon-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              </div>
              <h2 className="stat-value">{isLoading ? '-' : `${stats.rataRataUlasan}/5`}</h2>
              <span className="stat-desc">Baik</span>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <span>Sisa Makanan</span>
                <div className="stat-icon icon-red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </div>
              </div>
              <h2 className="stat-value">{isLoading ? '-' : stats.sisaMakanan}</h2>
              <span className="stat-desc">Kg</span>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header">
              <h3 className="guru-section-title">Menu Hari Ini</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/analisis-gizi'); }} className="link-green">Lihat Detail &gt;</a>
            </div>
            <div className="menu-grid">
              {isLoading ? (
                <p style={{ color: '#666' }}>Memuat data menu...</p>
              ) : menuTerdeteksi.length > 0 ? (
                menuTerdeteksi.map((menu, idx) => {
                  const details = getFoodDetails(menu);
                  return (
                    <div className="menu-card" key={idx}>
                      <img src={details.img} alt={menu} className="menu-img" />
                      <h4 className="menu-name">{menu}</h4>
                      <p className="menu-type">{details.type}</p>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic', padding: '16px 0' }}>
                  Belum ada data menu hari ini, silakan unggah foto di menu Analisis Gizi.
                </p>
              )}
            </div>
          </div>

          <div className="section-container">
            <h3 className="guru-section-title" style={{marginBottom: '20px'}}>
              <div className="stat-icon icon-green" style={{display:'inline-flex', verticalAlign:'middle', marginRight:'8px'}}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              Analisis Gizi (AI) - 1 Porsi
            </h3>
            
            <div className="nutrition-grid">
              <div className="nutrition-card">
                <div className="nut-label">Kalori</div>
                <div className="nut-val">{latestHistory ? latestHistory.kalori : '0'}</div>
                <div className="nut-unit">kkal</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Protein</div>
                <div className="nut-val">{latestHistory ? latestHistory.protein : '0'}</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Lemak</div>
                <div className="nut-val">{latestHistory ? latestHistory.lemak : '0'}</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Karbohidrat</div>
                <div className="nut-val">{latestHistory ? latestHistory.karbo : '0'}</div>
                <div className="nut-unit">g</div>
              </div>
              <div className="nutrition-card">
                <div className="nut-label">Serat</div>
                <div className="nut-val">{latestHistory ? (latestHistory.serat || '8.2') : '0'}</div>
                <div className="nut-unit">g</div>
              </div>
            </div>

            <div className="alert-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div className="alert-text">
                <h4>Rekomendasi Ahli Gizi</h4>
                <p>{latestHistory?.rekomendasi || 'Belum ada rekomendasi. Unggah foto nampan makanan untuk melihat analisis AI.'}</p>
              </div>
            </div>
          </div>

          <div className="section-container">
            <div className="section-header">
              <h3 className="guru-section-title">
                <div className="stat-icon icon-green" style={{display:'inline-flex', verticalAlign:'middle', marginRight:'8px'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
                Ulasan Terbaru
              </h3>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/evaluasi-ulasan'); }} className="link-green">Lihat Semua &gt;</a>
            </div>
            
            <div className="review-list" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              {latestReviews.length > 0 ? (
                latestReviews.map((review) => (
                  <div key={review.id} style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #eaeaea', borderRadius: '12px', backgroundColor: '#fff' }}>
                    <img 
                      src={review.image ? `http://localhost:8000/storage/${review.image}` : saladImg} 
                      alt="Menu" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#111' }}>{review.school_name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(review.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#e8b923', fontSize: '1.1rem', letterSpacing: '2px' }}>{renderStars(review.rating)}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111' }}>{review.rating}.0</span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          backgroundColor: review.is_match ? '#eaf3ed' : '#fde8e8',
                          color: review.is_match ? '#1a5d2c' : '#e53e3e',
                          fontWeight: '600'
                        }}>
                          {review.is_match ? 'Cocok' : 'Tidak Cocok'}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#444', fontStyle: 'italic', borderLeft: `3px solid ${review.is_match ? '#1a5d2c' : '#e53e3e'}`, paddingLeft: '8px' }}>
                        "{review.description || 'Tidak ada deskripsi tambahan.'}"
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#999', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
                  Belum ada ulasan terbaru.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <footer className="dashboard-footer">
          © 2024 SmartMBG - Sekolah Sehat, Nutrisi Terjaga.
        </footer>
      </main>

    </div>
  );
};

export default DashboardGuru;
