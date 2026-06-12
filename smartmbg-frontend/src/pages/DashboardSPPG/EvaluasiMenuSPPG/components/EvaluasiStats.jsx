import React from 'react';

const EvaluasiStats = ({ reviews = [] }) => {
  const totalReviews = reviews.length;
  let averageRating = 0;
  let count5 = 0;
  let count4 = 0;
  let count3orLess = 0;

  if (totalReviews > 0) {
    const totalScore = reviews.reduce((sum, r) => sum + r.rating, 0);
    averageRating = (totalScore / totalReviews).toFixed(1);

    reviews.forEach(r => {
      if (r.rating === 5) count5++;
      else if (r.rating === 4) count4++;
      else count3orLess++;
    });
  }

  return (
    <div className="eval-stats-row" style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px', marginBottom:'24px'}}>
      
      <div className="eval-stat-card card-box" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:'0.9rem', color:'#666', marginBottom:'8px'}}>Rata-rata Rating</div>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <div style={{fontSize:'2.2rem', fontWeight:'700', color:'#2e7d32'}}>{averageRating}</div>
          <div style={{color:'#2e7d32', display:'flex'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>
      </div>

      <div className="eval-stat-card card-box" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:'0.9rem', color:'#666', marginBottom:'8px'}}>Ulasan 5<span style={{fontSize:'1rem'}}>★</span></div>
        <div style={{fontSize:'2.2rem', fontWeight:'700', color:'#111'}}>{count5}</div>
      </div>

      <div className="eval-stat-card card-box" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:'0.9rem', color:'#666', marginBottom:'8px'}}>Ulasan 4<span style={{fontSize:'1rem'}}>★</span></div>
        <div style={{fontSize:'2.2rem', fontWeight:'700', color:'#111'}}>{count4}</div>
      </div>

      <div className="eval-stat-card card-box" style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:'0.9rem', color:'#666', marginBottom:'8px'}}>Ulasan &le; 3<span style={{fontSize:'1rem'}}>★</span></div>
        <div style={{fontSize:'2.2rem', fontWeight:'700', color:'#d32f2f'}}>{count3orLess}</div>
      </div>

    </div>
  );
};

export default EvaluasiStats;
