# 🍱 SmartMBG

## Smart Monitoring Makan Bergizi Gratis

<p align="center">

Platform Monitoring Program Makan Bergizi Gratis (MBG) berbasis **Artificial Intelligence (AI)**, **WebGIS**, dan **Circular Economy** untuk mendukung monitoring, analisis kandungan gizi, evaluasi layanan, serta pengelolaan sisa makanan secara terintegrasi.

</p>

---

## 🌐 Live Demo

SmartMBG dapat diakses melalui deployment berikut.

> **🔗 [https://your-domain.vercel.app](https://your-domain.vercel.app)**

---

# 📖 About SmartMBG

SmartMBG (**Smart Monitoring Makan Bergizi Gratis**) merupakan platform berbasis web yang dikembangkan untuk mendukung pelaksanaan **Program Makan Bergizi Gratis (MBG)** melalui sistem monitoring terintegrasi yang menghubungkan **Sekolah**, **Satuan Pelayanan Pemenuhan Gizi (SPPG)**, dan **Mitra Pengelola Limbah Organik** dalam satu platform digital. Sistem memanfaatkan **Artificial Intelligence (AI)** untuk membantu identifikasi menu makanan, analisis kandungan gizi, serta perkiraan jumlah sisa makanan berdasarkan citra. Selain itu, **WebGIS** digunakan untuk menampilkan lokasi sekolah, SPPG, dan mitra pengelola limbah organik secara interaktif sehingga mendukung proses monitoring dan pengambilan keputusan berbasis data. SmartMBG juga mengimplementasikan konsep **Circular Economy**, di mana sisa makanan dimanfaatkan kembali sebagai bahan baku pengolahan menjadi pakan maggot dan pupuk kompos sehingga mendukung pengurangan limbah organik secara berkelanjutan. 

---

# 🎯 Project Objectives

SmartMBG dikembangkan untuk:

* Mengintegrasikan proses monitoring Program MBG.
* Membantu sekolah menganalisis kandungan gizi makanan menggunakan AI.
* Membantu sekolah melakukan evaluasi layanan makanan.
* Membantu SPPG memonitor distribusi makanan.
* Membantu mitra memperoleh informasi sisa makanan.
* Mendukung pengelolaan sisa makanan berbasis ekonomi sirkular.
* Menyediakan dashboard monitoring berbasis WebGIS.
* Mendukung pengambilan keputusan berbasis data.

---

# 💡 Innovation

Keunggulan SmartMBG dibanding sistem konvensional:

✅ Monitoring Program MBG dalam satu dashboard

✅ Analisis kandungan gizi berbasis AI

✅ Estimasi berat sisa makanan menggunakan AI Computer Vision

✅ Dashboard evaluasi makanan

✅ WebGIS Monitoring

✅ Circular Economy Management

✅ Multi User Platform

✅ REST API Integration

---

# 👥 Target Users

## 🏫 School

* Monitoring Program MBG
* AI Nutrition Analysis
* Food Evaluation
* Dashboard Monitoring

---

## 🍱 SPPG

* Food Production
* Food Distribution
* Food Waste Reporting
* Dashboard Monitoring

---

## ♻️ Organic Waste Partner

* Food Waste Monitoring
* Food Waste Collection
* Maggot Feed Management
* Compost Monitoring

---

# 🚀 Main Features

### Landing Page

* SmartMBG Information
* Technology Overview
* SDGs
* System Introduction

---

### Dashboard Monitoring

* Dashboard Analytics
* Monitoring MBG
* Statistics
* Reports

---

### Artificial Intelligence

* Food Recognition
* Nutrition Analysis
* Leftover Prediction
* AI Recommendation

---

### WebGIS

* School Mapping
* SPPG Mapping
* Waste Partner Mapping
* Interactive Map

---

### Circular Economy

* Food Waste Monitoring
* Waste Collection
* Maggot Feed
* Compost Production

---

### User Management

* Authentication
* Role Management
* Profile
* Access Control

---

# 🏛 System Architecture

```
                       SmartMBG

        ┌────────────────────────────────┐
        │            Frontend             │
        │ React + Bootstrap + JavaScript │
        └──────────────┬─────────────────┘
                       │
                REST API (Laravel)
                       │
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │              │
Database      AI Server      WebGIS       Authentication
(MySQL)     (Python YOLO)   (Leaflet)      Laravel
```

---

# ⚙ Technology Stack

| Technology    | Function                |
| ------------- | ----------------------- |
| Laravel       | Backend Development     |
| React         | Frontend Development    |
| Bootstrap     | Responsive UI           |
| MySQL         | Database                |
| Python        | Artificial Intelligence |
| YOLO          | Food Detection          |
| TensorFlow    | Nutrition Analysis      |
| Leaflet       | WebGIS                  |
| OpenStreetMap | Digital Map             |
| REST API      | System Integration      |
| GitHub        | Version Control         |
| Figma         | UI/UX Design            |
| Postman       | API Testing             |

---

# 📂 Project Structure

```
SmartMBG
│
├── smartmbg-backend/
│
├── smartmbg-frontend/
│
├── ai_server.py
├── train_yolo.py
├── requirements.txt
├── merge_datasets.py
├── test_api.py
└── README.md
```

---

# 🤖 AI Workflow

```
Food Image

↓

Object Detection (YOLO)

↓

Food Classification

↓

Nutrition Analysis

↓

Leftover Weight Prediction

↓

Dashboard Result
```

---

# 🗺 WebGIS Workflow

```
School

↓

SPPG

↓

Waste Partner

↓

Interactive Map

↓

Monitoring Dashboard
```

---

# 🖥 Installation

### Clone Repository

```bash
git clone https://github.com/ArfianPutraPratama/SmartMBG.git
```

### Backend

```bash
cd smartmbg-backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

### Frontend

```bash
cd smartmbg-frontend

npm install

npm run dev
```

### AI Server

```bash
pip install -r requirements.txt

python ai_server.py
```

---

# 📈 Research Contribution

SmartMBG dikembangkan sebagai implementasi penelitian pada bidang:

* Artificial Intelligence
* Computer Vision
* Geographic Information System (WebGIS)
* Smart Monitoring System
* Food Waste Management
* Circular Economy
* Digital Transformation

---

# 🌍 Sustainable Development Goals

SmartMBG mendukung pencapaian:

* 🎯 SDG 2 – Zero Hunger
* ❤️ SDG 3 – Good Health and Well-being
* 🏗 SDG 9 – Industry, Innovation and Infrastructure
* ♻️ SDG 12 – Responsible Consumption and Production
* 🤝 SDG 17 – Partnerships for the Goals

---

# 🛣 Roadmap

| Phase   | Development             |
| ------- | ----------------------- |
| Phase 1 | Requirement Analysis    |
| Phase 2 | System Design           |
| Phase 3 | Web Development         |
| Phase 4 | AI & WebGIS Integration |
| Phase 5 | Testing & Evaluation    |
| Phase 6 | Deployment              |

---

# 🔮 Future Development

* Mobile Application
* AI Recommendation Engine
* Real-time Monitoring
* Dashboard Analytics
* IoT Smart Scale
* Government Integration
* Cloud Deployment

---

# 👨‍💻 Development Team

**SmartMBG Development Team**

**D4 Manajemen Informatika**

**Universitas Negeri Surabaya**

**Project Leader**

Yoga Ari Anggoro

---

