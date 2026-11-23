import { Router } from 'express';
import { listReviews, addReview } from '../controllers/reviewController.js';

// mergeParams agar :id dari parent route tersedia
const router = Router({ mergeParams: true });

router.get('/',  listReviews);
router.post('/', addReview);

export default router;
