import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import VisiMisiSection from './components/VisiMisiSection';
import PeranPenggunaSection from './components/PeranPenggunaSection';
import KeunggulanSection from './components/KeunggulanSection';
import CaraKerjaSection from './components/CaraKerjaSection';
import WebGISPromoSection from './components/WebGISPromoSection';
import SDGsCTASection from './components/SDGsCTASection';
import Footer from './components/Footer';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      <HeroSection onNavigate={() => navigate('/role-selection')} />
      <VisiMisiSection />
      <PeranPenggunaSection />
      <KeunggulanSection />
      <CaraKerjaSection />
      <WebGISPromoSection />
      <SDGsCTASection onNavigate={() => navigate('/role-selection')} />
      <Footer />
    </div>
  );
};

export default LandingPage;
