import React, { useState, useEffect } from 'react';
import bentoImg from '../../../../assets/bento_box.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Icon for Mitra
const mitraIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom Icon for SPPG destination (Diambil)
const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const FWMitraMap = () => {
  const [listData, setListData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [routes, setRoutes] = useState([]);

  // Dummy Mitra location in Surabaya (around Tunjungan Plaza area)
  const mitraLocation = [-7.2614, 112.7397];

  const fetchData = async () => {
    try {
      // Fetch all food wastes (both Tersedia and Diambil)
      const response = await fetch('https://a5a1-182-8-68-206.ngrok-free.app/api/sppg/food-wastes');
      if (response.ok) {
        const data = await response.json();
        setListData(data);
        
        if (data.length > 0 && !selectedItem) {
          // Select the first 'Belum Diambil' or 'Diambil' by default if possible
          const firstAvailable = data.find(item => item.status !== 'Selesai');
          setSelectedItem(firstAvailable || data[0]);
        }

        // Fetch routes for all 'Diambil' items
        const diambilItems = data.filter(item => item.status === 'Diambil' && item.lat && item.lng);
        fetchRoutes(diambilItems);
      }
    } catch (error) {
      console.error('Error fetching food wastes:', error);
    }
  };

  const fetchRoutes = async (diambilItems) => {
    try {
      const routePromises = diambilItems.map(async (item) => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${mitraLocation[1]},${mitraLocation[0]};${item.lng},${item.lat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const routeData = await res.json();
          
          if (routeData.routes && routeData.routes.length > 0) {
            const routeObj = routeData.routes[0];
            const coords = routeObj.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Swap to [lat, lng]
            return { 
              itemId: item.id, 
              coordinates: coords,
              distance: routeObj.distance, // in meters
              duration: routeObj.duration // in seconds
            };
          }
        } catch (e) {
          console.error('Error fetching route for item', item.id, e);
        }
        return null;
      });

      const resolvedRoutes = await Promise.all(routePromises);
      const newRoutes = resolvedRoutes.filter(route => route !== null);
      setRoutes(newRoutes);
    } catch (error) {
      console.error('Error in fetchRoutes', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAmbil = async (id) => {
    // Optimistic UI update
    setSelectedItem(prev => prev && prev.id === id ? { ...prev, status: 'Diambil' } : prev);
    
    try {
      const response = await fetch(`https://a5a1-182-8-68-206.ngrok-free.app/api/sppg/food-wastes/${id}/take`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchData(); // This will fetch routes in the background
      }
    } catch (error) {
      console.error('Error taking food waste:', error);
      fetchData(); // Revert on error
    }
  };

  const handleSelesai = async (id) => {
    setSelectedItem(prev => prev && prev.id === id ? { ...prev, status: 'Selesai' } : prev);
    try {
      const response = await fetch(`https://a5a1-182-8-68-206.ngrok-free.app/api/sppg/food-wastes/${id}/complete`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error completing food waste:', error);
      fetchData(); // Revert on error
    }
  };

  // Filter listData to not show 'Selesai' items on the map
  const mapData = listData.filter(item => item.status !== 'Selesai');

  return (
    <div className="fw-mitra-map-section">
      <div className="card-box mb-4">
        <div className="fw-mitra-section-header">
          <h3 className="section-title">Peta Sisa Pangan & Rute Penjemputan</h3>
          <a href="#" className="btn-text-green" style={{fontSize:'0.85rem'}}>Lihat Semua</a>
        </div>
        
        <div className="fw-map-container" style={{height: '350px', borderRadius:'8px', overflow:'hidden', position:'relative', zIndex: 1}}>
          <MapContainer center={mitraLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Marker Mitra */}
            <Marker position={mitraLocation} icon={mitraIcon}>
              <Popup><strong>Lokasi Anda (Mitra)</strong></Popup>
            </Marker>

            {/* Food Waste Markers */}
            {mapData.map((item) => {
              if (item.lat && item.lng) {
                const isDiambil = item.status === 'Diambil';
                return (
                  <Marker 
                    key={item.id} 
                    position={[item.lat, item.lng]}
                    icon={isDiambil ? destinationIcon : new L.Icon.Default()}
                    eventHandlers={{
                      click: () => setSelectedItem(item),
                    }}
                  >
                    <Popup>
                      <strong>{item.lokasi.split(',')[0]}</strong><br/>
                      {item.berat} Kg<br/>
                      <span style={{color: isDiambil ? '#f57c00' : '#2e7d32', fontWeight: 'bold'}}>{item.status}</span>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}

            {/* Render Routes */}
            {routes.map((route, idx) => (
              <Polyline 
                key={idx} 
                positions={route.coordinates} 
                color="#f57c00" 
                weight={4} 
                opacity={0.8}
                dashArray="10, 10" 
              />
            ))}

          </MapContainer>
        </div>
      </div>

      <div className="card-box">
        <div className="fw-mitra-section-header" style={{marginBottom: '16px'}}>
          <h3 className="section-title" style={{fontSize:'0.9rem', color:'#666', letterSpacing:'0.5px'}}>DETAIL LOKASI</h3>
          <span className="badge-status">{selectedItem ? selectedItem.status : 'Belum Diambil'}</span>
        </div>

        {selectedItem ? (
          <>
            <div className="detail-school-info" style={{display:'flex', gap:'12px', marginBottom:'20px'}}>
              <img src={selectedItem.image_path ? `https://a5a1-182-8-68-206.ngrok-free.app/${selectedItem.image_path}` : bentoImg} alt={selectedItem.lokasi} style={{width:'60px', height:'60px', borderRadius:'8px', objectFit:'cover'}} />
              <div>
                <h4 style={{margin:'0 0 4px 0', fontSize:'1.1rem', color:'#111', textTransform:'capitalize'}}>{selectedItem.lokasi.split(',')[0]}</h4>
                <p style={{margin:0, fontSize:'0.85rem', color:'#666'}}>{selectedItem.lokasi}</p>
              </div>
            </div>

            <div className="detail-stats-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px'}}>
              <div style={{border:'1px solid #eee', padding:'12px', borderRadius:'8px'}}>
                <div style={{fontSize:'0.75rem', color:'#888', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Waktu
                </div>
                <div style={{fontWeight:'700', color:'#111'}}>{selectedItem.waktu_input || '-'}</div>
              </div>
              <div style={{border:'1px solid #eee', padding:'12px', borderRadius:'8px'}}>
                <div style={{fontSize:'0.75rem', color:'#888', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Berat
                </div>
                <div style={{fontWeight:'700', color:'#2e7d32'}}>{selectedItem.berat} Kg</div>
              </div>
            </div>

            {selectedItem.status === 'Diambil' && routes.find(r => r.itemId === selectedItem.id) && (() => {
              const routeInfo = routes.find(r => r.itemId === selectedItem.id);
              const distanceKm = (routeInfo.distance / 1000).toFixed(1);
              const durationMin = Math.ceil(routeInfo.duration / 60);
              
              return (
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px', backgroundColor:'#fff3e0', padding:'12px', borderRadius:'8px', border:'1px solid #ffe0b2'}}>
                  <div>
                    <div style={{fontSize:'0.75rem', color:'#e65100', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px', fontWeight:'600'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                      Jarak Tempuh
                    </div>
                    <div style={{fontWeight:'700', color:'#e65100'}}>{distanceKm} Km</div>
                  </div>
                  <div>
                    <div style={{fontSize:'0.75rem', color:'#e65100', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px', fontWeight:'600'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Estimasi Waktu
                    </div>
                    <div style={{fontWeight:'700', color:'#e65100'}}>{durationMin} Menit</div>
                  </div>
                </div>
              );
            })()}

            <div className="detail-section-block" style={{marginBottom:'20px'}}>
              <div style={{fontSize:'0.75rem', color:'#888', letterSpacing:'0.5px', marginBottom:'8px'}}>JENIS SISA MAKANAN</div>
              <div style={{display:'flex', flexWrap: 'wrap', gap:'8px'}}>
                {selectedItem.jenis_makanan.split(',').map((jenis, idx) => (
                  <span key={idx} style={{padding:'4px 12px', backgroundColor:'#e8f5e9', color:'#2e7d32', borderRadius:'4px', fontSize:'0.8rem', fontWeight:'600', textTransform:'capitalize'}}>
                    {jenis.trim()}
                  </span>
                ))}
              </div>
            </div>

            {selectedItem.keterangan && (
              <div className="detail-section-block" style={{marginBottom:'24px'}}>
                <div style={{fontSize:'0.75rem', color:'#888', letterSpacing:'0.5px', marginBottom:'8px'}}>CATATAN DARI SEKOLAH/SPPG</div>
                <div style={{backgroundColor:'#f5f5f5', border:'1px dashed #ccc', padding:'12px', borderRadius:'8px', fontSize:'0.85rem', color:'#666', fontStyle:'italic'}}>
                  "{selectedItem.keterangan}"
                </div>
              </div>
            )}

            {selectedItem.status === 'Belum Diambil' && (
              <button onClick={() => handleAmbil(selectedItem.id)} className="btn-ambil-sekarang" style={{width:'100%', padding:'14px', backgroundColor:'#1a5d2c', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', fontSize:'1rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                Ambil Sekarang
              </button>
            )}
            {selectedItem.status === 'Diambil' && (
              <button onClick={() => handleSelesai(selectedItem.id)} className="btn-ambil-sekarang" style={{width:'100%', padding:'14px', backgroundColor:'#1976d2', color:'white', border:'none', borderRadius:'8px', fontWeight:'600', fontSize:'1rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Selesaikan Penjemputan
              </button>
            )}
            {selectedItem.status === 'Selesai' && (
              <button disabled className="btn-ambil-sekarang" style={{width:'100%', padding:'14px', backgroundColor:'#e8f5e9', color:'#2e7d32', border:'1px solid #c8e6c9', borderRadius:'8px', fontWeight:'600', fontSize:'1rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'not-allowed'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Selesai Diambil
              </button>
            )}
          </>
        ) : (
          <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
            Belum ada sisa makanan yang dipilih atau tersedia.
          </div>
        )}
      </div>
    </div>
  );
};

export default FWMitraMap;
