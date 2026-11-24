import { Router } from 'express';
import { login, loginUser, me, registerUser } from '../controllers/authController.js';
import { identifyRole } from '../middleware/auth.js';

const router = Router();
router.post('/login', login);
router.post('/user/login', loginUser);
router.post('/user/register', registerUser);
router.get('/me', identifyRole, me);
export default router;
