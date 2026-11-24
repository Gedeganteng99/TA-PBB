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
│   └── package.json
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
    ├── seed.sql      # Jalankan kedua
    └── user_auth.sql # Migrasi akun pengguna
```

## 🗄️ Database (Supabase)

Tabel: `cafes`, `reviews`, `crowd_reports`, `promos`, `favorites`, `app_users`

**Langkah setup:**
1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**
3. Jalankan `database/schema.sql`
4. Jalankan `database/seed.sql`
5. Jalankan `database/user_auth.sql` untuk membuat tabel akun pengguna. Pada database yang sudah berisi data, jalankan hanya migrasi ini; jangan jalankan ulang `schema.sql` karena file tersebut menghapus tabel aplikasi saat reset.

> ⚠️ Data seed adalah **data contoh fiktif**. Ganti dengan data kafe asli hasil survei sebelum submit.

> ⚠️ **Catatan RLS**: Policy write pada tabel `cafes` dan `promos` dibuka untuk kemudahan testing praktikum. Untuk produksi, batasi akses write hanya untuk admin yang terautentikasi.

## 📡 Daftar Endpoint API

| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login admin (kredensial dari environment backend) |
| GET | `/api/auth/me` | Memeriksa role token; default pengguna (read-only) |
| GET | `/api/cafes` | List kafe (search, area, sort, open_now, min_wifi, dll) |
| GET | `/api/cafes/:id` | Detail kafe + study_score + crowd_status |
| POST | `/api/cafes` | Tambah kafe (admin) |
| PUT | `/api/cafes/:id` | Update kafe (admin) |
| DELETE | `/api/cafes/:id` | Hapus kafe (admin) |
| GET | `/api/cafes/:id/reviews` | List ulasan |
| POST | `/api/cafes/:id/reviews` | Tambah ulasan |
| DELETE | `/api/reviews/:id` | Hapus ulasan |
| GET | `/api/cafes/:id/crowd` | Status crowd 60 menit terakhir |
| POST | `/api/cafes/:id/crowd` | Lapor crowd (rate limit: 1x/10 menit per user) |
| GET | `/api/promos` | List promo (active=true, cafe_id) |
| GET | `/api/promos/:id` | Detail promo |
| POST | `/api/promos` | Tambah promo (admin) |
| PUT | `/api/promos/:id` | Update promo (admin) |
| DELETE | `/api/promos/:id` | Hapus promo (admin) |
| GET | `/api/favorites` | Favorit per user_id |
| POST | `/api/favorites/toggle` | Toggle favorit |
| POST | `/api/recommendations` | Spot Finder – rekomendasi terurut + alasan |

## 👥 Role Admin dan Pengguna

- **Pengguna** dapat membuka aplikasi tanpa login dan membaca data. Operasi CRUD kafe/promo di backend hanya menerima token admin.
- Saat sesi baru dibuka, halaman pilihan role wajib ditampilkan. Pengguna memilih tombol pengguna untuk masuk langsung; sebelum memilih role, halaman aplikasi tidak dapat diakses. Role pengguna dibatasi ke daftar kafe.
- **Admin** login melalui metode email dan password. Isi `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `AUTH_TOKEN_SECRET` di environment backend; jangan simpan kredensial dalam source code.
- Token admin berlaku 8 jam. Tombol **Keluar** menghapus token lokal.
- Policy RLS yang dibuka untuk praktikum tetap perlu diperketat sebelum produksi.

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
# Edit .env: isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY
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

## ☁️ Deploy sebagai Vercel multi-service project

Repo ini memakai satu Vercel project dengan dua services yang dibangun terpisah. `vercel.json` di root mengirim `/api/*` ke Express backend dan semua jalur lain ke Vite frontend. Frontend memanggil API dengan path relatif `/api/...`, sehingga tidak perlu mengatur URL host backend.

1. Push repo ke GitHub dan impor repo **sekali** sebagai project di [Vercel](https://vercel.com).
2. Biarkan **Root Directory** project di root repo agar Vercel membaca `vercel.json` multi-service.
3. Tambahkan environment variables backend: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `AUTH_TOKEN_SECRET` (minimal 32 karakter). Service role key harus disimpan hanya di environment server, jangan beri awalan `VITE_`.
4. Deploy. Pastikan deployment memakai dukungan **Services** Vercel; fitur ini masih berstatus Beta menurut dokumentasi Vercel.
5. `FRONTEND_URL` tidak dibutuhkan untuk pemanggilan same-origin. `VITE_API_BASE_URL` juga biarkan kosong/tidak disetel di Vercel. Untuk pengembangan lokal dengan dua server terpisah, isi `VITE_API_BASE_URL=http://localhost:3001` di `frontend/.env`.

Jalur publik: `/(semua selain /api/*)` → frontend; `/api/*` → backend. Kedua services menerima traffic melalui rewrite tersebut. Tidak ada service binding internal: browser frontend memanggil API melalui jalur publik satu domain, sedangkan backend memanggil Supabase yang merupakan layanan eksternal, bukan service Vercel.

## 🔧 Cara Uji PWA & Offline

### Akses dari iPhone pada Wi-Fi yang sama

1. Sambungkan PC dan iPhone ke Wi-Fi yang sama.
2. Di PowerShell PC, jalankan `ipconfig` lalu cari **IPv4 Address** pada adapter Wi-Fi.
3. Ubah `frontend/.env` menjadi `VITE_API_BASE_URL=http://IP-PC:3001` dan `backend/.env` menjadi `FRONTEND_URL=http://IP-PC:5173` (ganti `IP-PC` dengan alamat IPv4 tadi).
4. Jalankan backend (`npm run dev`) dan frontend (`npm run dev`). Jika Windows Firewall meminta izin Node.js, izinkan jaringan **Private**.
5. Di Safari iPhone, buka `http://IP-PC:5173`.

Untuk memasang PWA di iPhone, gunakan URL HTTPS hasil deploy. Di Safari buka situs, ketuk **Share**, pilih **Add to Home Screen**, lalu **Add**. Jika opsinya tidak terlihat, gulir menu Share ke bawah atau pilih **Edit Actions**. [Panduan Apple](https://support.apple.com/en-in/guide/iphone/iph42ab2f3a7/27/ios).

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
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
PORT=3001
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
AUTH_TOKEN_SECRET=replace-with-a-random-secret-at-least-32-characters
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

1. **Supabase**: Buat project → salin Project URL dan service role key untuk backend
2. **SQL**: Jalankan `schema.sql`, `seed.sql`, lalu `user_auth.sql` di SQL Editor
3. **Env**: Isi `.env` backend dengan service role key dan kredensial admin; jangan commit `.env`
4. **Test API**: Jalankan backend → test dengan Postman/curl
5. **Deploy**: Impor root repo sebagai satu Vercel multi-service project
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
