import supabase from '../config/supabaseClient.js';

export async function getReviewsByCafe(cafe_id) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('cafe_id', cafe_id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReview({ cafe_id, user_id, nickname, rating, comment, tags }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ cafe_id, user_id, nickname, rating, comment: comment ?? null, tags: tags ?? [] })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}
