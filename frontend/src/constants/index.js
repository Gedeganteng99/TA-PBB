// Konstanta aplikasi NgopiKampus

// Titik acuan Universitas Diponegoro Tembalang (mudah diubah)
export const UNDIP_LAT = -7.0516;
export const UNDIP_LNG = 110.4382;

// Versi aplikasi
export const APP_VERSION = '1.0.0';

// Nama & identitas mahasiswa
export const MAHASISWA = {
  nama:      'Muhammad Rayhan Ghifari',
  nim:       '21120124140156',
  kelompok:  '36',
  prodi:     'Teknik Komputer',
  angkatan:  '2024',
};

// GitHub repository
export const GITHUB_URL = 'https://github.com/YOUR_USERNAME/ngopikampus';

// Tag review yang valid
export const REVIEW_TAGS = [
  { value: 'skripsi',       label: '📝 Skripsi' },
  { value: 'kerja-kelompok', label: '👥 Kerja Kelompok' },
  { value: 'santai',        label: '😌 Santai' },
  { value: 'mabar',         label: '🎮 Mabar' },
];

// Area kafe
export const AREAS = ['Tembalang', 'Banyumanik', 'Pedurungan', 'Candisari'];

// Rumus Study Score
export const STUDY_SCORE_FORMULA = {
  wifi:   { label: 'Kecepatan WiFi',    weight: 30, unit: 'Mbps', formula: 'min(wifi_mbps/100, 1) × 30' },
  outlet: { label: 'Colokan',           weight: 20, unit: '/5',   formula: '(outlet_level/5) × 20' },
  noise:  { label: 'Ketenangan',        weight: 25, unit: '/5',   formula: '(noise_level/5) × 25' },
  seat:   { label: 'Kapasitas Kursi',   weight: 10, unit: 'seat', formula: 'min(seat/100, 1) × 10' },
  rating: { label: 'Rating Pengguna',   weight: 15, unit: '/5',   formula: '(avg_rating/5) × 15' },
};
