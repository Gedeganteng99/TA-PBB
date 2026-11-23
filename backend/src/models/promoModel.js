import supabase from '../config/supabaseClient.js';

export async function getPromos({ active, cafe_id } = {}) {
  let query = supabase
    .from('promos')
    .select('*, cafes(id, name)')
    .order('valid_until', { ascending: true });

  if (cafe_id) query = query.eq('cafe_id', cafe_id);

  if (active === 'true') {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('valid_until', today).lte('valid_from', today);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPromoById(id) {
  const { data, error } = await supabase
    .from('promos')
    .select('*, cafes(id, name, address)')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export async function createPromo(data) {
  const { data: promo, error } = await supabase.from('promos').insert(data).select().single();
  if (error) throw error;
  return promo;
}

export async function updatePromo(id, data) {
  const { data: promo, error } = await supabase.from('promos').update(data).eq('id', id).select().single();
  if (error) throw error;
  return promo;
}

export async function deletePromo(id) {
  const { error } = await supabase.from('promos').delete().eq('id', id);
  if (error) throw error;
}
