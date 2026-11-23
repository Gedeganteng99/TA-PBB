import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { getReviewsByCafe, createReview, deleteReview } from '../models/reviewModel.js';

export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await getReviewsByCafe(req.params.id);
  res.json({ success: true, data: reviews, message: 'Berhasil mengambil ulasan' });
});

export const addReview = asyncHandler(async (req, res) => {
  const { user_id, nickname, rating, comment, tags } = req.body;

  if (!user_id)   throw new AppError('user_id wajib diisi', 400);
  if (!nickname)  throw new AppError('nickname wajib diisi', 400);
  if (!rating || rating < 1 || rating > 5) throw new AppError('rating harus antara 1-5', 400);

  const VALID_TAGS = ['skripsi', 'kerja-kelompok', 'santai', 'mabar'];
  const invalidTags = (tags ?? []).filter((t) => !VALID_TAGS.includes(t));
  if (invalidTags.length) throw new AppError(`Tag tidak valid: ${invalidTags.join(', ')}`, 400);

  const review = await createReview({
    cafe_id: req.params.id,
    user_id,
    nickname,
    rating: Number(rating),
    comment,
    tags: tags ?? [],
  });

  res.status(201).json({ success: true, data: review, message: 'Ulasan berhasil ditambahkan' });
});

export const removeReview = asyncHandler(async (req, res) => {
  await deleteReview(req.params.id);
  res.json({ success: true, data: null, message: 'Ulasan berhasil dihapus' });
});
