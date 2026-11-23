import { Router } from 'express';
import { listPromos, detailPromo, addPromo, editPromo, removePromo } from '../controllers/promoController.js';
import { identifyRole, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(identifyRole);
router.get('/',       listPromos);
router.post('/',      requireAdmin, addPromo);
router.get('/:id',    detailPromo);
router.put('/:id',    requireAdmin, editPromo);
router.delete('/:id', requireAdmin, removePromo);

export default router;
