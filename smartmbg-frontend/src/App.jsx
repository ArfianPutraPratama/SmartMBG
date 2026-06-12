import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection/RoleSelection';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OTPVerification from './pages/OTPVerification/OTPVerification';
import DashboardGuru from './pages/DashboardGuru/DashboardGuru';
import AnalisisGizi from './pages/DashboardGuru/AnalisisGizi/AnalisisGizi';
import EvaluasiUlasan from './pages/DashboardGuru/EvaluasiUlasan/EvaluasiUlasan';

import DashboardSPPG from './pages/DashboardSPPG/DashboardSPPG';
import EvaluasiMenuSPPG from './pages/DashboardSPPG/EvaluasiMenuSPPG/EvaluasiMenuSPPG';
import FoodWasteSPPG from './pages/DashboardSPPG/FoodWasteSPPG/FoodWasteSPPG';
import UploadSisaMakanan from './pages/DashboardSPPG/UploadSisaMakanan/UploadSisaMakanan';
import DashboardMitra from './pages/DashboardMitra/DashboardMitra';
import FoodWasteMitra from './pages/DashboardMitra/FoodWasteMitra/FoodWasteMitra';

import LandingPage from './pages/LandingPage/LandingPage';

import RiwayatSisaMakananPage from './pages/DashboardSPPG/RiwayatSisaMakananPage/RiwayatSisaMakananPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/dashboard-guru" element={<DashboardGuru />} />
        <Route path="/analisis-gizi" element={<AnalisisGizi />} />
        <Route path="/evaluasi-ulasan" element={<EvaluasiUlasan />} />

        <Route path="/dashboard-sppg" element={<DashboardSPPG />} />
        <Route path="/dashboard-sppg/evaluasi-menu" element={<EvaluasiMenuSPPG />} />
        <Route path="/dashboard-sppg/food-waste" element={<FoodWasteSPPG />} />
        <Route path="/dashboard-sppg/upload-sisa-makanan" element={<UploadSisaMakanan />} />
        <Route path="/dashboard-sppg/riwayat-sisa-makanan" element={<RiwayatSisaMakananPage />} />
        <Route path="/dashboard-mitra" element={<DashboardMitra />} />
        <Route path="/dashboard-mitra/food-waste" element={<FoodWasteMitra />} />
      </Routes>
    </Router>
  );
}

export default App;
