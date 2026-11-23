import { Router } from 'express';
import { getCrowd, reportCrowd } from '../controllers/crowdController.js';

const router = Router({ mergeParams: true });

router.get('/',  getCrowd);
router.post('/', reportCrowd);

export default router;
