import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../../../api/axios';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import './AnalisisGizi.css';
import '../DashboardGuru.css';
import SidebarGuru from '../components/SidebarGuru';
import defaultThumb from '../../../assets/bento_box.png'; // Fallback image
import nasiImg from '../../../assets/nasi_putih.png';
import ayamImg from '../../../assets/ayam_kecap.png';
import sayurImg from '../../../assets/sayur_bayam.png';
import buahImg from '../../../assets/jeruk.png';

const getFoodIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('ayam') || n.includes('daging') || n.includes('ikan') || n.includes('telur') || n.includes('nugget')) return ayamImg;
  if (n.includes('sayur') || n.includes('buncis')) return sayurImg;
  if (n.includes('nasi') || n.includes('mie') || n.includes('kentang')) return nasiImg;
  if (n.includes('buah') || n.includes('jeruk') || n.includes('pisang') || n.includes('semangka') || n.includes('anggur')) return buahImg;
  return defaultThumb;
};

const AnalisisGizi = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portionSize, setPortionSize] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  
  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/nutrition-histories');
      if (res.data?.status === 'success') {
        setHistoryList(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);
  
  const [aiResult, setAiResult] = useState({
    menu_terdeteksi: [],
    detail_deteksi: [],
    gizi: {
      kalori: 0,
      protein: 0,
      lemak: 0,
      karbo: 0,
      serat: 0,
      vitamin_mineral: 0
    },
    rekomendasi: "Unggah foto nampan makanan untuk melihat analisis AI."
  });

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.post('/analyze-food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.status === 'success') {
        setAiResult({
          menu_terdeteksi: response.data.menu_terdeteksi || [],
          detail_deteksi: response.data.detail_deteksi || [],
          gizi: response.data.gizi || { kalori: 0, protein: 0, lemak: 0, karbo: 0, serat: 0, vitamin_mineral: 0 },
          rekomendasi: response.data.rekomendasi || 'Selesai.'
        });
        setCurrentHistoryId(response.data.history_id || null);
        fetchHistory();
      } else {
        setError(response.data.message || 'Gagal menganalisis gambar');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menghubungi server AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAiResult({
      menu_terdeteksi: [],
      detail_deteksi: [],
      gizi: { kalori: 0, protein: 0, lemak: 0, karbo: 0, serat: 0, vitamin_mineral: 0 },
      rekomendasi: "Unggah foto nampan makanan untuk melihat analisis AI."
    });
    setCurrentHistoryId(null);
  };

  const handlePortionChange = async (size) => {
    setPortionSize(size);
    if (currentHistoryId && aiResult.gizi) {
      try {
        const payload = {
          porsi: size === 1 ? 'Besar' : 'Kecil',
          kalori: aiResult.gizi.kalori * size,
          protein: aiResult.gizi.protein * size,
          lemak: aiResult.gizi.lemak * size,
          karbo: aiResult.gizi.karbo * size,
          serat: aiResult.gizi.serat * size,
          vitamin_mineral: aiResult.gizi.vitamin_mineral * size
        };
        await axiosInstance.put(`/nutrition-histories/${currentHistoryId}`, payload);
        fetchHistory(); // Refresh table
      } catch (err) {
        console.error('Failed to update history portion', err);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <SidebarGuru />

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

        {/* ANALISIS GIZI CONTENT */}
        <div className="analisis-content">
          
          {/* LEFT COLUMN */}
          <div className="analisis-left-col">
            <div className="upload-card">
              <h3 className="card-title">1. Upload Foto Menu Makanan</h3>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/png, image/jpeg, image/jpg" 
                style={{ display: 'none' }} 
              />

              {!selectedImage ? (
                <div className="upload-area" onClick={handleImageClick}>
                  <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <p className="upload-text">Klik untuk upload foto nampan</p>
                  <p className="upload-subtext">PNG/JPG max 2 MB</p>
                </div>
              ) : (
                <div className="upload-success-container">
                  <div className="upload-area" style={{ opacity: 0.5 }}>
                    <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p className="upload-text">Klik untuk upload foto nampan</p>
                    <p className="upload-subtext">PNG/JPG max 2 MB</p>
                  </div>
                  <div className="uploaded-file-card">
                    <div className={`file-status ${error ? 'error' : 'success'}`}>
                      {!error && !isLoading && <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                      {isLoading ? 'Menganalisis gambar...' : error ? error : 'Foto berhasil diunggah!'}
                    </div>
                    
                    <div className="uploaded-file-info">
                      <img src={imagePreview} alt="Thumbnail" className="file-thumb" />
                      <div className="file-details">
                        <p className="file-name">{selectedImage.name}</p>
                        <p className="file-size">{(selectedImage.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <svg className="delete-btn" onClick={handleDeleteImage} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="menu-list-card">
              <h3 className="card-title">2. Menu Makanan Hari Ini</h3>
              
              <div className="menu-items-container">
                {isLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    Memindai gambar...
                  </div>
                ) : (aiResult.menu_terdeteksi || []).length > 0 || (aiResult.detail_deteksi || []).length > 0 ? (
                  (() => {
                    // Menghilangkan duplikat nama makanan, tapi menyimpan seluruh data object (termasuk potongan gambar)
                    const uniqueItems = [];
                    const seenNames = new Set();
                    
                    if (aiResult.detail_deteksi && aiResult.detail_deteksi.length > 0) {
                      aiResult.detail_deteksi.forEach(item => {
                        if (!seenNames.has(item.name)) {
                          seenNames.add(item.name);
                          uniqueItems.push(item);
                        }
                      });
                    } else if (aiResult.menu_terdeteksi && aiResult.menu_terdeteksi.length > 0) {
                      // Fallback jika tidak ada detail_deteksi
                      aiResult.menu_terdeteksi.forEach(name => {
                        if (!seenNames.has(name)) {
                          seenNames.add(name);
                          uniqueItems.push({ name: name });
                        }
                      });
                    }
                    
                    return uniqueItems.map((item, index) => (
                      <div className="menu-item-row" key={index}>
                        <div className="menu-item-left">
                          <img 
                            src={item.image_base64 ? `data:image/jpeg;base64,${item.image_base64}` : getFoodIcon(item.name)} 
                            alt="icon" 
                            className="menu-item-thumb" 
                            style={{ objectFit: 'cover' }} 
                          />
                          <span className="menu-item-name">{item.name || 'Tidak diketahui'}</span>
                        </div>
                        <svg className="check-icon-filled" width="20" height="20" viewBox="0 0 24 24" fill="#1a5d2c"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      </div>
                    ));
                  })()
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
                    Belum ada makanan yang terdeteksi. Silakan unggah foto.
                  </div>
                )}
              </div>
              
              <button className="btn-outline-green" onClick={handleImageClick} disabled={isLoading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                {isLoading ? 'Menganalisis...' : 'Analisis Ulang dengan AI'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="analisis-right-col">
            <div className="analysis-result-card">
              <div className="analysis-header-row">
                <div className="analysis-title-group">
                  <h3>3. Hasil Analisis Kandungan Gizi</h3>
                  <p>Hasil perhitungan untuk 1 porsi</p>
                </div>
                <div className="ai-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Model YOLOv8 Aktif
                </div>
              </div>

              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${portionSize === 1 ? 'active' : ''}`}
                  onClick={() => handlePortionChange(1)}
                >
                  Porsi Besar (1 Porsi Siswa)
                </button>
                <button 
                  className={`toggle-btn ${portionSize === 0.5 ? 'active' : ''}`}
                  onClick={() => handlePortionChange(0.5)}
                >
                  Porsi Kecil (1/2 Porsi Siswa)
                </button>
              </div>

              <div className="nutrients-grid" style={{ opacity: isLoading ? 0.5 : 1 }}>
                {/* Kalori */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-kalori">
                    <span className="nut-big-val">{((aiResult.gizi?.kalori ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">kkal</span>
                  </div>
                  <p className="nut-name">Kalori</p>
                  <svg className="nut-icon-bottom c-kalori" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                </div>

                {/* Protein */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-protein">
                    <span className="nut-big-val">{((aiResult.gizi?.protein ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">g</span>
                  </div>
                  <p className="nut-name">Protein</p>
                  <svg className="nut-icon-bottom c-protein" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                </div>

                {/* Lemak */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-lemak">
                    <span className="nut-big-val">{((aiResult.gizi?.lemak ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">g</span>
                  </div>
                  <p className="nut-name">Lemak</p>
                  <svg className="nut-icon-bottom c-lemak" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>

                {/* Karbohidrat */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-karbo">
                    <span className="nut-big-val">{((aiResult.gizi?.karbo ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">g</span>
                  </div>
                  <p className="nut-name">Karbohidrat</p>
                  <svg className="nut-icon-bottom c-karbo" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>

                {/* Serat */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-serat">
                    <span className="nut-big-val">{((aiResult.gizi?.serat ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">g</span>
                  </div>
                  <p className="nut-name">Serat</p>
                  <svg className="nut-icon-bottom c-serat" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                </div>

                {/* Vitamin & Mineral */}
                <div className="nutrient-box">
                  <div className="nutrient-value-group c-vit">
                    <span className="nut-big-val">{((aiResult.gizi?.vitamin_mineral ?? aiResult.gizi?.vit ?? 0) * portionSize).toFixed(1)}</span>
                    <span className="nut-unit">mg</span>
                  </div>
                  <p className="nut-name">Vitamin &amp; Mineral</p>
                  <svg className="nut-icon-bottom c-vit" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
              </div>

              <div className="ai-recommendation">
                <div className="ai-icon-large">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                </div>
                <div className="ai-rec-content">
                  <div className="ai-rec-header">
                    <h4>4. Rekomendasi AI</h4>
                    <span className={`status-badge-${(aiResult.detail_deteksi || []).length > 0 ? 'green' : 'gray'}`}>
                      {(aiResult.detail_deteksi || []).length > 0 ? 'Status: Dianalisis' : 'Status: Menunggu'}
                    </span>
                  </div>
                  <p>{aiResult?.rekomendasi}</p>
                </div>
              </div>
            </div>

            <div className="history-card">
              <div className="history-header">
                <h3>5. Riwayat Kandungan Gizi</h3>
                <a href="#" className="link-green" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>Lihat Semua ↗</a>
              </div>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>TANGGAL</th>
                    <th>MENU</th>
                    <th>PORSI</th>
                    <th>KALORI</th>
                    <th>PROT (G)</th>
                    <th>LEM (G)</th>
                    <th>KARBO (G)</th>
                    <th>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {historyList.length > 0 ? (
                    historyList.slice(0, 5).map((hist) => {
                      const dateObj = new Date(hist.created_at);
                      const day = dateObj.getDate();
                      const month = dateObj.toLocaleString('id-ID', { month: 'long' });
                      const year = dateObj.getFullYear();
                      
                      const menus = hist.menu_terdeteksi || [];
                      const displayMenus = menus.slice(0, 3);
                      const extraCount = menus.length > 3 ? menus.length - 3 : 0;

                      return (
                        <tr key={hist.id}>
                          <td className="date-col">{day} {month}<br/>{year}</td>
                          <td>
                            <div className="menu-stack">
                              {displayMenus.map((m, idx) => (
                                <img key={idx} src={getFoodIcon(m)} alt={m} title={m} />
                              ))}
                              {extraCount > 0 && (
                                <div className="menu-stack-count">+{extraCount}</div>
                              )}
                              {menus.length === 0 && <span style={{fontSize:'12px', color:'#999'}}>Tidak ada</span>}
                            </div>
                          </td>
                          <td><span className="badge-porsi">{hist.porsi}</span></td>
                          <td className="val-bold">{hist.kalori}</td>
                          <td className="val-muted">{hist.protein}</td>
                          <td className="val-muted">{hist.lemak}</td>
                          <td className="val-muted">{hist.karbo}</td>
                          <td><svg className="action-eye" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Belum ada riwayat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* MODAL LIHAT SEMUA */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Semua Riwayat Kandungan Gizi</h3>
                <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>TANGGAL</th>
                      <th>MENU</th>
                      <th>PORSI</th>
                      <th>KALORI</th>
                      <th>PROT (G)</th>
                      <th>LEM (G)</th>
                      <th>KARBO (G)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.length > 0 ? (
                      historyList.map((hist) => {
                        const dateObj = new Date(hist.created_at);
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleString('id-ID', { month: 'long' });
                        const year = dateObj.getFullYear();
                        
                        const menus = hist.menu_terdeteksi || [];
                        const displayMenus = menus.slice(0, 3);
                        const extraCount = menus.length > 3 ? menus.length - 3 : 0;

                        return (
                          <tr key={hist.id}>
                            <td className="date-col">{day} {month}<br/>{year}</td>
                            <td>
                              <div className="menu-stack">
                                {displayMenus.map((m, idx) => (
                                  <img key={idx} src={getFoodIcon(m)} alt={m} title={m} />
                                ))}
                                {extraCount > 0 && (
                                  <div className="menu-stack-count">+{extraCount}</div>
                                )}
                                {menus.length === 0 && <span style={{fontSize:'12px', color:'#999'}}>Tidak ada</span>}
                              </div>
                            </td>
                            <td><span className="badge-porsi">{hist.porsi}</span></td>
                            <td className="val-bold">{hist.kalori}</td>
                            <td className="val-muted">{hist.protein}</td>
                            <td className="val-muted">{hist.lemak}</td>
                            <td className="val-muted">{hist.karbo}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Belum ada riwayat.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AnalisisGizi;
