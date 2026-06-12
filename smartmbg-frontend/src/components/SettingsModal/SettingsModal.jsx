import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('/user/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Sembunyikan pesan sukses setelah 3 detik
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError('Gagal mengubah kata sandi.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <h2>Pengaturan</h2>
          <button className="settings-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="settings-modal-body">
          
          {/* SECTION: KEAMANAN */}
          <div className="settings-section">
            <div className="settings-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Keamanan Akun
            </div>
            
            {success && <div className="settings-alert-success">{success}</div>}
            {error && <div className="settings-alert-error">{error}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="settings-form-group">
                <label>Kata Sandi Saat Ini</label>
                <input 
                  type={showCurrent ? "text" : "password"} 
                  className="settings-form-input" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <div style={{position: 'absolute', right: '12px', top: '32px', cursor: 'pointer', color: '#888'}} onClick={() => setShowCurrent(!showCurrent)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showCurrent ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </div>
              </div>

              <div className="settings-form-group">
                <label>Kata Sandi Baru</label>
                <input 
                  type={showNew ? "text" : "password"} 
                  className="settings-form-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 karakter"
                  required
                />
                <div style={{position: 'absolute', right: '12px', top: '32px', cursor: 'pointer', color: '#888'}} onClick={() => setShowNew(!showNew)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showNew ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                  </svg>
                </div>
              </div>

              <div className="settings-form-group">
                <label>Konfirmasi Kata Sandi Baru</label>
                <input 
                  type="password" 
                  className="settings-form-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="settings-btn-save" disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
                {loading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
