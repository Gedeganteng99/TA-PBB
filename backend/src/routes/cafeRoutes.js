import { Router } from 'express';
import { listCafes, detailCafe, addCafe, editCafe, removeCafe } from '../controllers/cafeController.js';
import reviewRoutes from './reviewRoutes.js';
import crowdRoutes from './crowdRoutes.js';

const router = Router();

router.get('/',       listCafes);
router.post('/',      addCafe);
router.get('/:id',    detailCafe);
router.put('/:id',    editCafe);
router.delete('/:id', removeCafe);

// Nested routes
router.use('/:id/reviews', reviewRoutes);
router.use('/:id/crowd',   crowdRoutes);

export default router;
