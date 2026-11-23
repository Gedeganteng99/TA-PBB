import { Router } from 'express';
import { listPromos, detailPromo, addPromo, editPromo, removePromo } from '../controllers/promoController.js';

const router = Router();

router.get('/',       listPromos);
router.post('/',      addPromo);
router.get('/:id',    detailPromo);
router.put('/:id',    editPromo);
router.delete('/:id', removePromo);

export default router;
