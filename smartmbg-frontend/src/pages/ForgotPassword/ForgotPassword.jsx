import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // States: 1 = Email Input, 2 = OTP Input, 3 = New Password
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post('/forgot-password', { email });
      setSuccess(response.data.message || 'Kode OTP telah dikirim ke email Anda.');
      setTimeout(() => {
        setSuccess(null);
        setStep(2);
      }, 2000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError('Gagal mengirim email. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Masukkan kode OTP lengkap 6 digit.');
      return;
    }
    setError(null);
    // Kita pindah ke step 3, validasi akhir akan dilakukan di backend saat reset password
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }

    setLoading(true);
    const otpValue = otp.join('');

    try {
      const response = await axios.post('/reset-password', {
        email,
        otp: otpValue,
        password
      });
      setSuccess(response.data.message || 'Kata sandi berhasil diatur ulang.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError('Gagal mengatur ulang kata sandi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-left">
        <div className="forgot-app-title">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="white"/>
            <path d="M12 22V12" stroke="#27773b" strokeWidth="1.5"/>
            <path d="M12 12L16 8" stroke="#27773b" strokeWidth="1.5"/>
          </svg>
          SmartMBG
        </div>
        <div className="forgot-subtitle-bold">
          Pemulihan Akun Anda
        </div>
        <p className="forgot-subtitle">
          Jangan khawatir, atur ulang kata sandi Anda dengan aman menggunakan verifikasi email.
        </p>
      </div>

      <div className="forgot-right">
        <div className="forgot-form-wrapper">
          {step === 1 && (
            <>
              <h2 className="forgot-heading">Lupa Kata Sandi</h2>
              <p className="forgot-subheading">
                Masukkan email yang terdaftar. Kami akan mengirimkan 6 digit kode OTP untuk mengatur ulang kata sandi Anda.
              </p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleSendEmail}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="nama@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading || !email}>
                  {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </button>
                <Link to="/login" className="back-to-login">
                  &larr; Kembali ke halaman Masuk
                </Link>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="forgot-heading">Masukkan Kode OTP</h2>
              <p className="forgot-subheading">
                Kode 6 digit telah dikirimkan ke <strong>{email}</strong>
              </p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div className="otp-input-group">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-digit-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={otpRefs[index]}
                    />
                  ))}
                </div>
                <button type="submit" className="btn-primary">
                  Verifikasi OTP
                </button>
                <button type="button" className="btn-secondary" onClick={handleSendEmail} disabled={loading}>
                  {loading ? 'Mengirim ulang...' : 'Kirim Ulang Kode'}
                </button>
                <button type="button" className="back-to-login" style={{border: 'none', background: 'none', width: '100%'}} onClick={() => setStep(1)}>
                  Ganti Email
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="forgot-heading">Buat Kata Sandi Baru</h2>
              <p className="forgot-subheading">
                Buat kata sandi baru untuk mengamankan akun Anda.
              </p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">Kata Sandi Baru</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="Min. 8 karakter" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="password-eye" style={{position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', color: '#666'}} onClick={() => setShowPassword(!showPassword)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                    </svg>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Konfirmasi Kata Sandi</label>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="Ulangi kata sandi" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="password-eye" style={{position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', color: '#666'}} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showConfirmPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                    </svg>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading || !password || !confirmPassword}>
                  {loading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
