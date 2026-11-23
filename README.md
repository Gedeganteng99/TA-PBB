# ☕ NgopiKampus

> **Katalog Kafe Ramah Mahasiswa di Sekitar Undip Tembalang**
>
> Tugas Akhir Praktikum PPB | Muhammad Rayhan Ghifari | NIM: 21120124140156 | Kelompok 36

---

## 📋 Deskripsi

NgopiKampus adalah Progressive Web App (PWA) yang membantu mahasiswa Universitas Diponegoro Tembalang menemukan kafe terbaik untuk kegiatan akademis. Fitur utama mencakup Study Score transparan, Crowd Report real-time, Spot Finder wizard, dan dukungan offline penuh.

## ✨ Fitur Unggulan

| Fitur | Deskripsi |
|---|---|
| 📊 **Study Score** | Skor 0–100 per kafe dari WiFi, colokan, ketenangan, kapasitas, dan rating |
| 👥 **Crowd Report** | Laporan kondisi kafe real-time (Sepi/Sedang/Ramai) dari pengguna |
| 🏷️ **Promo Mahasiswa** | Daftar promo/diskon dengan KTM, masa berlaku & hitung mundur |
| 🧭 **Spot Finder** | Wizard 3 langkah untuk menemukan kafe sesuai tujuan & budget |
| ⭐ **Review & Rating** | Ulasan dengan tag cocok untuk (skripsi, kerja-kelompok, santai, mabar) |
| ❤️ **Favorit** | Local-first, sinkron ke server bila online |
| 📍 **Google Maps** | Tombol buka peta tanpa API key (koordinat langsung) |
| 🕐 **Buka/Tutup** | Status real-time zona WIB, tangani jam tutup lewat tengah malam |
| 📶 **Offline** | Service worker + cache – data terakhir tetap tampil saat offline |

## 🏗️ Arsitektur

```
ngopikampus/
├── backend/          # Node.js + Express + Supabase (deploy ke Vercel)
│   ├── src/
│   │   ├── config/   # supabaseClient.js
│   │   ├── models/   # cafeModel, reviewModel, crowdModel, promoModel, favoriteModel
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── app.js
│   └── vercel.json
├── frontend/         # React 18 + Vite + PWA (deploy ke Vercel)
│   ├── src/
│   │   ├── config/   # api.js (axios instance)
│   │   ├── services/ # *Service.js
│   │   ├── hooks/    # use*.js
│   │   ├── pages/    # 8 halaman
│   │   └── components/
│   └── vite.config.js
└── database/
    ├── schema.sql    # Jalankan pertama
    └── seed.sql      # Jalankan kedua
```

## 🗄️ Database (Supabase)

Tabel: `cafes`, `reviews`, `crowd_reports`, `promos`, `favorites`

**Langkah setup:**
1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**
3. Jalankan `database/schema.sql`
4. Jalankan `database/seed.sql`

> ⚠️ Data seed adalah **data contoh fiktif**. Ganti dengan data kafe asli hasil survei sebelum submit.

> ⚠️ **Catatan RLS**: Policy write pada tabel `cafes` dan `promos` dibuka untuk kemudahan testing praktikum. Untuk produksi, batasi akses write hanya untuk admin yang terautentikasi.

