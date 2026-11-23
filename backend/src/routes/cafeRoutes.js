import { Router } from 'express';
import { listCafes, detailCafe, addCafe, editCafe, removeCafe } from '../controllers/cafeController.js';
import reviewRoutes from './reviewRoutes.js';
import crowdRoutes from './crowdRoutes.js';
import { identifyRole, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(identifyRole);
router.get('/',       listCafes);
router.post('/',      requireAdmin, addCafe);
router.get('/:id',    detailCafe);
router.put('/:id',    requireAdmin, editCafe);
router.delete('/:id', requireAdmin, removeCafe);

// Nested routes
router.use('/:id/reviews', reviewRoutes);
router.use('/:id/crowd',   crowdRoutes);

export default router;
