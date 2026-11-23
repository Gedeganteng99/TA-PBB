import { Router } from 'express';
import { listReviews, addReview } from '../controllers/reviewController.js';
import { requireAdmin } from '../middleware/auth.js';

// mergeParams agar :id dari parent route tersedia
const router = Router({ mergeParams: true });

router.get('/',  listReviews);
router.post('/', requireAdmin, addReview);

export default router;
