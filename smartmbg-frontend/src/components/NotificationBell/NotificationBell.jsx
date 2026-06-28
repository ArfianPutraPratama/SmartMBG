import React, { useState, useRef, useEffect } from 'react';
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
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
