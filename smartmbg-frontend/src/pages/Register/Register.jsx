import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    lat: null,
    lng: null,
    username: '',
    password: '',
    password_confirmation: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          let fetchedAddress = formData.address;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await response.json();
            if (data && data.display_name) {
              fetchedAddress = data.display_name;
            }
          } catch (error) {
            console.error("Gagal mendapatkan alamat dari koordinat:", error);
          }

          setFormData((prev) => ({
            ...prev,
            lat: lat,
            lng: lng,
            address: fetchedAddress
          }));
        },
        (error) => {
          console.error(error);
          alert("Gagal mengambil lokasi. Mohon izinkan akses lokasi (Location Access) di browser Anda.");
        }
      );
    } else {
      alert("Browser Anda tidak mendukung fitur lokasi (Geolocation).");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      // Kirim sebagai form-urlencoded agar Laravel bisa membaca body request
      const params = new URLSearchParams();
      params.append('role', formData.role);
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('phone', formData.phone);
      params.append('address', formData.address);
      params.append('username', formData.username);
      params.append('password', formData.password);
      if (formData.lat) params.append('lat', formData.lat);
      if (formData.lng) params.append('lng', formData.lng);

      await axios.post('/register', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // Arahkan ke halaman verifikasi OTP dengan membawa state email
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Tampilkan error pertama dari validasi backend
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Panel */}
      <div className="register-left">
        <div className="register-app-title">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="white"/>
            <path d="M12 22V12" stroke="#27773b" strokeWidth="1.5"/>
            <path d="M12 12L16 8" stroke="#27773b" strokeWidth="1.5"/>
          </svg>
          SmartMBG
        </div>
        <div className="register-subtitle-bold">
          Membangun Masa Depan Berkelanjutan Bersama.
        </div>
        <p className="register-subtitle">
          Satu platform untuk semua kebutuhan logistik dan<br/>pemenuhan gizi sekolah Anda.
        </p>
      </div>

      {/* Right Panel */}
      <div className="register-right">
        <div className="register-form-wrapper">
          <h2 className="register-heading">Daftar Akun Baru</h2>
          <p className="register-subheading">
            Lengkapi data untuk membuat akun baru Anda
          </p>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Peran</label>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Pilih peran Anda</option>
                <option value="guru">Guru / Sekolah</option>
                <option value="sppg">SPPG</option>
                <option value="mitra">Mitra Pengusaha</option>
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-half">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-input" name="name" placeholder="Nama lengkap" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group-half">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" name="email" placeholder="Email aktif" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-half">
                <label className="form-label">Username</label>
                <input type="text" className="form-input" name="username" placeholder="Buat username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="form-group-half">
                <label className="form-label">Nomor Telepon</label>
                <input type="tel" className="form-input" name="phone" placeholder="Contoh: 08123456789" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Lengkap</label>
              <input type="text" className="form-input" name="address" placeholder="Masukkan alamat lengkap" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Koordinat Titik Peta (Otomatis)</label>
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <button 
                  type="button" 
                  onClick={handleGetLocation} 
                  style={{padding: '8px 12px', backgroundColor: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem'}}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  Gunakan Lokasi Saat Ini
                </button>
                <div style={{flex: 1, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.8rem', color: '#666'}}>
                  {formData.lat && formData.lng ? `Lat: ${formData.lat.toFixed(5)}, Lng: ${formData.lng.toFixed(5)}` : 'Titik koordinat belum diatur'}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-half">
                <label className="form-label">Kata Sandi</label>
                <input type={showPassword ? "text" : "password"} className="form-input" name="password" placeholder="Kata sandi" value={formData.password} onChange={handleChange} required minLength="8" />
                <div className="password-eye" onClick={() => setShowPassword(!showPassword)} style={{cursor: 'pointer'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
              <div className="form-group-half">
                <label className="form-label">Konfirmasi</label>
                <input type={showConfirmPassword ? "text" : "password"} className="form-input" name="password_confirmation" placeholder="Ulangi" value={formData.password_confirmation} onChange={handleChange} required minLength="8" />
                <div className="password-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{cursor: 'pointer'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showConfirmPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            </div>

            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                Saya setuju dengan <a href="#" className="terms-link">Syarat & Ketentuan</a> dan <a href="#" className="terms-link">Kebijakan Privasi</a>
              </span>
            </label>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Mendaftar...' : 'Buat Akun'}
            </button>

            <div className="login-prompt">
              Sudah punya akun? <Link to="/login" className="login-link">Masuk di sini</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
