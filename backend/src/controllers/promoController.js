import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getPromos, getPromoById, createPromo, updatePromo, deletePromo } from '../models/promoModel.js';

export const listPromos = asyncHandler(async (req, res) => {
  const promos = await getPromos(req.query);
  res.json({ success: true, data: promos, message: 'Berhasil mengambil daftar promo' });
});

export const detailPromo = asyncHandler(async (req, res) => {
  const promo = await getPromoById(req.params.id);
  if (!promo) throw new AppError('Promo tidak ditemukan', 404);
  res.json({ success: true, data: promo, message: 'Berhasil mengambil detail promo' });
});

export const addPromo = asyncHandler(async (req, res) => {
  const { cafe_id, title, valid_from, valid_until } = req.body;
  if (!cafe_id)     throw new AppError('cafe_id wajib diisi', 400);
  if (!title)       throw new AppError('title wajib diisi', 400);
  if (!valid_from)  throw new AppError('valid_from wajib diisi', 400);
  if (!valid_until) throw new AppError('valid_until wajib diisi', 400);
  if (new Date(valid_until) < new Date(valid_from)) throw new AppError('valid_until harus setelah valid_from', 400);

  const promo = await createPromo(req.body);
  res.status(201).json({ success: true, data: promo, message: 'Promo berhasil ditambahkan' });
});

export const editPromo = asyncHandler(async (req, res) => {
  const promo = await updatePromo(req.params.id, req.body);
  if (!promo) throw new AppError('Promo tidak ditemukan', 404);
  res.json({ success: true, data: promo, message: 'Promo berhasil diperbarui' });
});

export const removePromo = asyncHandler(async (req, res) => {
  await deletePromo(req.params.id);
  res.json({ success: true, data: null, message: 'Promo berhasil dihapus' });
});
