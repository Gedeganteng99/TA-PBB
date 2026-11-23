import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getCafes, calculateStudyScore, haversineKm, UNDIP_LAT, UNDIP_LNG } from '../models/cafeModel.js';

const VALID_PURPOSES = ['kerja-kelompok', 'skripsi', 'santai'];

export const getRecommendations = asyncHandler(async (req, res) => {
  const { purpose, budget, group_size, need_wifi, need_outlet } = req.body;

  // Validasi
  if (!purpose || !VALID_PURPOSES.includes(purpose)) {
    throw new AppError(`purpose harus salah satu dari: ${VALID_PURPOSES.join(', ')}`, 400);
  }

  // Ambil semua kafe
  const { cafes } = await getCafes({ limit: 100 });

  // Filter & scoring
  const scored = cafes
    .filter((cafe) => {
      if (budget && cafe.price_min > Number(budget)) return false;
      if (need_wifi === true  && cafe.wifi_speed_mbps < 10) return false;
      if (need_outlet === true && cafe.outlet_level < 2) return false;
      return true;
    })
    .map((cafe) => {
      let score = cafe.study_score ?? 0;
      const reasons = [];

      // Bobot tambahan berdasarkan tujuan
      if (purpose === 'skripsi') {
        if (cafe.noise_level >= 4)       { score += 15; reasons.push('Suasana tenang untuk fokus'); }
        if (cafe.outlet_level >= 4)      { score += 10; reasons.push(`Colokan banyak (level ${cafe.outlet_level}/5)`); }
        if (cafe.wifi_speed_mbps >= 50)  { score += 10; reasons.push(`WiFi cepat ${cafe.wifi_speed_mbps} Mbps`); }
        if (cafe.has_ac)                 { score +=  5; reasons.push('Ber-AC'); }
      } else if (purpose === 'kerja-kelompok') {
        if (cafe.seat_capacity >= 40)    { score += 15; reasons.push(`Kursi banyak (${cafe.seat_capacity} seat)`); }
        if (cafe.wifi_speed_mbps >= 30)  { score += 10; reasons.push(`WiFi memadai ${cafe.wifi_speed_mbps} Mbps`); }
        if (group_size && cafe.seat_capacity >= Number(group_size)) {
          score += 10; reasons.push(`Muat untuk ${group_size} orang`);
        }
      } else if (purpose === 'santai') {
        if (cafe.price_min <= 15000)     { score += 15; reasons.push(`Harga terjangkau mulai Rp${cafe.price_min.toLocaleString('id-ID')}`); }
        if (cafe.noise_level <= 3)       { score +=  5; reasons.push('Suasana santai'); }
      }

      if (cafe.distance_km !== undefined && cafe.distance_km < 1) {
        score += 10; reasons.push(`Dekat kampus (${cafe.distance_km} km)`);
      }

      if (cafe.avg_rating >= 4.5) { score += 5; reasons.push(`Rating tinggi (${cafe.avg_rating}/5)`); }

      return {
        ...cafe,
        recommendation_score: Math.min(score, 100),
        reasons,
      };
    })
    .sort((a, b) => b.recommendation_score - a.recommendation_score)
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      purpose,
      budget:     budget ?? null,
      group_size: group_size ?? null,
      cafes:      scored,
    },
    message: `Ditemukan ${scored.length} rekomendasi kafe`,
  });
});
