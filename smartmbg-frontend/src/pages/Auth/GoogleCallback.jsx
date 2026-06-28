import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ambil token dan role dari URL query params
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token) {
      // Simpan token ke localStorage
      localStorage.setItem('token', token);

      // Fetch data user dari backend menggunakan token ini
      const fetchUserData = async () => {
        try {
          const response = await axios.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const user = response.data;
          localStorage.setItem('user', JSON.stringify(user));

          // Jika role belum diset (misal pengguna baru register via google)
          if (!user.role || user.role === 'none') {
            // Kita arahkan ke halaman pilih peran (atau default ke guru)
            // Untuk sementara kita default ke guru jika belum ada, atau tampilkan error
            // Tapi idealnya diarahkan ke halaman "Pilih Peran"
            alert('Berhasil masuk dengan Google! Silakan lengkapi profil Anda.');
            // Update role ke guru sebagai default sementara (bisa diubah nanti)
            await axios.put('/user/update', { role: 'guru' }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            user.role = 'guru';
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard-guru');
          } else {
            // Arahkan sesuai peran
            if (user.role === 'sppg') navigate('/dashboard-sppg');
            else if (user.role === 'mitra') navigate('/dashboard-mitra');
            else navigate('/dashboard-guru');
          }
        } catch (err) {
          setError('Gagal mengambil data pengguna.');
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setError('Autentikasi gagal. Token tidak ditemukan.');
      setLoading(false);
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #27773b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Sedang memproses autentikasi Google...</p>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', backgroundColor: '#27773b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Kembali ke Login
        </button>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
