import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import Swal from 'sweetalert2';
import TopbarProfile from '../../../components/TopbarProfile/TopbarProfile';
import NotificationBell from '../../../components/NotificationBell/NotificationBell';
import CurrentDate from '../../../components/CurrentDate/CurrentDate';
import { useNavigate } from 'react-router-dom';
import './FoodWasteSPPG.css';
import '../DashboardSPPG.css'; // For layout stuff
import FoodWasteStats from './components/FoodWasteStats';
import FoodWasteMap from './components/FoodWasteMap';
import ManajemenEntitasTable from './components/ManajemenEntitasTable';
import TambahEntitasForm from './components/TambahEntitasForm';
import DetailEntitasView from './components/DetailEntitasView';
import SidebarSPPG from '../components/SidebarSPPG';

const initialEntities = [];

const FoodWasteSPPG = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [editEntity, setEditEntity] = useState(null);
  const [entities, setEntities] = useState(initialEntities);
  const [foodWastes, setFoodWastes] = useState([]);
  
  const [stats, setStats] = useState({
    totalPorsi: 0,
    limbahMakanan: 0,
    ratingMBG: 0,
    totalUlasan: 0
  });

  const fetchEntities = () => {
    axios.get('/entitas')
      .then(response => {
        const fetchedEntities = response.data.map(item => {
          let color = '#ffeb3b'; // Yellow default for Belum
          if(item.status_mbg === 'Sudah menerima MBG' || item.status_mbg === 'Sudah Mendapat MBG') color = 'green';
          if(item.status_mbg === 'Ada Food Waste') color = 'orange';

          const date = new Date(item.created_at);
          const formattedDate = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`;

          return {
            id: item.id,
            nama: item.nama,
            tipe: item.tipe,
            statusMBG: item.status_mbg,
            alamat: item.alamat,
            tanggal: formattedDate,
            statusColor: color,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            catatan: item.catatan || ''
          };
        });
        setEntities(fetchedEntities);
      })
      .catch(error => {
        console.error("Error fetching entities:", error);
      });
  };

  const fetchStats = async () => {
    try {
      let calcTotalPorsi = 0;
      const savedDist = localStorage.getItem('sppg_distribusi_data');
      if (savedDist) {
        const distData = JSON.parse(savedDist);
        distData.forEach(d => {
          if (d.totalPorsi) {
            const strValue = String(d.totalPorsi);
            const num = parseInt(strValue.replace(/\D/g, ''));
            if (!isNaN(num)) calcTotalPorsi += num;
          }
        });
      }

      let calcLimbah = 0;
      try {
        const fwRes = await axios.get('/sppg/food-wastes');
        if (fwRes.data) {
          const parsedFW = fwRes.data.map(fw => ({
            ...fw,
            lat: parseFloat(fw.lat),
            lng: parseFloat(fw.lng)
          }));
          setFoodWastes(parsedFW);
          fwRes.data.forEach(fw => {
            if (fw.berat) calcLimbah += parseFloat(fw.berat);
          });
        }
      } catch(e) { console.error(e); }

      let calcRating = 0;
      let totalUlasan = 0;
      try {
        const revRes = await axios.get('/reviews');
        if (revRes.data && revRes.data.length > 0) {
          totalUlasan = revRes.data.length;
          const sum = revRes.data.reduce((acc, curr) => acc + curr.rating, 0);
          calcRating = sum / totalUlasan;
        }
      } catch(e) { console.error(e); }

      setStats({
        totalPorsi: calcTotalPorsi,
        limbahMakanan: Math.round(calcLimbah * 10) / 10,
        ratingMBG: calcRating,
        totalUlasan: totalUlasan
      });

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchEntities();
    fetchStats();
  }, []);

  const handleSaveEntity = (newEntityData) => {
    const payload = {
      nama: newEntityData.nama,
      status_mbg: newEntityData.statusMBG,
      alamat: newEntityData.alamat,
      tipe: "Sekolah",
      catatan: newEntityData.catatan || null,
      lat: newEntityData.lat || (-7.35 + Math.random() * 0.15),
      lng: newEntityData.lng || (112.6 + Math.random() * 0.2)
    };

    if (newEntityData.id) {
      // Edit existing entity
      axios.put(`/entitas/${newEntityData.id}`, payload)
        .then(response => {
          fetchEntities();
          setShowForm(false);
          setEditEntity(null);
          Swal.fire('Berhasil!', 'Entitas berhasil diupdate.', 'success');
        })
        .catch(error => {
          console.error("Error updating entity:", error);
          Swal.fire('Error', 'Gagal mengupdate entitas. Silakan coba lagi.', 'error');
        });
    } else {
      // Create new entity
      axios.post('/entitas', payload)
        .then(response => {
          fetchEntities();
          setShowForm(false);
          Swal.fire('Berhasil!', 'Entitas berhasil ditambahkan.', 'success');
        })
        .catch(error => {
          console.error("Error saving entity:", error);
          Swal.fire('Error', 'Gagal menyimpan entitas. Silakan coba lagi.', 'error');
        });
    }
  };

  const handleDeleteEntity = (id) => {
    Swal.fire({
      title: 'Hapus Entitas?',
      text: "Data ini tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#666',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/entitas/${id}`);
          Swal.fire('Terhapus!', 'Entitas berhasil dihapus.', 'success');
          fetchEntities(); // Refresh data
        } catch (error) {
          console.error('Error deleting entity:', error);
          Swal.fire('Error', 'Gagal menghapus entitas.', 'error');
        }
      }
    });
  };

  const handleViewEntity = (entity) => {
    setSelectedEntity(entity);
  };

  const handleEditEntity = (entity) => {
    setEditEntity(entity);
    setShowForm(false);
    setSelectedEntity(null);
  };

  return (
    <div className="dashboard-layout">
      <SidebarSPPG />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-topbar">
          <div className="topbar-title">WebGIS Monitoring</div>
          <div className="topbar-right">
            <CurrentDate />
            <NotificationBell />
            <TopbarProfile name="Admin SPPG" role="ADMINISTRATOR" avatarText="S" />
          </div>
        </header>

        <div className="dashboard-content" style={{padding: 0}}>
          <div className="fw-container" style={{backgroundColor: '#f9f9f9', minHeight: '100%', padding: '32px'}}>
            
            {selectedEntity ? (
              <DetailEntitasView entity={selectedEntity} onBack={() => setSelectedEntity(null)} />
            ) : editEntity ? (
              <TambahEntitasForm 
                initialData={editEntity} 
                onCancel={() => setEditEntity(null)} 
                onSave={handleSaveEntity} 
              />
            ) : !showForm ? (
              <>
                {/* Page Header with Filters */}
                <div className="fw-header">
                  <div className="fw-header-top">
                    <h1>WebGIS Monitoring Distribusi MBG</h1>
                    <div className="fw-filters">
                      <select className="fw-filter-select">
                        <option>Semua Status</option>
                        <option>Sudah Diterima</option>
                        <option>Belum Diterima</option>
                      </select>
                      <select className="fw-filter-select">
                        <option>Kecamatan Ketintang</option>
                        <option>Kecamatan Wonokromo</option>
                      </select>
                    </div>
                  </div>
                  <p>Monitoring real-time status sekolah penerima Makan Bergizi Gratis (MBG) dan pengelolaan food waste.</p>
                </div>

                <FoodWasteStats 
                  totalPorsi={stats.totalPorsi}
                  sekolahAktif={entities.length}
                  limbahMakanan={stats.limbahMakanan}
                  ratingMBG={stats.ratingMBG}
                  totalUlasan={stats.totalUlasan}
                />
                <FoodWasteMap entities={entities} foodWastes={foodWastes} />
                <ManajemenEntitasTable 
                  entities={entities} 
                  onAddClick={() => setShowForm(true)} 
                  onDeleteClick={handleDeleteEntity} 
                  onViewClick={handleViewEntity} 
                  onEditClick={handleEditEntity}
                />
              </>
            ) : (
              <TambahEntitasForm onCancel={() => setShowForm(false)} onSave={handleSaveEntity} />
            )}


          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodWasteSPPG;
