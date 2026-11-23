import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getCrowdStatus, checkRecentReport, createCrowdReport } from '../models/crowdModel.js';

const VALID_LEVELS = ['sepi', 'sedang', 'ramai'];

export const getCrowd = asyncHandler(async (req, res) => {
  const status = await getCrowdStatus(req.params.id);
  res.json({
    success: true,
    data: status,
    message: status ? 'Status crowd tersedia' : 'Belum ada laporan dalam 60 menit terakhir',
  });
});

export const reportCrowd = asyncHandler(async (req, res) => {
  const { user_id, level } = req.body;
  const cafe_id = req.params.id;

  if (!user_id) throw new AppError('user_id wajib diisi', 400);
  if (!level || !VALID_LEVELS.includes(level))
    throw new AppError(`level harus salah satu dari: ${VALID_LEVELS.join(', ')}`, 400);

  // Rate limit: 1 laporan per user per kafe per 10 menit
  const alreadyReported = await checkRecentReport(cafe_id, user_id);
  if (alreadyReported) {
    throw new AppError('Anda sudah melapor kondisi kafe ini dalam 10 menit terakhir. Coba lagi nanti.', 429);
  }

  const report = await createCrowdReport({ cafe_id, user_id, level });
  res.status(201).json({ success: true, data: report, message: 'Laporan crowd berhasil dikirim' });
});
