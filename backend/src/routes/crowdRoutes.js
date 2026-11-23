import { Router } from 'express';
import { getCrowd, reportCrowd } from '../controllers/crowdController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router({ mergeParams: true });

router.get('/',  getCrowd);
router.post('/', requireAdmin, reportCrowd);

export default router;
