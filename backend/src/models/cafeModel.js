import supabase from '../config/supabaseClient.js';

// ============================================================
// Study Score Formula
// wifi_score   = min(wifi/100, 1) × 30
// outlet_score = (outlet_level/5) × 20
// noise_score  = (noise_level/5) × 25   (5 = paling tenang)
// seat_score   = min(seats/100, 1) × 10
// rating_score = (avg_rating/5) × 15
// study_score  = sum (max 100)
// ============================================================
export function calculateStudyScore({ wifi_speed_mbps, outlet_level, noise_level, seat_capacity, avg_rating = 0 }) {
  const wifi_score   = Math.min(wifi_speed_mbps / 100, 1) * 30;
  const outlet_score = (outlet_level / 5) * 20;
  const noise_score  = (noise_level / 5) * 25;
  const seat_score   = Math.min(seat_capacity / 100, 1) * 10;
  const rating_score = (avg_rating / 5) * 15;

  return {
    total:        Math.round(wifi_score + outlet_score + noise_score + seat_score + rating_score),
    breakdown: {
      wifi:   Math.round(wifi_score),
      outlet: Math.round(outlet_score),
      noise:  Math.round(noise_score),
      seat:   Math.round(seat_score),
      rating: Math.round(rating_score),
    },
  };
}

// Haversine distance (km) antara dua koordinat
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Titik acuan Undip Tembalang (mudah diubah)
export const UNDIP_LAT = -7.0516;
export const UNDIP_LNG = 110.4382;

// Cek apakah kafe sedang buka (zona WIB = UTC+7)
export function isOpenNow(open_time, close_time) {
  const now = new Date();
  const wibOffset = 7 * 60; // menit
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);

  const [oh, om] = open_time.split(':').map(Number);
  const [ch, cm] = close_time.split(':').map(Number);
  const openMin  = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  if (closeMin <= openMin) {
    // Tutup lewat tengah malam (e.g., buka 20:00 tutup 02:00)
    return wibMinutes >= openMin || wibMinutes < closeMin;
  }
  return wibMinutes >= openMin && wibMinutes < closeMin;
}

// ============================================================
// MODEL FUNCTIONS
// ============================================================

export async function getCafes({ search, area, max_price, min_wifi, min_outlet, tag, open_now, sort, limit = 20, page = 1 } = {}) {
  let query = supabase.from('cafes').select('*');

  if (search)      query = query.ilike('name', `%${search}%`);
  if (area)        query = query.eq('area', area);
  if (max_price)   query = query.lte('price_min', Number(max_price));
  if (min_wifi)    query = query.gte('wifi_speed_mbps', Number(min_wifi));
  if (min_outlet)  query = query.gte('outlet_level', Number(min_outlet));
  if (tag)         query = query.contains('tags', [tag]);

  const { data: cafes, error } = await query;
  if (error) throw error;

  // Hitung study_score dan avg_rating untuk setiap kafe
  const enriched = await Promise.all(
    cafes.map(async (cafe) => {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('rating')
        .eq('cafe_id', cafe.id);

      const ratings = reviewData?.map((r) => r.rating) ?? [];
      const avg_rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      const review_count = ratings.length;
      const study_score = calculateStudyScore({ ...cafe, avg_rating });
      const distance_km = haversineKm(UNDIP_LAT, UNDIP_LNG, cafe.latitude, cafe.longitude);

      return {
        ...cafe,
        avg_rating:   Math.round(avg_rating * 10) / 10,
        review_count,
        study_score:  study_score.total,
        distance_km:  Math.round(distance_km * 100) / 100,
        is_open:      isOpenNow(cafe.open_time, cafe.close_time),
      };
    })
  );

  // Filter open_now setelah enrichment
  let result = open_now === 'true' ? enriched.filter((c) => c.is_open) : enriched;

  // Sort
  if (sort === 'study_score') result.sort((a, b) => b.study_score - a.study_score);
  else if (sort === 'price')  result.sort((a, b) => a.price_min - b.price_min);
  else if (sort === 'distance') result.sort((a, b) => a.distance_km - b.distance_km);
  else if (sort === 'rating') result.sort((a, b) => b.avg_rating - a.avg_rating);

  // Pagination
  const total  = result.length;
  const offset = (Number(page) - 1) * Number(limit);
  const paged  = result.slice(offset, offset + Number(limit));

  return { cafes: paged, total, page: Number(page), limit: Number(limit) };
}

export async function getCafeById(id) {
  const { data: cafe, error } = await supabase.from('cafes').select('*').eq('id', id).single();
  if (error || !cafe) return null;

  // Reviews
  const { data: reviewData } = await supabase.from('reviews').select('rating').eq('cafe_id', id);
  const ratings     = reviewData?.map((r) => r.rating) ?? [];
  const avg_rating  = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const review_count = ratings.length;

  // Study Score
  const study_score = calculateStudyScore({ ...cafe, avg_rating });

  // Crowd status (60 menit terakhir)
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data: crowd } = await supabase
    .from('crowd_reports')
    .select('level, created_at')
    .eq('cafe_id', id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1);

  const crowd_status = crowd?.[0]
    ? {
        level:      crowd[0].level,
        reported_at: crowd[0].created_at,
        minutes_ago: Math.floor((Date.now() - new Date(crowd[0].created_at).getTime()) / 60000),
      }
    : null;

  return {
    ...cafe,
    avg_rating:   Math.round(avg_rating * 10) / 10,
    review_count,
    study_score:  study_score.total,
    study_score_breakdown: study_score.breakdown,
    distance_km:  Math.round(haversineKm(UNDIP_LAT, UNDIP_LNG, cafe.latitude, cafe.longitude) * 100) / 100,
    is_open:      isOpenNow(cafe.open_time, cafe.close_time),
    crowd_status,
  };
}

export async function createCafe(data) {
  const { data: cafe, error } = await supabase.from('cafes').insert(data).select().single();
  if (error) throw error;
  return cafe;
}

export async function updateCafe(id, data) {
  const { data: cafe, error } = await supabase.from('cafes').update(data).eq('id', id).select().single();
  if (error) throw error;
  return cafe;
}

export async function deleteCafe(id) {
  const { error } = await supabase.from('cafes').delete().eq('id', id);
  if (error) throw error;
}
