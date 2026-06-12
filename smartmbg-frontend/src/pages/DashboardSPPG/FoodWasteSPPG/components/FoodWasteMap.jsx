import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issue in React (Vite compatible)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const createCustomIcon = (statusColor) => {
  let fill = "#ffeb3b"; // Default yellow
  if (statusColor === "green") fill = "#2e7d32";
  else if (statusColor === "orange") fill = "#ed6c02";

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
    iconAnchor: [16, 40], // Anchor at the bottom tip
    popupAnchor: [0, -40], // Popup opens above the marker
  });
};

const FoodWasteMap = ({ entities }) => {
  // Center of Surabaya
  const surabayaPosition = [-7.275443, 112.630282];

  return (
    <div className="fw-map-container">
      {/* Map Side */}
      <div className="fw-map-wrapper" style={{ zIndex: 1 }}>
        <MapContainer 
          center={surabayaPosition} 
          zoom={13} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', minHeight: '400px', borderRadius: '12px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
          >
            {entities && entities.map((ent, idx) => {
              // Check if lat and lng exist and are numbers before placing marker
              if (ent.lat && ent.lng) {
                return (
                  <Marker 
                    key={ent.id || idx} 
                    position={[ent.lat, ent.lng]}
                    icon={createCustomIcon(ent.statusColor)}
                  >
                    <Popup>
                      <strong>{ent.nama}</strong><br />
                      Status: {ent.statusMBG}<br />
                      Alamat: {ent.alamat}
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Info Panel */}
      <div className="fw-info-panel">
        <h3 className="fw-info-title">Informasi Lokasi</h3>
        
        <h4 className="fw-info-school">SDN Ketintang 1</h4>
        
        <div className="fw-info-grid">
          <div className="fw-info-label">Status</div>
          <div className="fw-info-val green">Sudah menerima MBG</div>
          
          <div className="fw-info-label">Jumlah Porsi</div>
          <div className="fw-info-val">500</div>
          
          <div className="fw-info-label">Food Waste</div>
          <div className="fw-info-val red">2 Kg</div>
          
          <div className="fw-info-label">Jam Distribusi</div>
          <div className="fw-info-val">06:45 WIB</div>
          
          <div className="fw-info-label">Rating</div>
          <div className="fw-info-val">5 <span className="star-icon" style={{fontSize: '0.9rem'}}>★</span></div>
        </div>

        <div className="fw-info-menu">
          <div className="fw-info-label">Menu Hari Ini:</div>
          <p>Nasi, Ayam Kecap, Capcay, Jeruk</p>
        </div>

        <div className="fw-legend">
          <h4>LEGENDA</h4>
          <div className="fw-legend-item">
            <div className="fw-dot green"></div>
            Sudah menerima MBG
          </div>
          <div className="fw-legend-item">
            <div className="fw-dot yellow"></div>
            Belum menerima MBG
          </div>
          <div className="fw-legend-item">
            <div className="fw-dot orange"></div>
            Ada Food Waste
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodWasteMap;
