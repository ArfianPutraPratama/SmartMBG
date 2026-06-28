import React, { useState, useEffect } from 'react';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import axios from '../../../api/axios';
import './EvaluasiMenuSPPG.css';
import '../DashboardSPPG.css'; // Common layout
import SidebarSPPG from '../components/SidebarSPPG';
import EvaluasiStats from './components/EvaluasiStats';
import EvaluasiFilter from './components/EvaluasiFilter';
import EvaluasiList from './components/EvaluasiList';

const EvaluasiMenuSPPG = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating;
    } else if (sortOrder === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  return (
    <div className="dashboard-layout">
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">Evaluasi Menu</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="dashboard-content" style={{padding: 0}}>
          <div className="eval-menu-dashboard">
            <EvaluasiStats reviews={reviews} />
            <EvaluasiFilter 
              filterRating={filterRating} 
              setFilterRating={setFilterRating}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <EvaluasiList reviews={sortedReviews} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvaluasiMenuSPPG;
