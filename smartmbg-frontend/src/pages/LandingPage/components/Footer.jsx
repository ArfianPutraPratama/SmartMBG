import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#ffffff', padding: '80px 5% 40px', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '60px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        
        {/* Left Column - Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfdf5', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#10b981">
                <path d="M17 8C17 8 17 14 12 18C7 14 7 8 7 8C7 8 12 2 17 8Z" />
              </svg>
            </div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>SmartMBG</h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, maxWidth: '320px' }}>
            Platform sistem nutrisi sekolah berkelanjutan pertama di Indonesia yang mengintegrasikan kecerdasan buatan dan ekonomi sirkular.
          </p>
        </div>
        
        {/* Middle Column - Navigasi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h4 style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Navigasi</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>Beranda</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>Visi & Misi</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>WebGIS Monitoring</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>Pusat Bantuan</a>
          </div>
        </div>

        {/* Right Column - Legal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h4 style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Legalitas</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>Kebijakan Privasi</a>
            <a href="#" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: 'color 0.2s' }}>Syarat & Ketentuan</a>
          </div>
        </div>
        
      </div>

      {/* Copyright Row */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingTop: '32px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
          &copy; 2024 SmartMBG. Hak Cipta Dilindungi.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>
          Sustainable School Nutrition Systems
        </p>
      </div>
    </footer>
  );
};

export default Footer;
