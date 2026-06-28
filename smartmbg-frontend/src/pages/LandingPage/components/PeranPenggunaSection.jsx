import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const roles = [
  {
    title: 'Sekolah',
    image: '/image 19.png',
    features: [
      'Analisis kandungan gizi harian.',
      'Evaluasi makanan dari SPPG.',
      'Input dan monitoring sisa makanan.'
    ]
  },
  {
    title: 'SPPG',
    image: '/image 20.png',
    features: [
      'Monitoring produksi dan distribusi.',
      'Melihat evaluasi sekolah.',
      'Monitoring laporan sekolah.'
    ]
  },
  {
    title: 'Mitra Pengelola Limbah',
    image: '/image 21.png',
    features: [
      'Melihat laporan sisa makanan.',
      'Pengambilan sisa makanan.',
      'Pelaporan hasil pengolahan.'
    ]
  }
];

const PeranPenggunaSection = () => {
  return (
    <section className="section" style={{ backgroundColor: '#ffffff', padding: '100px 5%' }} id="cara-kerja">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.5px' }}>Peran Pengguna</h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '24px' }}>
            Kolaborasi lintas sektor untuk ekosistem gizi yang berkelanjutan.
          </p>
          <div style={{ width: '48px', height: '3px', backgroundColor: '#1a5632', margin: '0 auto', borderRadius: '4px' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {roles.map((role, index) => (
            <motion.div 
              key={index}
              className="role-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                backgroundColor: '#f0fdf4', /* Sangat soft green, lebih minimalis */
                border: '1px solid #1a5632', /* Border lebih tipis & elegan */
                borderRadius: '24px', /* Sudut lebih membulat */
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ height: '240px', overflow: 'hidden', borderBottom: '1px solid #1a5632' }}>
                <img 
                  src={role.image} 
                  alt={role.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '24px', fontWeight: '700' }}>
                  {role.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {role.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                      <CheckCircle2 size={18} color="#1a5632" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeranPenggunaSection;
