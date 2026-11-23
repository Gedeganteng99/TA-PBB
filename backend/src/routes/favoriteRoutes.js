import { Router } from 'express';
import { listFavorites, toggleFav } from '../controllers/favoriteController.js';

const router = Router();

router.get('/',        listFavorites);
router.post('/toggle', toggleFav);

export default router;
