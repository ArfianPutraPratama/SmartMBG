import React, { useState, useEffect } from 'react';

const UploadForm = () => {
  const [jenisMakanan, setJenisMakanan] = useState('');
  const [berat, setBerat] = useState('');
  const [waktuInput, setWaktuInput] = useState('');
  const [lokasi, setLokasi] = useState('SDN Ketintang 1, Jl. Ketintang Baru I No. 1, Surabaya');
  const [keterangan, setKeterangan] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update time automatically
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setWaktuInput(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2 MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jenisMakanan || !berat || !waktuInput || !lokasi) {
      alert("Harap lengkapi semua field yang wajib");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('jenis_makanan', jenisMakanan);
    formData.append('berat', berat);
    formData.append('waktu_input', waktuInput);
    formData.append('lokasi', lokasi);
    formData.append('keterangan', keterangan);
    formData.append('lat', '-7.3110'); // Hardcoded lat for SDN Ketintang 1
    formData.append('lng', '112.7300'); // Hardcoded lng for SDN Ketintang 1
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:8000/api/sppg/food-wastes', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setShowSuccess(true);
        setJenisMakanan('');
        setBerat('');
        setWaktuInput('10:30');
        setKeterangan('');
        setImageFile(null);
        setImagePreview(null);
        
        // Wait 2 seconds then reload
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert("Terjadi kesalahan saat menyimpan data");
      }
    } catch (error) {
      console.error(error);
      alert("Koneksi error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Custom Success Modal */}
      {showSuccess && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeIn 0.3s ease'}}>
          <div style={{backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '300px', animation: 'slideUp 0.4s ease'}}>
            <div style={{width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto'}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style={{margin: '0 0 8px 0', color: '#111', fontSize: '1.2rem'}}>Berhasil!</h3>
            <p style={{margin: 0, color: '#666', fontSize: '0.9rem'}}>Data Sisa Makanan berhasil disimpan.</p>
          </div>
        </div>
      )}

      <div className="card-box" style={{marginBottom: '20px'}}>
      <div className="upload-header" style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px'}}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="12" y2="12"/><line x1="15" y1="15" x2="12" y2="12"/></svg>
        <h3 style={{margin:0, fontSize:'1.1rem', color:'#2e7d32'}}>Upload Sisa Makanan</h3>
      </div>

      <div className="upload-dropzone" onClick={() => document.getElementById('file-upload').click()} style={{border:'2px dashed #ccc', borderRadius:'8px', padding:'30px', textAlign:'center', marginBottom:'20px', cursor:'pointer', backgroundColor:'#fafafa'}}>
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" style={{maxHeight:'150px', objectFit:'contain', marginBottom:'10px'}} />
        ) : (
          <>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{marginBottom:'10px'}}><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>
            <div style={{fontWeight:'600', color:'#333', fontSize:'0.95rem'}}>Klik untuk upload foto</div>
            <div style={{fontSize:'0.75rem', color:'#aaa'}}>PNG/JPG MAX 2 MB</div>
          </>
        )}
        <input id="file-upload" type="file" accept="image/png, image/jpeg" style={{display:'none'}} onChange={handleImageChange} />
      </div>

      <div className="form-group" style={{marginBottom:'16px'}}>
        <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#555'}}>Jenis Makanan Sisa</label>
        <input type="text" value={jenisMakanan} onChange={e => setJenisMakanan(e.target.value)} placeholder="Contoh: Nasi, Ayam, Sayur, Buah, dll" className="form-control" style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'6px', outline:'none'}} />
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
        <div className="form-group">
          <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#555'}}>Perkiraan Berat</label>
          <div style={{position:'relative'}}>
            <input type="number" value={berat} onChange={e => setBerat(e.target.value)} placeholder="Masukkan berat" className="form-control" style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'6px', outline:'none'}} />
            <span style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#888', fontSize:'0.9rem', fontWeight:'600'}}>KG</span>
          </div>
        </div>
        <div className="form-group">
          <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#555'}}>Waktu Input</label>
          <div style={{position:'relative'}}>
            <input type="text" value={waktuInput} readOnly className="form-control" style={{width:'100%', padding:'10px 12px', border:'1px solid #eee', borderRadius:'6px', outline:'none', backgroundColor:'#f9f9f9', color:'#666', cursor:'not-allowed', fontWeight:'600'}} />
            <div style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#aaa', pointerEvents:'none'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group" style={{marginBottom:'16px'}}>
        <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#555'}}>Lokasi Sisa Makanan</label>
        <div style={{position:'relative'}}>
          <div style={{position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#888'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <select value={lokasi} onChange={e => setLokasi(e.target.value)} className="form-control" style={{width:'100%', padding:'10px 12px 10px 36px', border:'1px solid #ddd', borderRadius:'6px', outline:'none', appearance:'none', backgroundColor:'white', cursor:'pointer'}}>
            <option value="SDN Ketintang 1, Jl. Ketintang Baru I No. 1, Surabaya">SDN Ketintang 1, Jl. Ketintang Baru I No. 1, Surabaya</option>
          </select>
          <div style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', color:'#888', pointerEvents:'none'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      <div className="form-group" style={{marginBottom:'24px'}}>
        <label style={{display:'block', marginBottom:'8px', fontSize:'0.9rem', color:'#555'}}>Keterangan (opsional)</label>
        <textarea value={keterangan} onChange={e => setKeterangan(e.target.value)} rows="3" placeholder="Tambahkan keterangan jika ada..." className="form-control" style={{width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'6px', outline:'none', resize:'none'}}></textarea>
      </div>

      <button onClick={handleSubmit} disabled={isSubmitting} className="btn-simpan" style={{width:'100%', padding:'12px', backgroundColor:'#1a5d2c', color:'white', border:'none', borderRadius:'6px', fontWeight:'600', fontSize:'1rem', cursor:'pointer', opacity: isSubmitting ? 0.7 : 1, transition:'0.2s'}}>
        {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
      </button>
    </div>
    </>
  );
};

export default UploadForm;
