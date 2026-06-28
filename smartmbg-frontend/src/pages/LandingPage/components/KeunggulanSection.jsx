import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Map, LayoutDashboard } from 'lucide-react';

const features = [
  {
    title: 'AI Nutrition Analysis',
    desc: 'Algoritma cerdas yang menghitung kalori dan persentase makanan sisa secara otomatis hanya dari jepretan kamera.',
    icon: <BrainCircuit size={32} />
  },
  {
    title: 'Real-time WebGIS',
    desc: 'Pemetaan interaktif untuk melacak sisa makanan di semua sekolah, menghubungkan sekolah dengan mitra pengelola terdekat.',
    icon: <Map size={32} />
  },
  {
    title: 'Integrated Logbook',
    desc: 'Mencatat riwayat kepuasan gizi anak, ulasan SPPG, hingga riwayat daur ulang sisa dalam satu dashboard terpusat.',
    icon: <LayoutDashboard size={32} />
  }
];

const KeunggulanSection = () => {
  return (
    <section className="section section-dark" id="keunggulan">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '50px', width: '100%' }}>
        <h2 className="section-title" style={{ textAlign: 'center', margin: '0 0 16px 0' }}>Keunggulan Platform SmartMBG</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>Membawa transparansi dan efisiensi dalam setiap langkah manajemen gizi sekolah.</p>
      </div>

      <div className="cards-grid">
        {features.map((feature, index) => (
          <motion.div 
            key={feature.title}
            className="feature-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 style={{ color: '#1a5632' }}>{feature.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default KeunggulanSection;
