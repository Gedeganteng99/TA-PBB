import { Router } from 'express';
import { listFavorites, toggleFav } from '../controllers/favoriteController.js';
import { identifyRole, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(identifyRole);
router.get('/',        listFavorites);
router.post('/toggle', requireAdmin, toggleFav);

export default router;
