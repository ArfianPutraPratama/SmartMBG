import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './Login.css';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const preSelectedRole = location.state?.role || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('/login', { email, password });
      const { access_token, user } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem('token', access_token);
      
      // Anda juga bisa menyimpan data user jika diperlukan
      localStorage.setItem('user', JSON.stringify(user));

      // Arahkan sesuai peran user dari database (atau dari role yang sebelumnya dipilih, tapi sebaiknya dari DB)
      const userRole = user.role;
      if (userRole === 'sppg') {
        navigate('/dashboard-sppg');
      } else if (userRole === 'mitra') {
        navigate('/dashboard-mitra');
      } else {
        navigate('/dashboard-guru');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        // Tampilkan error validasi pertama
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-app-title">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="white"/>
            <path d="M12 22V12" stroke="#27773b" strokeWidth="1.5"/>
            <path d="M12 12L16 8" stroke="#27773b" strokeWidth="1.5"/>
          </svg>
          SmartMBG
        </div>
        <div className="login-subtitle-bold">
          Membangun Masa Depan Berkelanjutan Bersama.
        </div>
        <p className="login-subtitle">
          Satu platform untuk semua kebutuhan logistik dan<br/>pemenuhan gizi sekolah Anda.
        </p>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 className="login-heading">Masuk ke Akun Anda</h2>
          <p className="login-subheading">
            Silakan masuk untuk melanjutkan akses ke SmartMBG.
          </p>

          {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="Masukkan email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi</label>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input" 
                placeholder="Masukkan kata sandi" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                Ingat saya
              </label>
              <Link to="/forgot-password" className="forgot-password">Lupa kata sandi?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <div className="register-prompt">
              Belum punya akun? <Link to="/register" className="register-link">Daftar sekarang</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
