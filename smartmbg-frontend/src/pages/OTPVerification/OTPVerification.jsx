import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './OTPVerification.css';
import maggotBg from '../../assets/maggot-bg.png';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendMessage, setResendMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Silakan masukkan 6 digit kode OTP.');
      return;
    }

    if (!email) {
      setError('Email tidak ditemukan. Silakan ulangi proses pendaftaran.');
      return;
    }

    setLoading(true);
    setError(null);
    setResendMessage('');

    try {
      const response = await axios.post('/verify-otp', { email, otp: otpCode });
      const { access_token, user } = response.data;

      // Simpan token ke localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect ke dashboard sesuai peran
      const userRole = user.role;
      if (userRole === 'sppg') {
        navigate('/dashboard-sppg');
      } else if (userRole === 'mitra') {
        navigate('/dashboard-mitra');
      } else {
        navigate('/dashboard-guru');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Terjadi kesalahan saat memverifikasi OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email tidak ditemukan. Silakan ulangi proses pendaftaran.');
      return;
    }

    setLoading(true);
    setError(null);
    setResendMessage('');

    try {
      const response = await axios.post('/resend-otp', { email });
      setResendMessage(response.data.message || 'Kode OTP baru telah dikirim.');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError('Gagal mengirim ulang OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      {/* Left Panel */}
      <div className="otp-left">
        <img src={maggotBg} alt="Background" className="otp-bg-image" />
        <div className="otp-bg-overlay"></div>
        <div className="otp-left-content">
          <div className="otp-app-title">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="white"/>
              <path d="M12 22V12" stroke="#27773b" strokeWidth="1.5"/>
              <path d="M12 12L16 8" stroke="#27773b" strokeWidth="1.5"/>
            </svg>
            SmartMBG
          </div>
          <div className="otp-subtitle-bold">
            Solusi Digital untuk Logistik Berkelanjutan
          </div>
          <p className="otp-subtitle">
            Bergabunglah dengan ekosistem kami untuk masa depan yang lebih hijau dan efisien.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="otp-right">
        <div className="otp-help">Bantuan</div>
        
        <div className="otp-form-wrapper">
          <div className="otp-icon-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          
          <h2 className="otp-heading">Verifikasi Email Anda</h2>
          <p className="otp-subheading">
            Kami telah mengirimkan kode verifikasi 6-digit ke<br/>alamat email:
          </p>
          
          <div className="otp-email-badge">{email || 'email-tidak-ditemukan@gmail.com'}</div>
          
          <div className="otp-input-label">MASUKKAN KODE 6 DIGIT</div>
          
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                className="otp-input"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
                placeholder="0"
              />
            ))}
          </div>

          {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
          {resendMessage && <div style={{ color: 'green', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>{resendMessage}</div>}
          
          <div className="otp-resend">
            Tidak menerima kode? <strong onClick={handleResend} style={{cursor: 'pointer'}}>Kirim ulang</strong>
          </div>
          
          <button className="btn-primary" onClick={handleVerify} disabled={loading}>
            {loading ? 'Memproses...' : 'Verifikasi'}
          </button>
          
          <button className="btn-link" onClick={() => navigate('/register')}>Ubah email</button>
        </div>
        
        <div className="otp-footer">
          © 2024 SmartMBG <span>Privasi</span> <span>Syarat</span>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
