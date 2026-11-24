import { randomUUID } from 'node:crypto';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import supabase from '../config/supabaseClient.js';
import {
  getCafes,
  getCafeById,
  createCafe,
  updateCafe,
  deleteCafe,
} from '../models/cafeModel.js';

const REQUIRED_CAFE_FIELDS = ['name', 'address', 'area', 'latitude', 'longitude', 'open_time', 'close_time'];
const CAFE_IMAGE_BUCKET = 'cafe-images';
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function hasImageSignature(buffer, contentType) {
  if (contentType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (contentType === 'image/png') return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === 'image/webp') return buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP';
  return false;
}

export const uploadCafeImage = asyncHandler(async (req, res) => {
  const contentType = req.headers['content-type']?.split(';')[0].trim().toLowerCase();
  const extension = IMAGE_TYPES[contentType];
  if (!extension || !Buffer.isBuffer(req.body) || req.body.length === 0 || !hasImageSignature(req.body, contentType)) {
    throw new AppError('Pilih foto JPG, PNG, atau WebP yang valid.', 400);
  }
  if (req.body.length > 4 * 1024 * 1024) {
    throw new AppError('Ukuran foto setelah diproses maksimal 4 MB.', 413);
  }

  const path = `${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(CAFE_IMAGE_BUCKET)
    .upload(path, req.body, { contentType, cacheControl: '31536000', upsert: false });

  if (error) {
    if (/bucket not found/i.test(error.message)) {
      throw new AppError('Bucket cafe-images belum dibuat. Jalankan database/storage.sql di Supabase.', 500);
    }
    throw new AppError(`Gagal mengunggah foto: ${error.message}`, 502);
  }

  const { data: publicData } = supabase.storage.from(CAFE_IMAGE_BUCKET).getPublicUrl(data.path);
  res.status(201).json({ success: true, data: { image_url: publicData.publicUrl, path: data.path }, message: 'Foto kafe berhasil diunggah.' });
});

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
