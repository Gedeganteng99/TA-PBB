import supabase from '../config/supabaseClient.js';

export async function getFavoritesByUser(user_id) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*, cafes(*)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function toggleFavorite({ cafe_id, user_id }) {
  // Cek apakah sudah ada
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('cafe_id', cafe_id)
    .eq('user_id', user_id)
    .single();

  if (existing) {
    // Hapus (un-favorite)
    const { error } = await supabase.from('favorites').delete().eq('id', existing.id);
    if (error) throw error;
    return { action: 'removed' };
  } else {
    // Tambah (favorite)
    const { data, error } = await supabase
      .from('favorites')
      .insert({ cafe_id, user_id })
      .select()
      .single();
    if (error) throw error;
    return { action: 'added', favorite: data };
  }
}
