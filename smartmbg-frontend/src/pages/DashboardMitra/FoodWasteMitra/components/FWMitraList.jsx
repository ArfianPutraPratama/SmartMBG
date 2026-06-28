import React, { useState, useEffect } from 'react';
import bentoImg from '../../../../assets/bento_box.png';

const FWMitraList = () => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = filterStatus === 'Semua Status' 
        ? 'http://localhost:8000/api/sppg/food-wastes'
        : `http://localhost:8000/api/sppg/food-wastes?status=${filterStatus}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setListData(data);
      }
    } catch (error) {
      console.error('Error fetching food wastes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filterStatus]);

  const handleAmbil = async (id) => {
    // Optimistic Update
    setListData(prev => prev.map(item => item.id === id ? { ...item, status: 'Diambil' } : item));
    if (selectedItem?.id === id) {
      setSelectedItem(prev => ({ ...prev, status: 'Diambil' }));
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/sppg/food-wastes/${id}/take`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchData(); // Sync with backend silently
      } else {
        fetchData(); // Revert
      }
    } catch (error) {
      console.error('Error taking food waste:', error);
      fetchData(); // Revert
    }
  };

  const handleSelesai = async (id) => {
    setListData(prev => prev.map(item => item.id === id ? { ...item, status: 'Selesai' } : item));
    if (selectedItem?.id === id) {
      setSelectedItem(prev => ({ ...prev, status: 'Selesai' }));
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/sppg/food-wastes/${id}/complete`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchData();
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Error completing food waste:', error);
      fetchData();
    }
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeDetail = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="fw-mitra-section card-box">
      <div className="fw-mitra-section-header">
        <div>
          <h3 className="section-title">Sisa Pangan Tersedia untuk Diambil</h3>
          <p className="section-subtitle">List terbaru dari sekolah dan institusi sekitar</p>
        </div>
        <div className="section-actions">
          <select 
            className="filter-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Belum Diambil">Belum Diambil</option>
            <option value="Diambil">Diambil</option>
            <option value="Selesai">Selesai</option>
          </select>
          <button className="btn-filter-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            Lihat Semua
          </button>
        </div>
      </div>

      <div className="fw-mitra-list">
        {isLoading && listData.length === 0 ? (
          <div style={{padding:'20px', textAlign:'center', color:'#888'}}>Memuat data...</div>
        ) : listData.length === 0 ? (
          <div style={{padding:'20px', textAlign:'center', color:'#888'}}>Tidak ada sisa makanan tersedia.</div>
        ) : (
          listData.map((item) => {
            const dateObj = new Date(item.created_at);
            const dateStr = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            // Use item.image_path if exists, else default bento
            const imgSrc = item.image_path ? `http://localhost:8000/${item.image_path}` : bentoImg;
            
            return (
              <div className="fw-mitra-list-item" key={item.id}>
                <div className="fw-mitra-list-img-wrapper">
                  <img src={imgSrc} alt={item.jenis_makanan} className="fw-mitra-list-img" style={{objectFit:'cover'}} />
                </div>
                
                <div className="fw-mitra-list-content">
                  <div className="fw-mitra-list-top">
                    <div className="fw-mitra-list-title-area">
                      <span className="badge-new">BARU</span>
                      <h4 style={{textTransform:'capitalize'}}>{item.sppg_username || item.lokasi.split(',')[0]}</h4>
                    </div>
                    <div className="badge-status">{item.status}</div>
                  </div>
                  
                  <div className="fw-mitra-list-address">{item.lokasi}</div>
                  
                  <div className="fw-mitra-list-details">
                    <div className="detail-item" style={{textTransform:'capitalize'}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18v12H3z"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      {item.jenis_makanan}
                    </div>
                    <div className="detail-item distance">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {(() => {
                        const mitraLat = -7.3115;
                        const mitraLng = 112.7275;
                        if (!item.lat || !item.lng) return "N/A";
                        const R = 6371;
                        const dLat = (item.lat - mitraLat) * Math.PI / 180;
                        const dLon = (item.lng - mitraLng) * Math.PI / 180;
                        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(mitraLat * Math.PI / 180) * Math.cos(item.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
                        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                        return (R * c).toFixed(1) + ' km';
                      })()}
                    </div>
                    <div className="detail-item weight">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {item.berat} Kg
                    </div>
                    <div className="detail-item time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {dateStr} • {item.waktu_input || 'N/A'}
                    </div>
                  </div>

                  <div className="fw-mitra-list-actions">
                    <button className="btn-detail" onClick={() => openDetail(item)}>Detail</button>
                    {item.status === 'Belum Diambil' && (
                      <button className="btn-ambil" onClick={() => handleAmbil(item.id)}>Ambil</button>
                    )}
                    {item.status === 'Diambil' && (
                      <button className="btn-ambil" onClick={() => handleSelesai(item.id)} style={{backgroundColor: '#1976d2'}}>Selesaikan</button>
                    )}
                    {item.status === 'Selesai' && (
                      <button className="btn-ambil" style={{backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', cursor: 'not-allowed'}} disabled>Selesai</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="fw-mitra-list-footer">
        <button className="btn-text-green">Lihat Semua Permintaan</button>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedItem && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', color: '#111'}}>Detail Sisa Pangan</h3>
              <button onClick={closeDetail} style={{background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}>&times;</button>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <img src={selectedItem.image_path ? `http://localhost:8000/${selectedItem.image_path}` : bentoImg} alt={selectedItem.jenis_makanan} style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px'}} />
            </div>

            <div style={{marginBottom: '16px'}}>
              <h4 style={{margin: '0 0 4px 0', color: '#333', fontSize: '1.1rem', textTransform: 'capitalize'}}>{selectedItem.sppg_username || selectedItem.lokasi.split(',')[0]}</h4>
              <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>{selectedItem.lokasi}</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px'}}>
              <div>
                <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '4px'}}>Jenis Makanan</div>
                <div style={{fontWeight: '600', color: '#333', textTransform: 'capitalize'}}>{selectedItem.jenis_makanan}</div>
              </div>
              <div>
                <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '4px'}}>Berat</div>
                <div style={{fontWeight: '600', color: '#333'}}>{selectedItem.berat} Kg</div>
              </div>
              <div>
                <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '4px'}}>Waktu Input</div>
                <div style={{fontWeight: '600', color: '#333'}}>{selectedItem.waktu_input || '-'}</div>
              </div>
              <div>
                <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '4px'}}>Status</div>
                <div style={{fontWeight: '600', color: '#e65100'}}>{selectedItem.status}</div>
              </div>
            </div>

            {selectedItem.keterangan && (
              <div style={{marginBottom: '20px'}}>
                <div style={{fontSize: '0.85rem', color: '#888', marginBottom: '4px'}}>Keterangan Tambahan</div>
                <div style={{color: '#444', fontSize: '0.95rem'}}>{selectedItem.keterangan}</div>
              </div>
            )}

            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={closeDetail} style={{flex: 1, padding: '12px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', color: '#555', fontWeight: '600', cursor: 'pointer'}}>Tutup</button>
              {selectedItem.status === 'Belum Diambil' && (
                <button onClick={() => handleAmbil(selectedItem.id)} style={{flex: 1, padding: '12px', background: '#1a5d2c', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer'}}>Ambil Sekarang</button>
              )}
              {selectedItem.status === 'Diambil' && (
                <button onClick={() => handleSelesai(selectedItem.id)} style={{flex: 1, padding: '12px', background: '#1976d2', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer'}}>Selesaikan Penjemputan</button>
              )}
              {selectedItem.status === 'Selesai' && (
                <button disabled style={{flex: 1, padding: '12px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '8px', color: '#2e7d32', fontWeight: '600', cursor: 'not-allowed'}}>Selesai Diambil</button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FWMitraList;
