import React, { useState, useEffect } from 'react';

const MitraInfo = () => {
  const [mitras, setMitras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMitras = async () => {
      try {
        const response = await fetch('https://smart-mbg-coral.vercel.app/api/mitras');
        if (response.ok) {
          const data = await response.json();
          setMitras(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data mitra:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMitras();
  }, []);

  const formatWhatsAppNumber = (phone) => {
    if (!phone) return '';
    // Hapus karakter non-digit
    let cleaned = phone.replace(/\D/g, '');
    // Jika diawali dengan 0, ganti dengan 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <div className="card-box">
      <div className="upload-sisa-section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px'}}>
        <div>
          <h3 style={{margin:'0 0 4px 0', fontSize:'1.05rem', color:'#111'}}>Informasi Mitra Pengambil</h3>
          <p style={{margin:0, fontSize:'0.8rem', color:'#888'}}>Mitra pakan maggot / pupuk kompos di wilayah Anda</p>
        </div>
        <a href="#" style={{color:'#2e7d32', textDecoration:'none', fontSize:'0.85rem', fontWeight:'600'}}>Lihat Semua</a>
      </div>

      <div className="mitra-list" style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {loading ? (
          <div style={{textAlign:'center', padding:'20px', color:'#888'}}>Memuat data mitra...</div>
        ) : mitras.length === 0 ? (
          <div style={{textAlign:'center', padding:'20px', color:'#888'}}>Belum ada data mitra yang terdaftar.</div>
        ) : (
          mitras.map((mitra, index) => {
            const waNumber = formatWhatsAppNumber(mitra.phone);
            const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

            return (
              <div key={mitra.id || index} className="mitra-card" style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px', border:'1px solid #eee', borderRadius:'8px'}}>
                <div className="mitra-icon" style={{width:'40px', height:'40px', borderRadius:'50%', backgroundColor:'#e8f5e9', color:'#2e7d32', display:'flex', justifyContent:'center', alignItems:'center', flexShrink:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                </div>
                <div style={{flexGrow:1}}>
                  <h4 style={{margin:'0 0 4px 0', fontSize:'0.95rem', color:'#111'}}>{mitra.name}</h4>
                  <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <span style={{backgroundColor:'#e8f5e9', color:'#2e7d32', padding:'2px 8px', borderRadius:'12px', fontSize:'0.7rem', fontWeight:'600'}}>Aktif</span>
                    <span style={{fontSize:'0.75rem', color:'#888'}}>{mitra.address || 'Alamat belum diatur'}</span>
                  </div>
                </div>
                <a 
                  href={waLink} 
                  target={waNumber ? "_blank" : "_self"} 
                  rel="noopener noreferrer" 
                  onClick={(e) => {
                    if (!waNumber) {
                      e.preventDefault();
                      alert("Mitra ini belum mencantumkan nomor WhatsApp yang valid.");
                    }
                  }}
                  style={{padding:'6px 16px', backgroundColor:'white', border:'1px solid #ddd', borderRadius:'6px', fontSize:'0.85rem', color:'#333', fontWeight:'600', cursor:'pointer', textDecoration:'none', display:'inline-block'}}
                >
                  Hubungi
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MitraInfo;
