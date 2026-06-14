import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
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

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await axios.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });

        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'sppg') {
          navigate('/dashboard-sppg');
        } else if (user.role === 'mitra') {
          navigate('/dashboard-mitra');
        } else {
          navigate('/dashboard-guru');
        }
      } catch (err) {
        if (err.response?.status === 404 && err.response?.data?.status === 'not_registered') {
          // Redirect ke register dengan data Google
          navigate('/register', { 
            state: { 
              googleData: err.response.data.google_data 
            } 
          });
        } else {
          setError('Login Google gagal. Silakan coba lagi.');
        }
      } finally {
        setLoading(false);
      }
    },
    onError: error => setError('Login Google gagal.')
  });

  const handleSocialLogin = (provider) => {
    alert(`Fitur masuk dengan ${provider} (SSO) masih dalam tahap pengembangan dan memerlukan pengaturan API Key.`);
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

            <div className="divider-container">
              <div className="divider-line"></div>
              <div className="divider-text">atau masuk dengan</div>
              <div className="divider-line"></div>
            </div>

            <div className="social-buttons">
              <button type="button" className="btn-social" onClick={() => loginWithGoogle()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

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
