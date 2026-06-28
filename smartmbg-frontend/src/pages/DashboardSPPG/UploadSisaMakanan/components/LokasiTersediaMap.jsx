import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';

const createCustomIcon = (statusColor) => {
  let fill = "#ffeb3b"; // Default yellow
  if (statusColor === "green") fill = "#2e7d32";
  else if (statusColor === "orange") fill = "#ca863a"; // Matches the warm brownish orange from Image 2

  // Create an SVG string that looks like a teardrop pin with a white dot inside
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 24 16 24s16-13.333 16-24C32 7.163 24.837 0 16 0z" fill="${fill}" />
      <circle cx="16" cy="14" r="6" fill="#ffffff" />
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgIcon,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

const LokasiTersediaMap = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Focus the map on Surabaya
  const surabayaPosition = [-7.3110, 112.7300];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('https://smartmbg-backend-git-main-fians-projects-ae029f5d.vercel.app/api/sppg/food-wastes');
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-box" style={{marginBottom: '20px', display: 'flex', flexDirection: 'column'}}>
      <div className="map-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
        <div>
          <h3 style={{margin:'0 0 4px 0', fontSize:'1.05rem', color:'#111'}}>Lokasi Sisa Makanan Tersedia</h3>
          <p style={{margin:0, fontSize:'0.8rem', color:'#888'}}>Mitra dapat melihat lokasi dan mengambil sisa makanan</p>
        </div>
      </div>

      <div style={{flexGrow:1, minHeight:'200px', borderRadius:'12px', overflow:'hidden', position:'relative', marginBottom:'16px', zIndex: 1}}>
        <MapContainer 
          center={surabayaPosition} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <MarkerClusterGroup chunkedLoading maxClusterRadius={50}>
            {historyData.filter(item => item.status !== 'Selesai').map((item, index) => {
              // Jika data lat lng ada dari database, gunakan. Kalau tidak, pakai default dengan sedikit offset
              const latOffset = (index % 5) * 0.0015 - 0.003;
              const lngOffset = Math.floor(index / 5) * 0.0015 - 0.001;
              const lat = item.lat ? parseFloat(item.lat) : -7.3110 + latOffset;
              const lng = item.lng ? parseFloat(item.lng) : 112.7300 + lngOffset;
              const position = [lat, lng];

              return (
                <Marker key={item.id} position={position} icon={createCustomIcon("orange")}>
                  <Popup>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'0.7rem', fontWeight:'700', color:'#333'}}>{item.lokasi}</div>
                      <div style={{fontSize:'0.8rem', fontWeight:'700', color:'#1a5d2c'}}>{item.berat} KG</div>
                      <div style={{fontSize:'0.65rem', color:'#666'}}>Waktu Input: {item.waktu_input || '-'}</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default LokasiTersediaMap;
