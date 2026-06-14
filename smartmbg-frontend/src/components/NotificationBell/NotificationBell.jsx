import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './NotificationBell.css';

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Evaluasi Menu Baru',
    message: 'Terdapat 5 ulasan baru untuk menu Ayam Kecap.',
    time: '10 menit yang lalu',
    isRead: false,
    type: 'info'
  },
  {
    id: 2,
    title: 'Peringatan Sisa Makanan',
    message: 'Sisa makanan hari ini melebihi batas toleransi (12 Kg).',
    time: '1 jam yang lalu',
    isRead: false,
    type: 'warning'
  },
  {
    id: 3,
    title: 'Pengiriman Berhasil',
    message: 'Bahan baku untuk esok hari telah diterima oleh pihak sekolah.',
    time: '3 jam yang lalu',
    isRead: true,
    type: 'success'
  }
];

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = [];
        let idCounter = 1;

        const path = location.pathname;
        const isMitra = path.includes('/dashboard-mitra');
        const isSppg = path.includes('/dashboard-sppg');
        const isGuru = path.includes('/dashboard-guru');

        // Fetch Food Wastes
        if (isMitra || isSppg) {
          const fwRes = await fetch('http://localhost:8000/api/sppg/food-wastes');
          if (fwRes.ok) {
            const fwData = await fwRes.json();
            
            if (isMitra) {
              // Mitra only cares about "Belum Diambil"
              const recentFw = fwData.filter(fw => fw.status === 'Belum Diambil').slice(0, 3);
              recentFw.forEach(fw => {
                notifs.push({
                  id: idCounter++,
                  title: 'Sisa Makanan Baru (Pickup)',
                  message: `Terdapat sisa makanan (${fw.berat} Kg) dari ${fw.sppg_username || fw.lokasi.split(',')[0]} siap diambil.`,
                  time: fw.waktu_input || 'Baru saja',
                  isRead: false,
                  type: 'warning'
                });
              });
            } else if (isSppg) {
              // SPPG wants to know if Mitra has picked it up
              const pickedFw = fwData.filter(fw => fw.status === 'Diambil' || fw.status === 'Selesai').slice(0, 2);
              pickedFw.forEach(fw => {
                notifs.push({
                  id: idCounter++,
                  title: 'Update Sisa Makanan',
                  message: `Limbah pangan dari ${fw.sppg_username || 'sekolah'} (${fw.berat} Kg) telah ${fw.status.toLowerCase()} oleh Mitra.`,
                  time: fw.waktu_input || 'Baru saja',
                  isRead: false,
                  type: 'success'
                });
              });
            }
          }
        }

        // Fetch Reviews (Evaluasi)
        if (isSppg || isGuru) {
          const rvRes = await fetch('http://localhost:8000/api/reviews');
          if (rvRes.ok) {
            const rvData = await rvRes.json();
            const recentRv = rvData.slice(0, 2);
            recentRv.forEach(rv => {
              notifs.push({
                id: idCounter++,
                title: 'Ulasan Baru',
                message: `Ulasan baru (${rv.rating} Bintang) masuk untuk menu ${rv.menu_name}.`,
                time: 'Baru saja',
                isRead: false,
                type: 'info'
              });
            });
          }
        }

        // Fetch Distributions (for Guru)
        if (isGuru) {
          try {
            const distRes = await fetch('http://localhost:8000/api/sppg/distribusi');
            if (distRes.ok) {
              const distData = await distRes.json();
              const recentDist = distData.filter(d => d.status === 'In Progress').slice(0, 2);
              recentDist.forEach(dist => {
                notifs.push({
                  id: idCounter++,
                  title: 'Distribusi Sedang Berjalan',
                  message: `Pengiriman makanan ke sekolah sedang dalam perjalanan (${dist.kurir}).`,
                  time: dist.estimasi_waktu || 'Baru saja',
                  isRead: false,
                  type: 'info'
                });
              });
            }
          } catch(e) {
            console.error('Failed to fetch distribusi for guru', e);
          }
        }

        if (notifs.length > 0) {
          setNotifications(notifs);
        } else {
          setNotifications([{
            id: 99,
            title: 'Sistem Terhubung',
            message: 'Tidak ada aktivitas baru untuk peran Anda saat ini.',
            time: 'Sekarang',
            isRead: true,
            type: 'success'
          }]);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30 sec refresh

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [location.pathname]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'warning':
        return <svg viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
      case 'success':
        return <svg viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
      default:
        return <svg viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <div className="topbar-bell" onClick={() => setIsOpen(!isOpen)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && <span className="notification-badge"></span>}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifikasi</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-read-btn">
                Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">Tidak ada notifikasi</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${!notif.isRead ? 'unread' : ''}`}>
                  <div className="notification-icon">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <span className="notification-time">{notif.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="notification-footer">
            <a href="#">Lihat Semua Notifikasi</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
