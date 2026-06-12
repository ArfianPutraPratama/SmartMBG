import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, ShieldCheck, Activity } from 'lucide-react';

const HeroSection = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('#');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="hero-nav" style={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <h2 style={{ color: '#1a5632', margin: 0, fontWeight: '700', fontSize: '1.5rem' }}>SmartMBG</h2>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <a href="#" className={activeTab === '#' ? 'active' : ''} onClick={() => setActiveTab('#')}>Home</a>
          <a href="#visi-misi" className={activeTab === '#visi-misi' ? 'active' : ''} onClick={() => setActiveTab('#visi-misi')}>Tentang Kami</a>
          <a href="#keunggulan" className={activeTab === '#keunggulan' ? 'active' : ''} onClick={() => setActiveTab('#keunggulan')}>Keunggulan</a>
          <a href="#cara-kerja" className={activeTab === '#cara-kerja' ? 'active' : ''} onClick={() => setActiveTab('#cara-kerja')}>Cara Kerja</a>
          <a href="#webgis" className={activeTab === '#webgis' ? 'active' : ''} onClick={() => setActiveTab('#webgis')}>WebGIS</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
          <button className="btn-primary" onClick={onNavigate} style={{ padding: '8px 24px', fontSize: '0.95rem', borderRadius: '6px', whiteSpace: 'nowrap', width: 'fit-content' }}>Login</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content" style={{ paddingLeft: '5%' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              <ShieldCheck size={16} /> SMART MONITORING PLATFORM
            </div>
            <h1>SmartMBG</h1>
            <h2>
              Monitoring Makanan Bergizi Gratis <br/>Berbasis AI dan WebGIS
            </h2>
            <p>
              Platform terintegrasi untuk monitoring Program Makan Bergizi Gratis (MBG), 
              analisis kandungan gizi makanan, evaluasi layanan, dan pengelolaan sisa 
              makanan berbasis ekonomi sirkular.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onNavigate}>
                Masuk Ke Platform <ArrowRight size={20} />
              </button>
              <button className="btn-outline" onClick={() => document.getElementById('webgis').scrollIntoView({ behavior: 'smooth' })}>
                Lihat Demo <PlayCircle size={20} />
              </button>
            </div>
          </motion.div>
        </div>
        <div className="hero-image" style={{ paddingRight: '5%' }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-mockup-window">
              <div className="mockup-dot"></div>
              <img src="/hero_illustration.png" alt="Anak-anak makan sehat" />
              
              <motion.div 
                className="floating-stat"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Total Kalori Terpantau</p>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#1a5632', fontSize: '1.2rem' }}>2.4jt+ kkal</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
