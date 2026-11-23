import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getFavoritesByUser, toggleFavorite } from '../models/favoriteModel.js';

export const listFavorites = asyncHandler(async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) throw new AppError('user_id wajib diisi', 400);

  const favorites = await getFavoritesByUser(user_id);
  res.json({ success: true, data: favorites, message: 'Berhasil mengambil favorit' });
});

export const toggleFav = asyncHandler(async (req, res) => {
  const { cafe_id, user_id } = req.body;
  if (!cafe_id) throw new AppError('cafe_id wajib diisi', 400);
  if (!user_id) throw new AppError('user_id wajib diisi', 400);

  const result = await toggleFavorite({ cafe_id, user_id });
  const message = result.action === 'added' ? 'Kafe ditambahkan ke favorit' : 'Kafe dihapus dari favorit';
  res.json({ success: true, data: result, message });
});
