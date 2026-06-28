import React, { useState } from 'react';
import './CurrentDate.css';

const CurrentDate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
    }
  };

  const formattedDate = selectedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format date for the input value (YYYY-MM-DD)
  // We handle timezones by getting local year, month, date
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const isoDate = `${year}-${month}-${day}`;

  return (
    <div className="topbar-date-wrapper">
      <div className="topbar-date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{formattedDate}</span>
        <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <input 
        type="date" 
        className="date-picker-input" 
        value={isoDate}
        onChange={handleDateChange}
      />
    </div>
  );
};

export default CurrentDate;
