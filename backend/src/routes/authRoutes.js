import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { identifyRole } from '../middleware/auth.js';

const router = Router();
router.post('/login', login);
router.get('/me', identifyRole, me);
export default router;