## 📡 Daftar Endpoint API

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/cafes` | List kafe (search, area, sort, open_now, min_wifi, dll) |
| GET | `/api/cafes/:id` | Detail kafe + study_score + crowd_status |
| POST | `/api/cafes` | Tambah kafe |
| PUT | `/api/cafes/:id` | Update kafe |
| DELETE | `/api/cafes/:id` | Hapus kafe |
| GET | `/api/cafes/:id/reviews` | List ulasan |
| POST | `/api/cafes/:id/reviews` | Tambah ulasan |
| DELETE | `/api/reviews/:id` | Hapus ulasan |
| GET | `/api/cafes/:id/crowd` | Status crowd 60 menit terakhir |
| POST | `/api/cafes/:id/crowd` | Lapor crowd (rate limit: 1x/10 menit per user) |
| GET | `/api/promos` | List promo (active=true, cafe_id) |
| GET | `/api/promos/:id` | Detail promo |
| POST | `/api/promos` | Tambah promo |
| PUT | `/api/promos/:id` | Update promo |
| DELETE | `/api/promos/:id` | Hapus promo |
| GET | `/api/favorites` | Favorit per user_id |
| POST | `/api/favorites/toggle` | Toggle favorit |
| POST | `/api/recommendations` | Spot Finder – rekomendasi terurut + alasan |

## 📊 Formula Study Score

```
wifi_score   = min(wifi_speed_mbps / 100, 1) × 30
outlet_score = (outlet_level / 5) × 20
noise_score  = (noise_level / 5) × 25    // 5 = paling tenang
seat_score   = min(seat_capacity / 100, 1) × 10
rating_score = (avg_rating / 5) × 15
study_score  = wifi_score + outlet_score + noise_score + seat_score + rating_score (max 100)
```

## 🚀 Cara Menjalankan Lokal

### Prerequisites
- Node.js >= 18
- npm
- Project Supabase (URL + anon key)

### Backend

```bash
cd ngopikampus/backend
cp .env.example .env
# Edit .env: isi SUPABASE_URL dan SUPABASE_KEY
npm install
npm run dev
# Server berjalan di http://localhost:3001
```

### Frontend

```bash
cd ngopikampus/frontend
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:3001
npm install
npm run dev
# App berjalan di http://localhost:5173
```

## ☁️ Deploy ke Vercel

### Backend

1. Push ke GitHub
2. Import repo ke [vercel.com](https://vercel.com)
3. Set **Root Directory**: `backend`
4. Tambah Environment Variables:
   - `SUPABASE_URL` = URL Supabase project kamu
   - `SUPABASE_KEY` = anon key Supabase
   - `FRONTEND_URL` = URL frontend Vercel (setelah deploy frontend)
5. Deploy

### Frontend

1. Import repo ke Vercel (project baru)
2. Set **Root Directory**: `frontend`
3. Tambah Environment Variables:
   - `VITE_API_BASE_URL` = URL backend Vercel dari langkah sebelumnya
4. Deploy

## 🔧 Cara Uji PWA & Offline

1. Buka Chrome → buka URL app
2. Buka DevTools (F12) → Application → Service Workers
3. Centang **Offline** → reload halaman
4. ✅ App tetap menampilkan data dari cache
5. Coba klik tombol kirim review → muncul pesan "tidak ada koneksi"
6. Favorit tetap bisa di-toggle (local-first)
7. Kembali online → sync otomatis

**Lighthouse PWA Audit:**
1. DevTools → Lighthouse → pilih kategori PWA
2. Generate report
3. Target: **Installable** ✅ dan **Offline** ✅

**Install App:**
- Tombol "Install Aplikasi" muncul di halaman Profil
- Atau klik ikon install di address bar Chrome

## 🔑 Variabel Environment

### Backend `.env`
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:3001
```

## 📚 Postman Collection

Import file `postman_collection.json` ke Postman, lalu set variable:
- `BASE_URL` = URL backend (lokal atau Vercel)
- `CAFE_ID` = UUID kafe dari database
- `USER_ID` = UUID anonim (bebas, format UUID v4)

## 🧪 Langkah Manual yang Harus Dilakukan

1. **Supabase**: Buat project → salin URL & anon key
2. **SQL**: Jalankan `schema.sql` lalu `seed.sql` di SQL Editor
3. **Env**: Isi `.env` backend & frontend
4. **Test API**: Jalankan backend → test dengan Postman/curl
5. **Deploy**: Backend ke Vercel → Frontend ke Vercel
6. **GitHub**: `git init` → `git remote add origin` → `git push`

## 📁 GitHub Setup

```bash
cd ngopikampus
git init
git add .
git commit -m "feat: initial NgopiKampus PWA"
git branch -M main
git remote add origin https://github.com/USERNAME/ngopikampus.git
git push -u origin main
```

> ⚠️ Pastikan `.env` tidak ikut ter-commit (sudah ada di `.gitignore`)

## 💳 Kredit

- **Mahasiswa**: Muhammad Rayhan Ghifari (NIM: 21120124140156, Kelompok 36)
- **Mata Kuliah**: Praktikum Pemrograman Berbasis Perangkat (PPB)
- **Universitas**: Teknik Komputer, Universitas Diponegoro
- **Stack**: React 18 + Vite + Express + Supabase + PWA
- **Icons**: [Lucide React](https://lucide.dev)
- **Font**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) + [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display)
