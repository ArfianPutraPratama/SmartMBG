import React from 'react';

const EvaluasiFilter = ({ filterRating, setFilterRating, sortOrder, setSortOrder }) => {
  const ratings = ['all', '5', '4', '3', '2', '1'];
  
  return (
    <div className="eval-filter-container">
      
      <div className="filter-pills-minimal">
        {ratings.map(rating => (
          <button 
            key={rating}
            className={`pill-btn ${filterRating === rating ? 'active' : ''}`}
            onClick={() => setFilterRating(rating)}
          >
            {rating === 'all' ? 'Semua' : `${rating}★`}
          </button>
        ))}
      </div>

      <div className="filter-sort-minimal">
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="date">Berdasarkan Tanggal</option>
          <option value="highest">Peringkat Tertinggi</option>
          <option value="lowest">Peringkat Terendah</option>
        </select>
        <div className="sort-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

    </div>
  );
};

export default EvaluasiFilter;
