-- ============================================================
-- NgopiKampus – Seed Data
-- Jalankan file ini SETELAH schema.sql
-- ============================================================
-- ⚠️  PENTING: Semua data di bawah adalah DATA CONTOH FIKTIF
--    untuk keperluan demonstrasi dan pengujian praktikum.
--    GANTI dengan data kafe asli hasil survei lapangan sebelum
--    presentasi/submit. Jangan mengklaim data ini faktual.
-- ============================================================

-- ============================================================
-- SEED: cafes (8 kafe contoh)
-- Koordinat bersifat fiktif / ilustratif di area Tembalang
-- ============================================================

INSERT INTO cafes (id, name, description, address, area, latitude, longitude,
                   price_min, price_max, open_time, close_time,
                   wifi_speed_mbps, outlet_level, noise_level, seat_capacity,
                   has_ac, has_musholla, tags, image_url)
VALUES

-- Kafe 1: WiFi kencang, banyak colokan, cocok skripsi
(gen_random_uuid(),
 'StudyBrew Coffee',
 'Kafe coworking-style favorit mahasiswa Undip. Meja lebar, colokan di setiap meja, WiFi fiber 80 Mbps – ideal untuk skripsi atau kerja kelompok deadline.',
 'Jl. Banjarsari No. 10, Tembalang, Semarang',
 'Tembalang',
 -7.0510, 110.4375,
 15000, 35000,
 '07:00', '23:00',
 80.0, 5, 4, 80,
 true, true,
 ARRAY['skripsi','kerja-kelompok','wifi-kencang'],
 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'),

-- Kafe 2: Nuansa tenang, cocok baca & nulis
(gen_random_uuid(),
 'Perpus Kopi',
 'Suasana senyap seperti perpustakaan dengan aroma kopi. Rak buku, meja individual, dan AC dingin. Cocok untuk mahasiswa yang butuh konsentrasi penuh.',
 'Jl. Prof. Soedarto SH No. 25, Tembalang, Semarang',
 'Tembalang',
 -7.0535, 110.4390,
 12000, 28000,
 '08:00', '22:00',
 50.0, 4, 5, 60,
 true, false,
 ARRAY['skripsi','baca','tenang'],
 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'),

-- Kafe 3: Ramai tapi asyik, cocok kerja kelompok
(gen_random_uuid(),
 'Kopi Nongkrong Tembalang',
 'Kafe sosial dengan meja panjang shared-working dan nuansa industrial. Ramai dan seru untuk diskusi kelompok. Live music tiap Jumat malam.',
 'Jl. Ngesrep Timur V No. 3, Tembalang, Semarang',
 'Tembalang',
 -7.0498, 110.4360,
 10000, 25000,
 '09:00', '24:00',
 40.0, 3, 2, 100,
 true, true,
 ARRAY['kerja-kelompok','santai','mabar'],
 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800'),

-- Kafe 4: Budget friendly, dekat kampus
(gen_random_uuid(),
 'Warung Kopi Mahasiswa',
 'Warung kopi sederhana yang sudah menemani mahasiswa Undip selama bertahun-tahun. Harga terjangkau, camilan enak, WiFi cukup untuk browsing.',
 'Jl. Sirojudin No. 7, Tembalang, Semarang',
 'Tembalang',
 -7.0525, 110.4350,
 5000, 15000,
 '06:00', '23:00',
 15.0, 2, 3, 40,
 false, false,
 ARRAY['santai','budget-friendly'],
 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'),

-- Kafe 5: Premium, AC dingin, cocok meeting
(gen_random_uuid(),
 'Cowork & Coffee Undip',
 'Kafe premium dengan konsep coworking space. Meja standing, meeting room (reservasi), printer, dan kopi specialty. Favorit untuk sidang proposal kelompok.',
 'Jl. Banjarsari No. 45, Tembalang, Semarang',
 'Tembalang',
 -7.0505, 110.4380,
 20000, 50000,
 '07:00', '21:00',
 100.0, 5, 5, 50,
 true, true,
 ARRAY['skripsi','kerja-kelompok','meeting','premium'],
 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800'),

-- Kafe 6: Outdoor, santai, ada WiFi
(gen_random_uuid(),
 'Taman Kopi Tembalang',
 'Kafe outdoor dengan taman hijau dan bangku kayu. Cocok untuk santai sore sambil baca buku atau ngobrol ringan. WiFi ada tapi tidak terlalu kencang.',
 'Jl. Ngesrep Barat No. 12, Banyumanik, Semarang',
 'Banyumanik',
 -7.0580, 110.4420,
 8000, 20000,
 '10:00', '22:00',
 20.0, 2, 4, 70,
 false, false,
 ARRAY['santai','outdoor','instagramable'],
 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'),

-- Kafe 7: Malam hari, colokan banyak
(gen_random_uuid(),
 'Midnight Brew',
 'Satu-satunya kafe 24 jam di area Tembalang. Jadi pilihan utama mahasiswa yang begadang mengerjakan tugas atau laporan mendekati deadline.',
 'Jl. Prof. Soedarto SH No. 50, Tembalang, Semarang',
 'Tembalang',
 -7.0540, 110.4395,
 12000, 30000,
 '00:00', '23:59',
 60.0, 4, 3, 55,
 true, false,
 ARRAY['24jam','skripsi','deadline','kerja-kelompok'],
 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'),

-- Kafe 8: Dekat perumahan, keluarga tapi juga mahasiswa
(gen_random_uuid(),
 'Rumah Kopi Banyumanik',
 'Kafe dengan nuansa rumahan yang hangat di Banyumanik. Suasana tenang dan nyaman, cocok untuk mahasiswa yang suka suasana tidak terlalu formal.',
 'Jl. Setiabudi No. 88, Banyumanik, Semarang',
 'Banyumanik',
 -7.0620, 110.4440,
 10000, 22000,
 '08:00', '21:00',
 35.0, 3, 5, 45,
 true, true,
 ARRAY['tenang','santai','skripsi'],
 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800');

-- ============================================================
-- SEED: reviews (contoh ulasan awal)
-- user_id menggunakan UUID dummy – dalam aplikasi nyata,
-- user_id diambil dari localStorage perangkat pengguna
-- ============================================================

-- Ambil ID kafe untuk referensi
DO $$
DECLARE
  v_studybrew   UUID;
  v_perpuskopi  UUID;
  v_nongkrong   UUID;
  v_warung      UUID;
  v_cowork      UUID;
BEGIN
  SELECT id INTO v_studybrew   FROM cafes WHERE name = 'StudyBrew Coffee' LIMIT 1;
  SELECT id INTO v_perpuskopi  FROM cafes WHERE name = 'Perpus Kopi' LIMIT 1;
  SELECT id INTO v_nongkrong   FROM cafes WHERE name = 'Kopi Nongkrong Tembalang' LIMIT 1;
  SELECT id INTO v_warung      FROM cafes WHERE name = 'Warung Kopi Mahasiswa' LIMIT 1;
  SELECT id INTO v_cowork      FROM cafes WHERE name = 'Cowork & Coffee Undip' LIMIT 1;

  INSERT INTO reviews (cafe_id, user_id, nickname, rating, comment, tags) VALUES
  (v_studybrew, gen_random_uuid(), 'Rayhan', 5,
   'WiFi-nya kenceng banget, bisa video call sambil download jurnal. Colokan ada di setiap meja. Jadi pilihan utama pas mau ngerjain skripsi!',
   ARRAY['skripsi','wifi-kencang']),

  (v_studybrew, gen_random_uuid(), 'Dika', 4,
   'Tempatnya nyaman dan adem. Agak ramai di siang hari tapi masih bisa fokus. Kopinya enak juga.',
   ARRAY['kerja-kelompok']),

  (v_perpuskopi, gen_random_uuid(), 'Nisa', 5,
   'Paling tenang se-Tembalang! Kalau butuh konsentrasi penuh tanpa gangguan, ke sini wajib. Musiknya juga pelan.',
   ARRAY['skripsi','tenang']),

  (v_nongkrong, gen_random_uuid(), 'Faiz', 4,
   'Cocok banget buat kerja kelompok karena mejanya panjang dan bisa duduk bareng. Agak rame tapi seru.',
   ARRAY['kerja-kelompok','mabar']),

  (v_warung, gen_random_uuid(), 'Reza', 4,
   'Harga paling murah di antara semua kafe Tembalang. Kopi item cuma 5ribu. Pas buat yang budget mepet akhir bulan.',
   ARRAY['santai']),

  (v_cowork, gen_random_uuid(), 'Lina', 5,
   'Ini beneran coworking space dalam kafe. Ada meeting room kecil buat diskusi kelompok. Worth it untuk yang butuh privasi.',
   ARRAY['skripsi','kerja-kelompok','meeting']);
END $$;

-- ============================================================
-- SEED: promos (5 promo contoh)
-- ⚠️ Tanggal valid_until harus disesuaikan dengan tanggal saat ini
-- ============================================================

DO $$
DECLARE
  v_studybrew   UUID;
  v_perpuskopi  UUID;
  v_nongkrong   UUID;
  v_warung      UUID;
  v_cowork      UUID;
BEGIN
  SELECT id INTO v_studybrew   FROM cafes WHERE name = 'StudyBrew Coffee' LIMIT 1;
  SELECT id INTO v_perpuskopi  FROM cafes WHERE name = 'Perpus Kopi' LIMIT 1;
  SELECT id INTO v_nongkrong   FROM cafes WHERE name = 'Kopi Nongkrong Tembalang' LIMIT 1;
  SELECT id INTO v_warung      FROM cafes WHERE name = 'Warung Kopi Mahasiswa' LIMIT 1;
  SELECT id INTO v_cowork      FROM cafes WHERE name = 'Cowork & Coffee Undip' LIMIT 1;

  INSERT INTO promos (cafe_id, title, description, terms, requires_ktm, valid_from, valid_until)
  VALUES
  (v_studybrew,
   'Diskon 20% dengan KTM Undip',
   'Tunjukkan KTM Undip aktif dan dapatkan diskon 20% untuk semua minuman.',
   'Berlaku untuk 1 minuman per kunjungan. Tidak berlaku bersamaan dengan promo lain.',
   true,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '30 days'),

  (v_perpuskopi,
   'Free Upgrade Size ke Large',
   'Pesan kopi apapun dan dapatkan ukuran Large gratis setiap hari Senin–Rabu.',
   'Berlaku Senin–Rabu pukul 10.00–16.00 WIB. Tidak berlaku untuk paket.',
   false,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '45 days'),

  (v_nongkrong,
   'Buy 1 Get 1 Kopi Susu',
   'Beli 1 Kopi Susu dapat 1 Kopi Susu lagi gratis. Ajak teman!',
   'Min. 2 orang. Berlaku setiap hari pukul 14.00–17.00 WIB (happy hour).',
   false,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '14 days'),

  (v_warung,
   'Promo Akhir Bulan Mahasiswa',
   'Dapatkan kopi hitam + gorengan hanya Rp 10.000 selama minggu terakhir setiap bulan.',
   'Berlaku tanggal 25–31 setiap bulan. Tunjukkan KTM Undip.',
   true,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '60 days'),

  (v_cowork,
   'Paket Skripsi 8 Jam',
   'Nongkrong 8 jam dengan harga spesial Rp 50.000 sudah termasuk 2 minuman pilihan.',
   'Reservasi H-1 via WhatsApp. KTM wajib ditunjukkan saat datang. Berlaku Senin–Jumat.',
   true,
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '90 days');
END $$;

-- ============================================================
-- SEED SELESAI
-- ⚠️  Ingat: ganti data di atas dengan data kafe asli
--    hasil survei lapangan sebelum presentasi/submit!
-- ============================================================
