import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoleSelection.css';
import guruImg from '../../assets/guru.png';
import sppgImg from '../../assets/sppg.png';
import mitraImg from '../../assets/mitra.png';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate('/login', { state: { role } });
  };

  return (
    <div className="onboarding-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="app-title">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="white"/>
            <path d="M12 22V12" stroke="#27773b" strokeWidth="1.5"/>
            <path d="M12 12L16 8" stroke="#27773b" strokeWidth="1.5"/>
          </svg>
          SmartMBG
        </div>
        <div className="subtitle-bold">
          Membangun Masa Depan Berkelanjutan Bersama.
        </div>
        <p className="subtitle">
          Satu platform untuk semua kebutuhan logistik dan<br/>pemenuhan gizi sekolah Anda.
        </p>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="content-wrapper">
          <h2 className="welcome-title">Selamat Datang</h2>
          <p className="welcome-subtitle">
            Pilih peran Anda untuk mulai mewujudkan MBG sehat, bergizi, dan berkelanjutan.
          </p>

          <p className="section-label">Silakan pilih akses akun Anda</p>
          
          <div className="role-buttons">
            <button className="role-button" onClick={() => handleRoleSelect('guru')}>
              <img src={guruImg} alt="Guru / Sekolah" className="role-avatar" />
              <div className="role-info">
                <div className="role-title">Guru / Sekolah</div>
                <div className="role-desc">Kelola menu, analisis gizi, dan data siswa.</div>
              </div>
              <div className="role-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </button>

            <button className="role-button" onClick={() => handleRoleSelect('sppg')}>
              <img src={sppgImg} alt="SPPG" className="role-avatar" />
              <div className="role-info">
                <div className="role-title">SPPG</div>
                <div className="role-desc">Kelola distribusi makanan dan data dapur.</div>
              </div>
              <div className="role-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </button>

            <button className="role-button" onClick={() => handleRoleSelect('mitra')}>
              <img src={mitraImg} alt="Mitra Pengusaha" className="role-avatar" />
              <div className="role-info">
                <div className="role-title">Mitra Pengusaha</div>
                <div className="role-desc">Kelola sisa makanan dan pengolahan limbah.</div>
              </div>
              <div className="role-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="footer">
          <div className="divider"></div>
          <p className="login-text">
            Sudah punya akun? <a href="/login" className="login-link">Masuk di sini</a>
          </p>
          <p className="copyright-text">
            © 2024 SmartMBG. Solusi Logistik Berkelanjutan.
          </p>
          <div className="footer-links">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
