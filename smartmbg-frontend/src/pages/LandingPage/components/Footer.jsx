import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#e5e7eb', padding: '60px 5%', borderTop: '4px solid #1a5632' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ margin: 0, color: '#111827', fontSize: '1.5rem', fontWeight: '800' }}>SmartMBG</h2>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, maxWidth: '350px' }}>
            Platform sistem nutrisi sekolah berkelanjutan pertama di Indonesia yang mengintegrasikan AI dan ekonomi sirkular.
          </p>
        </div>
        
        {/* Middle Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, color: '#111827', fontSize: '1rem', fontWeight: '700', letterSpacing: '1px' }}>TAUTAN NAVIGASI</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>Beranda</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>Visi & Misi</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>WebGIS Monitoring</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.95rem' }}>Pusat Bantuan</a>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, color: '#111827', fontSize: '1rem', fontWeight: '700', letterSpacing: '1px' }}>LEGALITAS</h4>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.95rem' }}>Kebijakan Privasi</a>
            <a href="#" style={{ color: '#16a34a', textDecoration: 'none', fontSize: '0.95rem' }}>Syarat & Ketentuan</a>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 4px 0' }}>
              &copy; 2024 SmartMBG. All Rights Reserved.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
              Sustainable School Nutrition Systems.
            </p>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
