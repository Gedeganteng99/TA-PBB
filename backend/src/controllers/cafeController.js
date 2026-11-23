import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  getCafes,
  getCafeById,
  createCafe,
  updateCafe,
  deleteCafe,
} from '../models/cafeModel.js';

const REQUIRED_CAFE_FIELDS = ['name', 'address', 'area', 'latitude', 'longitude', 'open_time', 'close_time'];

export const listCafes = asyncHandler(async (req, res) => {
  const result = await getCafes(req.query);
  res.json({ success: true, data: result, message: 'Berhasil mengambil daftar kafe' });
});

export const detailCafe = asyncHandler(async (req, res) => {
  const cafe = await getCafeById(req.params.id);
  if (!cafe) throw new AppError('Kafe tidak ditemukan', 404);
  res.json({ success: true, data: cafe, message: 'Berhasil mengambil detail kafe' });
});

export const addCafe = asyncHandler(async (req, res) => {
  const missing = REQUIRED_CAFE_FIELDS.filter((f) => !req.body[f]);
  if (missing.length) throw new AppError(`Field wajib kurang: ${missing.join(', ')}`, 400);

  const cafe = await createCafe(req.body);
  res.status(201).json({ success: true, data: cafe, message: 'Kafe berhasil ditambahkan' });
});

export const editCafe = asyncHandler(async (req, res) => {
  const cafe = await updateCafe(req.params.id, req.body);
  if (!cafe) throw new AppError('Kafe tidak ditemukan', 404);
  res.json({ success: true, data: cafe, message: 'Kafe berhasil diperbarui' });
});

export const removeCafe = asyncHandler(async (req, res) => {
  await deleteCafe(req.params.id);
  res.json({ success: true, data: null, message: 'Kafe berhasil dihapus' });
});
