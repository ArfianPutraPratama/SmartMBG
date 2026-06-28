import React from 'react';
import saladImg from '../../../../assets/salad_bowl.png';
import bentoImg from '../../../../assets/bento_box.png';

const evaluasiData = [
  {
    id: 1,
    img: saladImg,
    date: '06 Juni 2026',
    status: 'Cocok',
    statusBg: '#a5d6a7',
    statusColor: '#1b5e20',
    school: 'SDN Ketintang 1',
    menuCol1: ['Nasi Putih', 'Ayam Kecap'],
    menuCol2: ['Sayur Capcay', 'Jeruk'],
    rating: 5.0,
    comment: 'Anak-anak sangat menyukai menu hari ini. Porsi cukup dan makanan habis dikonsumsi oleh seluruh siswa.'
  },
  {
    id: 2,
    img: bentoImg,
    date: '05 Juni 2026',
    status: 'Tidak Cocok',
    statusBg: '#ffcdd2',
    statusColor: '#b71c1c',
    school: 'SMPN 5 Surabaya',
    menuCol1: ['Nasi', 'Telur Dadar'],
    menuCol2: ['Bayam', 'Pisang'],
    rating: 3.0,
    comment: 'Sebagian siswa kurang menyukai sayur bayam karena rasa sedikit pahit. Masih banyak sisa makanan yang terbuang.'
  }
];

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? "#fbc02d" : "none"} stroke="#fbc02d" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }
  return stars;
};

const EvaluasiList = ({ reviews = [] }) => {
  return (
    <div className="eval-list-container" style={{display:'flex', flexDirection:'column', gap:'20px'}}>
      {reviews.length > 0 ? (
        reviews.map((item) => (
          <div key={item.id} className="eval-item card-box" style={{display:'flex', padding:0, overflow:'hidden', alignItems:'stretch'}}>
            
            <div className="eval-item-img" style={{width:'300px', flexShrink:0}}>
              <img 
                src={item.image ? `http://localhost:8000/storage/${item.image}` : saladImg} 
                alt={item.school_name} 
                style={{width:'100%', height:'100%', objectFit:'cover'}} 
              />
            </div>

            <div className="eval-item-content" style={{padding:'24px', flexGrow:1, display:'flex', flexDirection:'column'}}>
              
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                <div>
                  <div style={{fontSize:'0.85rem', color:'#666', marginBottom:'4px'}}>
                    {new Date(item.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}
                  </div>
                  <h3 style={{margin:0, fontSize:'1.1rem', color:'#111'}}>{item.school_name}</h3>
                </div>
                <div style={{
                  backgroundColor: item.is_match ? '#a5d6a7' : '#ffcdd2', 
                  color: item.is_match ? '#1b5e20' : '#b71c1c', 
                  padding:'4px 12px', borderRadius:'16px', fontSize:'0.75rem', fontWeight:'600'
                }}>
                  {item.is_match ? 'Cocok' : 'Tidak Cocok'}
                </div>
              </div>

              <div style={{marginBottom:'16px'}}>
                <div style={{fontSize:'0.85rem', color:'#666', marginBottom:'8px'}}>Menu (Estimasi):</div>
                <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'0.9rem', color:'#333', marginBottom:'4px'}}>
                  <div style={{width:'4px', height:'4px', borderRadius:'50%', backgroundColor: item.is_match ? '#2e7d32' : '#c62828'}}></div>
                  Menu yang disajikan
                </div>
              </div>

              <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
                <div style={{display:'flex', gap:'2px'}}>
                  {renderStars(item.rating)}
                </div>
                <div style={{fontSize:'0.95rem', fontWeight:'700', color:'#333'}}>{item.rating.toFixed(1)}</div>
              </div>

              <div style={{backgroundColor:'#fafafa', borderLeft:'3px solid #ddd', padding:'12px 16px', fontSize:'0.9rem', color:'#555', fontStyle:'italic', lineHeight:'1.5'}}>
                "{item.description || 'Tidak ada deskripsi tambahan.'}"
              </div>

            </div>
          </div>
        ))
      ) : (
        <div style={{textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0'}}>
          Belum ada ulasan yang ditambahkan dari pihak sekolah.
        </div>
      )}
    </div>
  );
};

export default EvaluasiList;
