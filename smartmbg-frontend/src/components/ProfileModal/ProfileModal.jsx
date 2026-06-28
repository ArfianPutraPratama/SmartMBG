import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, user, defaultName, defaultRole, avatarText }) => {
  if (!isOpen) return null;

  const [isClosing, setIsClosing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? `https://smartmbg-backend-git-main-fians-projects-ae029f5d.vercel.app/storage/${user.avatar}` : null);
  const fileInputRef = React.useRef(null);
  
  // Ambil tanggal bergabung dari format ISO jika ada
  const joinDateStr = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) 
    : '10 Januari 2024';

  const [userData, setUserData] = useState({
    name: user?.name || defaultName || 'User',
    username: user?.username || '',
    email: user?.email || 'email@example.com',
    phone: user?.phone || '0812-3456-7890', // Gunakan dummy jika di DB belum ada tabel telepon
    address: user?.address || 'Jl. Ketintang Baru No.12, Surabaya',
    joinDate: joinDateStr
  });

  useEffect(() => {
    setUserData({
      name: user?.name || defaultName || 'User',
      username: user?.username || '',
      email: user?.email || 'email@example.com',
      phone: user?.phone || '0812-3456-7890',
      address: user?.address || 'Jl. Ketintang Baru No.12, Surabaya',
      joinDate: user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) 
        : '10 Januari 2024'
    });
  }, [user, defaultName]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSaveSuccess(false);
      setAvatarFile(null); // Reset
      if(user?.avatar) setAvatarPreview(`https://smartmbg-backend-git-main-fians-projects-ae029f5d.vercel.app/storage/${user.avatar}`);
      onClose();
    }, 250); // Matches animation duration
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.8);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      try {
        const compressedFile = await compressImage(file);
        setAvatarFile(compressedFile);
      } catch (error) {
        console.error("Gagal melakukan kompresi gambar", error);
        setAvatarFile(file); // Fallback ke file asli
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', userData.name);
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('address', userData.address);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await axiosInstance.post('/user/profile', formData, {
        headers: {
          'Content-Type': undefined
        }
      });
      
      setSaveSuccess(true);
      
      // Update localStorage dengan data yang valid dari server
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Tutup otomatis setelah 2 detik menampilkan sukses
      setTimeout(() => {
        if(isOpen) {
          handleClose();
          window.location.reload(); // Refresh to update TopbarProfile
        }
      }, 2000);
    } catch (error) {
      console.error("Gagal menyimpan profil", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`profile-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`profile-modal-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Profil Pengguna</h2>
          <button className="close-btn" onClick={handleClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="profile-modal-body">
          <div className="profile-modal-avatar-section">
            <div className="avatar-circle" style={{ position: 'relative' }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                avatarText || name?.charAt(0) || 'U'
              )}
              <button className="upload-avatar-btn" onClick={handleAvatarClick} disabled={isSaving}>
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </button>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="avatar-info">
              <h3>{userData.name}</h3>
              <span className="role-badge">{defaultRole}</span>
            </div>
          </div>

          <div className="profile-modal-form">
            <div className="form-group-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input 
                  type="text" 
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Alamat Lengkap</label>
                <input 
                  type="text"
                  value={userData.address}
                  onChange={(e) => setUserData({...userData, address: e.target.value})}
                  disabled={isSaving}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Tanggal Bergabung</label>
                <input 
                  type="text" 
                  value={userData.joinDate}
                  disabled={true}
                  className="input-disabled"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer" style={{ position: 'relative' }}>
          {saveSuccess && (
            <div className="save-success-indicator">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Profil berhasil disimpan!
            </div>
          )}
          <button className="btn-cancel-modal" onClick={handleClose} disabled={isSaving}>Batal</button>
          <button className="btn-save-modal" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
