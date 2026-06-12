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
import WebGISGuru from './pages/DashboardGuru/WebGISGuru/WebGISGuru';

import DashboardSPPG from './pages/DashboardSPPG/DashboardSPPG';
import EvaluasiMenuSPPG from './pages/DashboardSPPG/EvaluasiMenuSPPG/EvaluasiMenuSPPG';
import FoodWasteSPPG from './pages/DashboardSPPG/FoodWasteSPPG/FoodWasteSPPG';
import UploadSisaMakanan from './pages/DashboardSPPG/UploadSisaMakanan/UploadSisaMakanan';
import DashboardMitra from './pages/DashboardMitra/DashboardMitra';
import FoodWasteMitra from './pages/DashboardMitra/FoodWasteMitra/FoodWasteMitra';

import LandingPage from './pages/LandingPage/LandingPage';

import RiwayatSisaMakananPage from './pages/DashboardSPPG/RiwayatSisaMakananPage/RiwayatSisaMakananPage';
import RiwayatDistribusiSPPG from './pages/DashboardSPPG/RiwayatDistribusiSPPG/RiwayatDistribusiSPPG';
import TambahDistribusiSPPG from './pages/DashboardSPPG/TambahDistribusiSPPG/TambahDistribusiSPPG';
import DetailDistribusiSPPG from './pages/DashboardSPPG/DetailDistribusiSPPG/DetailDistribusiSPPG';

import LaporanMitra from './pages/DashboardMitra/LaporanMitra/LaporanMitra';
import TambahLaporanMitra from './pages/DashboardMitra/TambahLaporanMitra/TambahLaporanMitra';
import EditLaporanMitra from './pages/DashboardMitra/TambahLaporanMitra/EditLaporanMitra';
import WebGISMitra from './pages/DashboardMitra/WebGISMitra/WebGISMitra';

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
        <Route path="/webgis-guru" element={<WebGISGuru />} />

        <Route path="/dashboard-sppg" element={<DashboardSPPG />} />
        <Route path="/dashboard-sppg/evaluasi-menu" element={<EvaluasiMenuSPPG />} />
        <Route path="/dashboard-sppg/food-waste" element={<FoodWasteSPPG />} />
        <Route path="/dashboard-sppg/upload-sisa-makanan" element={<UploadSisaMakanan />} />
        <Route path="/dashboard-sppg/riwayat-sisa-makanan" element={<RiwayatSisaMakananPage />} />
        <Route path="/dashboard-sppg/riwayat-distribusi" element={<RiwayatDistribusiSPPG />} />
        <Route path="/dashboard-sppg/tambah-distribusi" element={<TambahDistribusiSPPG />} />
        <Route path="/dashboard-sppg/edit-distribusi/:id" element={<TambahDistribusiSPPG />} />
        <Route path="/dashboard-sppg/distribusi/detail/:id" element={<DetailDistribusiSPPG />} />
        <Route path="/dashboard-mitra" element={<DashboardMitra />} />
        <Route path="/dashboard-mitra/food-waste" element={<FoodWasteMitra />} />
        <Route path="/dashboard-mitra/laporan" element={<LaporanMitra />} />
        <Route path="/dashboard-mitra/tambah-laporan" element={<TambahLaporanMitra />} />
        <Route path="/dashboard-mitra/edit-laporan/:id" element={<EditLaporanMitra />} />
        <Route path="/dashboard-mitra/webgis" element={<WebGISMitra />} />
      </Routes>
    </Router>
  );
}

export default App;
