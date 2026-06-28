import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const sdgs = [
  { id: 2, image: '/image 11.png' },
  { id: 3, image: '/image 12 (1).png' },
  { id: 4, image: '/image 13 (1).png' },
  { id: 12, image: '/image 14.png' },
  { id: 17, image: '/image 15.png' }
];

const SDGsCTASection = ({ onNavigate }) => {
  return (
    <>
      <section style={{ paddingTop: '100px', paddingBottom: '80px', backgroundColor: '#f9fafb', overflow: 'hidden', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px', padding: '0 5%' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Mendukung Sustainable Development Goals (SDGs)
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            Kontribusi nyata SmartMBG terhadap target pembangunan global.
          </p>
        </div>

        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .marquee-container {
              overflow: hidden;
              white-space: nowrap;
              width: 100%;
              position: relative;
              padding: 20px 0;
            }
            .marquee-content {
              display: flex;
              width: max-content;
              /* Durasi diubah jadi 150s agar kecepatan tetap lambat karena jumlah item diperbanyak */
              animation: marqueeRight 150s linear infinite; 
            }
          `}
        </style>

        <div className="marquee-container">
          <div className="marquee-content">
            {/* Render berulang kali agar tidak ada ruang kosong di layar lebar */}
            {[...Array(10)].fill(sdgs).flat().map((sdg, index) => (
              <div 
                key={`${sdg.id}-${index}`}
                style={{
                  width: '180px', 
                  height: '180px',
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease',
                  marginRight: '24px',
                  flexShrink: 0,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={sdg.image} 
                  alt={`SDG ${sdg.id}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark cta-section" style={{ background: '#1a5632', padding: '80px 20px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '700' }}>Siap Mewujudkan Generasi Emas 2045?</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 32px', color: '#dcfce7', fontSize: '1.1rem' }}>
            Akses platform SmartMBG untuk mulai mengelola nutrisi dan sisa pangan sekolah Anda sekarang.
          </p>
          <button 
            onClick={onNavigate}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: '#ffffff', 
              color: '#1a5632', 
              border: 'none', 
              padding: '14px 32px', 
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            Masuk Sekarang 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          </button>
        </motion.div>
      </section>
    </>
  );
};

export default SDGsCTASection;
