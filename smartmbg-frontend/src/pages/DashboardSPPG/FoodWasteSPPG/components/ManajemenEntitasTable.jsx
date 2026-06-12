import React, { useState } from 'react';
import './ManajemenEntitasTable.css';



const ManajemenEntitasTable = ({ entities, onAddClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = entities.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntities = entities.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="me-container">
      <div className="me-header-top">
        <div className="me-title-area">
          <h2>Manajemen Entitas</h2>
          <p>Kelola data sekolah, SPPG, dan mitra penyedia Makan Bergizi Gratis.</p>
        </div>
        <button className="me-btn-add" onClick={onAddClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Tambah Entitas Baru
        </button>
      </div>

      <div className="me-controls">
        <div className="me-filters">
          <div className="me-filter-wrapper">
            <select className="me-filter-select">
              <option>Semua Tipe</option>
              <option>Sekolah</option>
              <option>SPPG</option>
              <option>Mitra</option>
            </select>
          </div>
          <div className="me-filter-wrapper">
            <select className="me-filter-select">
              <option>Semua Status</option>
              <option>Sudah Mendapat MBG</option>
              <option>Belum Mendapat MBG</option>
              <option>Dalam Peninjauan</option>
            </select>
          </div>
        </div>
        <div className="me-pagination-info">
          Menampilkan {totalItems === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalItems)} dari {totalItems} entitas &nbsp; 
          <span className="me-arrows">
            <span style={{cursor:'pointer', marginRight:'4px', opacity: currentPage === 1 ? 0.5 : 1}} onClick={handlePrevPage}>&lt;</span>
            <span style={{cursor:'pointer', opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1}} onClick={handleNextPage}>&gt;</span>
          </span>
        </div>
      </div>

      <div className="me-table-wrapper">
        <table className="me-table">
          <thead>
            <tr>
              <th>Nama Entitas</th>
              <th>Tipe</th>
              <th>Status MBG</th>
              <th>Alamat Lengkap</th>
              <th>Tanggal Terdaftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentEntities.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="me-name-cell">
                    <div className="me-icon-circle">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <span className="me-fw-bold">{item.nama}</span>
                  </div>
                </td>
                <td>{item.tipe}</td>
                <td>
                  <span className={`me-badge ${item.statusColor}`}>
                    <span className="me-dot"></span>
                    {item.statusMBG}
                  </span>
                </td>
                <td>{item.alamat}</td>
                <td>{item.tanggal}</td>
                <td>
                  <div className="me-actions">
                    <button className="me-action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="me-action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="me-pagination-bottom">
        <button className="me-page-btn-text" onClick={handlePrevPage} disabled={currentPage === 1} style={{opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Sebelumnya
        </button>
        <div className="me-page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            }
            return (
              <button 
                key={pageNum} 
                className={`me-page-num ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="me-page-dots">...</span>
              <button className="me-page-num" onClick={() => setPage(totalPages)}>{totalPages}</button>
            </>
          )}
        </div>
        <button className="me-page-btn-text" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} style={{opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1, cursor: currentPage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer'}}>
          Selanjutnya
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export default ManajemenEntitasTable;
