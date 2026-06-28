import React from 'react';

const FoodWasteTable = () => {
  return (
    <div className="fw-table-section">
      <div className="fw-table-header">
        <h3>Monitoring Distribusi Hari Ini</h3>
        <a href="#" className="fw-table-link">Lihat Selengkapnya &gt;</a>
      </div>
      
      <table className="fw-table">
        <thead>
          <tr>
            <th>Sekolah</th>
            <th>Porsi</th>
            <th>Distribusi</th>
            <th>Food Waste</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-text-bold">SDN Ketintang 1</td>
            <td>500</td>
            <td><span className="fw-badge success">Terkirim</span></td>
            <td className="fw-text-red">2 Kg</td>
            <td className="fw-text-bold">5 <span className="star-icon" style={{fontSize:'0.9rem'}}>★</span></td>
          </tr>
          <tr>
            <td className="fw-text-bold">SDN Wonokromo 2</td>
            <td>350</td>
            <td><span className="fw-badge process">Proses</span></td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="fw-text-bold">SMPN 12 Surabaya</td>
            <td>800</td>
            <td><span className="fw-badge success">Terkirim</span></td>
            <td>0 Kg</td>
            <td className="fw-text-bold">4.8 <span className="star-icon" style={{fontSize:'0.9rem'}}>★</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FoodWasteTable;
