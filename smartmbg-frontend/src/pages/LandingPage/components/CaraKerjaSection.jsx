import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, GraduationCap, BrainCircuit, Star, ClipboardList, Recycle, Leaf, RefreshCw } from 'lucide-react';

const steps = [
  { icon: <Package size={28} />, title: 'SPPG', desc: 'Produksi makanan bergizi dengan standar kebersihan tinggi.' },
  { icon: <Truck size={28} />, title: 'Distribusi', desc: 'Makanan dikirim ke sekolah menggunakan armada terpantau GPS.' },
  { icon: <GraduationCap size={28} />, title: 'Sekolah', desc: 'Menerima makanan untuk siswa dengan verifikasi kedatangan.' },
  { icon: <BrainCircuit size={28} />, title: 'Analisis AI', desc: 'Analisis gizi makanan berbasis AI untuk memastikan kualitas nutrisi.' },
  { icon: <Star size={28} />, title: 'Evaluasi', desc: 'Sekolah memberikan evaluasi makanan sebagai masukan bagi SPPG.' },
  { icon: <ClipboardList size={28} />, title: 'Input Sisa', desc: 'Sekolah menginput data sisa makanan untuk manajemen limbah.' },
  { icon: <Recycle size={28} />, title: 'Mitra', desc: 'Mitra mengambil dan mengelola limbah pangan dari sekolah.' },
  { icon: <Leaf size={28} />, title: 'Maggot/Kompos', desc: 'Limbah diolah menjadi maggot atau kompos bernilai guna.' },
  { icon: <RefreshCw size={28} />, title: 'Ekonomi Sirkular', desc: 'Mengurangi limbah dan menciptakan nilai ekonomi baru.' }
];

const CaraKerjaSection = () => {
  return (
    <section className="section" style={{ backgroundColor: '#ffffff', padding: '100px 5%' }} id="cara-kerja">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>Cara Kerja SmartMBG</h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Alur sederhana dengan dampak luar biasa untuk mengentaskan pemborosan makanan.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '24px' 
        }}>
          {steps.map((step, index) => (
            <motion.div 
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                padding: '40px 24px 32px',
                position: 'relative',
                textAlign: 'center',
                border: '1px solid #f3f4f6',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
              }}
            >
              {/* Number Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: '#1a5632',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>

              {/* Icon Container */}
              <div style={{
                backgroundColor: '#e6f4ea',
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: '#1a5632'
              }}>
                {step.icon}
              </div>

              <h4 style={{ color: '#111827', fontSize: '1.25rem', marginBottom: '12px', fontWeight: '600' }}>{step.title}</h4>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaraKerjaSection;
