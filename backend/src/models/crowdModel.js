import supabase from '../config/supabaseClient.js';

// Ambil laporan crowd 60 menit terakhir untuk satu kafe
export async function getCrowdStatus(cafe_id) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('crowd_reports')
    .select('level, created_at')
    .eq('cafe_id', cafe_id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) return null;

  const latest = data[0];
  return {
    level:       latest.level,
    reported_at: latest.created_at,
    minutes_ago: Math.floor((Date.now() - new Date(latest.created_at).getTime()) / 60000),
  };
}

// Cek apakah user sudah lapor dalam 10 menit terakhir untuk kafe ini
export async function checkRecentReport(cafe_id, user_id) {
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('crowd_reports')
    .select('id')
    .eq('cafe_id', cafe_id)
    .eq('user_id', user_id)
    .gte('created_at', since)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
}

export async function createCrowdReport({ cafe_id, user_id, level }) {
  const { data, error } = await supabase
    .from('crowd_reports')
    .insert({ cafe_id, user_id, level })
    .select()
    .single();
  if (error) throw error;
  return data;
}
