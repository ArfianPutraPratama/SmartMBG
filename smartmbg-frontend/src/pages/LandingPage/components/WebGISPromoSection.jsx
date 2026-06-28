import React from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RotateCw } from 'lucide-react';

// Fix for default leaflet icons not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom orange marker to match the image
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const WebGISPromoSection = () => {
  return (
    <section style={{ background: '#1a5632', display: 'flex', alignItems: 'stretch', minHeight: '600px', overflow: 'hidden' }} id="webgis">
      <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
        <motion.div 
          style={{ flex: 1, minWidth: '400px', padding: '100px 5% 100px 10%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>Monitoring WebGIS Real-Time</h2>
          <p style={{ marginBottom: '40px', color: '#ffffff', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Pantau kolaborasi antara SPPG, Sekolah, dan Mitra Pengolah Limbah di seluruh wilayah jangkauan kami secara visual.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Legenda Entitas Card */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <h4 style={{ color: '#111827', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>LEGENDA ENTITAS</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#1a5632', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>Sekolah</h5>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Penerima Manfaat MBG</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#f97316', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>SPPG</h5>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Pusat Produksi & Dapur</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: '#1a5632', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15.3 2.3 11 7 6.7"/><path d="M11 20.7V11a9 9 0 0 1 9-9"/><path d="M17 8.7 21.7 13 17 17.3"/><path d="M13 3.3v9.7a9 9 0 0 1-9 9"/></svg>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>Mitra</h5>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Pengolah Sisa Pangan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Terkini Card */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: '#1a5632', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div>
                <h5 style={{ margin: 0, color: '#111827', fontSize: '1.1rem', fontWeight: '600' }}>Data Terkini</h5>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Pembaruan otomatis setiap 5 menit</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          style={{ flex: 1, minWidth: '400px', position: 'relative', minHeight: '600px', display: 'flex' }}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Full Interactive Map Container */}
          <div style={{ flex: 1, position: 'relative', zIndex: 0, borderRadius: '0', overflow: 'hidden' }}>
            <MapContainer 
              center={[-7.3000, 112.7400]} 
              zoom={14} 
              style={{ width: '100%', height: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[-7.2950, 112.7350]} icon={customIcon}>
                <Popup>
                  <strong>SDN Gunung Sari 1</strong><br />
                  Sisa Makanan: 5.2 kg
                </Popup>
              </Marker>
              <Marker position={[-7.3050, 112.7450]} icon={customIcon}>
                <Popup>
                  <strong>SMPN 39 Surabaya</strong><br />
                  Sisa Makanan: 12.5 kg
                </Popup>
              </Marker>
            </MapContainer>

            {/* Floating Pill */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              background: '#e6f4ea', 
              padding: '12px 24px', 
              borderRadius: '50px', 
              zIndex: 1000, 
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)', 
              whiteSpace: 'nowrap' 
            }}>
              <span style={{ color: '#1a5632', fontWeight: '700', fontSize: '1rem' }}>Peta Interaktif Kolaborasi Wilayah</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WebGISPromoSection;
