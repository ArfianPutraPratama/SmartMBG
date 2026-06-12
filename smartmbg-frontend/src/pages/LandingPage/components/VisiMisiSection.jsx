import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

const VisiMisiSection = () => {
  return (
    <section className="section section-dark" id="visi-misi">
      <div className="visi-misi-content">
        <motion.div 
          className="visi-misi-text"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Visi & Misi SmartMBG</h2>
          
          <p style={{ marginBottom: '20px' }}>
            SmartMBG adalah pelopor sistem nutrisi sekolah berkelanjutan di Indonesia yang 
            mengintegrasikan teknologi <strong>Kecerdasan Buatan (AI)</strong> dengan prinsip 
            <strong> Ekonomi Sirkular</strong>.
          </p>
          
          <p style={{ marginBottom: '40px' }}>
            Kami percaya bahwa gizi yang baik adalah fondasi dari pendidikan yang 
            berkualitas. Dengan mengoptimalkan rantai pasok dari petani lokal hingga 
            pengolahan limbah menjadi energi atau pakan, kami menciptakan ekosistem 
            yang tidak hanya memberi makan, tapi juga memberdayakan komunitas dan 
            menjaga lingkungan.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Card 1 */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', textAlign: 'left', color: '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '12px' }}>
                <BrainCircuit size={32} color="#1a5632" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827', fontWeight: '600' }}>Optimasi AI</h3>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4' }}>Analisis nutrisi presisi untuk setiap siswa.</p>
            </div>

            {/* Card 2 */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', textAlign: 'left', color: '#111827', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <h3 style={{ 
                  fontFamily: '"Inter", sans-serif', 
                  fontWeight: 300, 
                  color: '#1a5632', 
                  letterSpacing: '3px', 
                  margin: 0, 
                  fontSize: '1.4rem' 
                }}>
                  RECLAIM
                </h3>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#111827', fontWeight: '600' }}>Zero Waste</h3>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.4' }}>Pengelolaan sisa pangan 100% bermanfaat.</p>
            </div>

          </div>
        </motion.div>

        <motion.div 
          className="visi-misi-image"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img src="/mockup_laptop.png" alt="Platform SmartMBG Mockup" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
        </motion.div>
      </div>
    </section>
  );
};

export default VisiMisiSection;
