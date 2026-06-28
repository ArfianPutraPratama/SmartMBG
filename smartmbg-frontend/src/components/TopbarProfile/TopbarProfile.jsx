import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../ProfileModal/ProfileModal';
import SettingsModal from '../SettingsModal/SettingsModal';
import './TopbarProfile.css';

const TopbarProfile = ({ name: defaultName = 'User Name', role: defaultRole = 'Role', avatarText: defaultAvatar = 'U' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const name = user?.name || defaultName;
  const role = user?.role ? user.role.toUpperCase() : defaultRole;
  const avatarText = name.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenProfile = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleOpenSettings = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsSettingsModalOpen(true);
  };

  const handleOpenLogout = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <div className="topbar-profile-container" ref={dropdownRef}>
        <div className="topbar-profile" onClick={() => setIsOpen(!isOpen)}>
          <div className="profile-info">
            <span className="profile-name">{name}</span>
            <span className="profile-role">{role}</span>
          </div>
          <div className="profile-avatar" style={user?.avatar ? { overflow: 'hidden' } : {}}>
            {user?.avatar ? (
              <img src={`https://smartmbg-backend-git-main-fians-projects-ae029f5d.vercel.app/storage/${user.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              avatarText
            )}
            <div className="online-indicator" style={{ zIndex: 2 }}></div>
          </div>
        </div>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={handleOpenProfile}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Lihat Profil
            </a>
            <a href="#" className="dropdown-item" onClick={handleOpenSettings}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Pengaturan
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item logout" onClick={handleOpenLogout}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar
            </a>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user}
        defaultName={name}
        defaultRole={role}
        avatarText={avatarText}
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="modal-overlay" style={{zIndex: 10000}}>
          <div className="logout-modal-content">
            <h3 className="logout-modal-title">Konfirmasi Keluar</h3>
            <p className="logout-modal-desc">Apakah Anda yakin ingin keluar dari aplikasi?</p>
            <div className="logout-modal-actions">
              <button className="btn-cancel" onClick={() => setIsLogoutModalOpen(false)}>Batal</button>
              <button className="btn-logout" onClick={handleLogout}>Ya, Keluar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopbarProfile;
