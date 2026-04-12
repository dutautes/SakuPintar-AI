# 💡 SakuPintar AI — Asisten Keuangan Cerdas

![SakuPintar AI Hero](./assets/hero.png)

## 📋 Tentang Proyek
**SakuPintar AI** adalah aplikasi manajemen keuangan pribadi yang ditenagai oleh kecerdasan buatan (Gemini AI). Aplikasi ini dirancang untuk membantu pengguna mencatat transaksi, menganalisis pengeluaran, dan mendapatkan saran keuangan yang cerdas secara otomatis.

> [!NOTE]
> Proyek ini adalah **Tugas Submission Akhir** dalam program **CodingCamp 2026 by DBS Foundation**.
> Dikerjakan dengan penuh dedikasi oleh **Tim CC26-PS015** yang beranggotakan 5 orang.

---

## 🚀 Live Demo
Aplikasi telah dideploy dan dapat diakses melalui link berikut:
👉 **[https://saku-pintar-ai.vercel.app/](https://saku-pintar-ai.vercel.app/)**

---

## ✨ Fitur Utama
- **🤖 AI Financial Assistant**: Chatbot cerdas (Gemini AI) yang memberikan saran keuangan berdasarkan data transaksi asli pengguna.
- **📊 Real-time Analytics**: Visualisasi pengeluaran dan pemasukan menggunakan grafik interaktif (Recharts).
- **💸 Transaction Management**: Pencatatan transaksi masuk dan keluar dengan kategori yang rapi.
- **📑 Export to Excel**: Kemudahan mengunduh laporan keuangan dalam format file Excel (.xlsx).
- **🔐 Secure Authentication**: Sistem login dan registrasi menggunakan JWT (JSON Web Token).
- **📱 Responsive Design**: Tampilan modern dan elegan yang optimal di berbagai perangkat (Mobile & Desktop).

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Recharts** (Grafik & Data Viz)
- **Lucide React** (Icons)
- **Axios** (API Requests)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **OpenRouter SDK** (Model AI: Gemini via OpenRouter)
- **JWT** (Keamanan)

---

## ⚙️ Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/dutautes/SakuPintar-AI.git
cd SakuPintar-AI
```

### 2. Konfigurasi Backend
- Masuk ke folder backend: `cd backend`
- Instal dependensi: `npm install`
- Buat file `.env` di dalam folder `backend` dan isi variabel berikut:
  ```env
  PORT=5000
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  OPENROUTER_API_KEY=your_openrouter_api_key
  ```
- Jalankan server: `npm run dev`

### 3. Konfigurasi Frontend
- Masuk ke folder frontend: `cd ../frontend`
- Instal dependensi: `npm install`
- Jalankan aplikasi: `npm run dev`

---

## 📂 Struktur Folder
```
SakuPintar-AI/
├── backend/            # Express Server, Routes, Models, Controllers
├── frontend/           # React App (Vite), Components, Pages, Assets
├── assets/             # Dokumentasi Gambar/Hero
└── README.md
```

---

## 👥 Anggota Tim (CC26-PS015)
1. Duta Suksesi Fathurrahman 
2. Muhammad Al-Fathir
3. Anggrayani Nur Aeni
4. Aulia Amandasari Tri
5. Alfira Ramadhani

---

## 📄 Lisensi & Credit
**Created by : CC26-PS015**
Dibangun sebagai bagian dari **Bootcamp CodingCamp 2026 by DBS Foundation**.

---
<p align="center">Made with ❤️ for better financial literacy.</p>
