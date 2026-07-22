import React, { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import './EvaluasiUlasan.css';
import '../DashboardGuru.css'; // Reuse layout styles
import SidebarGuru from '../components/SidebarGuru';
import saladImg from '../../../assets/salad_bowl.png';
import bentoImg from '../../../assets/bento_box.png';
import NgrokImage from '../../../components/NgrokImage/NgrokImage';

const EvaluasiUlasan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  
  // Form States
  const [rating, setRating] = useState(5);
  const [date, setDate] = useState('');
  const [isMatch, setIsMatch] = useState('cocok');
  const [description, setDescription] = useState('');
  const initialSchoolName = JSON.parse(localStorage.getItem('user'))?.name || '';
  const [schoolName, setSchoolName] = useState(initialSchoolName);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === 'date') {
      const dateDiff = new Date(b.date) - new Date(a.date);
      // Jika tanggalnya sama, urutkan berdasarkan ulasan yang paling baru dimasukkan (ID terbesar)
      return dateDiff === 0 ? b.id - a.id : dateDiff;
    } else if (sortOrder === 'highest') {
      const ratingDiff = b.rating - a.rating;
      // Jika ratingnya sama, tampilkan yang terbaru dulu
      return ratingDiff === 0 ? b.id - a.id : ratingDiff;
    } else if (sortOrder === 'lowest') {
      const ratingDiff = a.rating - b.rating;
      // Jika ratingnya sama, tampilkan yang terbaru dulu
      return ratingDiff === 0 ? b.id - a.id : ratingDiff;
    }
    return 0;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!date || !schoolName) {
      alert("Tanggal dan Nama Sekolah wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('date', date);
    formData.append('school_name', schoolName);
    formData.append('is_match', isMatch);
    if (description) formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    try {
      setIsLoading(true);
      await axios.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Ulasan berhasil ditambahkan!');
      setIsModalOpen(false);
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      let errorMessage = 'Gagal mengirim ulasan.';
      if (error.response?.data?.errors) {
        // Gabungkan semua pesan error validasi
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
      alert(`Gagal mengirim ulasan:\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRating(5);
    setDate('');
    setSchoolName(JSON.parse(localStorage.getItem('user'))?.name || '');
    setIsMatch('cocok');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
  };

  // Helper for displaying stars
  const renderStars = (score) => {
    const filled = '★'.repeat(score);
    const empty = '☆'.repeat(5 - score);
    return filled + empty;
  };

  // Helper to determine fallback image
  const getFallbackImage = (desc) => {
    const text = (desc || '').toLowerCase();
    if (text.includes('ayam')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=300&q=80';
    if (text.includes('ikan')) return 'https://images.unsplash.com/photo-1511256984241-11d4d038dc79?auto=format&fit=crop&w=300&q=80';
    if (text.includes('daging') || text.includes('sapi')) return 'https://images.unsplash.com/photo-1544025162-81111421584c?auto=format&fit=crop&w=300&q=80';
    if (text.includes('sayur') || text.includes('bayam')) return saladImg;
    return bentoImg;
  };

  return (
    <div className="dashboard-layout">
      <SidebarGuru />

      {/* Main Container */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile 
              name={JSON.parse(localStorage.getItem('user'))?.name || 'Guru'} 
              role="GURU" 
              avatarText={(JSON.parse(localStorage.getItem('user'))?.name || 'G').charAt(0).toUpperCase()} 
            />
          </div>
        </header>

        <div className="evaluasi-content">
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-title">Rata-rata Rating</div>
              <h2 className="stat-value">
                4.6 <span className="star-rating">★★★★★</span>
              </h2>
            </div>
            <div className="stat-box">
              <div className="stat-title">Ulasan 5★</div>
              <h2 className="stat-value">12</h2>
            </div>
            <div className="stat-box">
              <div className="stat-title">Ulasan 4★</div>
              <h2 className="stat-value">8</h2>
            </div>
            <div className="stat-box">
              <div className="stat-title">Ulasan ≤3★</div>
              <h2 className="stat-value val-red">1</h2>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-pills-minimal">
              {['all', '5', '4', '3', '2', '1'].map(rating => (
                <button 
                  key={rating}
                  className={`pill-btn ${filterRating === rating ? 'active' : ''}`}
                  onClick={() => setFilterRating(rating)}
                >
                  {rating === 'all' ? 'Semua' : `${rating}★`}
                </button>
              ))}
            </div>
            <div className="filter-actions">
              <div className="filter-sort-minimal">
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-select"
                >
                  <option value="date">Berdasarkan Tanggal</option>
                  <option value="highest">Rating Tertinggi</option>
                  <option value="lowest">Rating Terendah</option>
                </select>
                <div className="sort-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
              <button className="btn-add-review" onClick={() => setIsModalOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Tambah Ulasan
              </button>
            </div>
          </div>

          <div className="review-list">
            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-img-box">
                    <NgrokImage 
                      src={review.image ? `https://8ead-103-242-124-22.ngrok-free.app/api/file/${review.image}` : getFallbackImage(review.description)} 
                      alt="Menu" 
                      className="review-img" 
                    />
                  </div>
                  <div className="review-details">
                    <div className="review-header">
                      <div className="review-school-info">
                        <span className="review-date">{new Date(review.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</span>
                        <h3 className="review-school">{review.school_name}</h3>
                      </div>
                      <div className={`status-badge ${review.is_match ? 'status-cocok' : 'status-tidak'}`}>
                        {review.is_match ? 'Cocok' : 'Tidak Cocok'}
                      </div>
                    </div>
                    
                    {/* Fallback menu, since the backend doesn't save specific menus yet */}
                    <div className="review-menu-title">Menu (Estimasi):</div>
                    <div className="review-menu-list">
                      <div className="menu-list-item"><div className={`menu-dot ${!review.is_match ? 'red' : ''}`}></div> Menu yang disajikan</div>
                    </div>

                    <div className="review-rating-row">
                      <span className="rating-stars">{renderStars(review.rating)}</span>
                      <span className="rating-score">{review.rating}.0</span>
                    </div>

                    <div className={`review-comment ${review.is_match ? 'green-line' : 'red-line'}`}>
                      <p>"{review.description || 'Tidak ada deskripsi tambahan.'}"</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                Belum ada ulasan yang ditambahkan.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Tambah Ulasan */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Tambah Ulasan</h3>
              <button className="btn-close" onClick={() => { setIsModalOpen(false); resetForm(); }}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Upload Foto Makanan</label>
                <div className="upload-box" onClick={() => fileInputRef.current.click()} style={{cursor: 'pointer'}}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{maxHeight: '120px', borderRadius: '8px'}} />
                  ) : (
                    <>
                      <div className="upload-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a5d2c" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p>Klik untuk upload foto</p>
                      <span>PNG / JPG di bawah 2 MB</span>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg" style={{display: 'none'}} />
                </div>
              </div>

              <div className="form-group">
                <label>Nilai Makanan</label>
                <div className="star-rating-input" style={{cursor: 'pointer', fontSize: '24px'}}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span 
                      key={star} 
                      onClick={() => setRating(star)}
                      style={{color: star <= rating ? '#e8b923' : '#ddd'}}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Nama Sekolah</label>
                  <input type="text" className="form-input" style={{backgroundColor: '#f5f5f5', color: '#666', cursor: 'not-allowed'}} value={schoolName} readOnly disabled />
                </div>
              </div>

              <div className="form-group">
                <label>Kesesuaian Menu</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="kesesuaian" value="cocok" checked={isMatch === 'cocok'} onChange={() => setIsMatch('cocok')} /> Cocok
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="kesesuaian" value="tidak_cocok" checked={isMatch === 'tidak_cocok'} onChange={() => setIsMatch('tidak_cocok')} /> Tidak Cocok
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Ulasan</label>
                <textarea className="form-input" placeholder="Tuliskan pengalaman atau masukan terkait menu..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => { setIsModalOpen(false); resetForm(); }}>Batal</button>
                <button className="btn-save" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Ulasan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluasiUlasan;
