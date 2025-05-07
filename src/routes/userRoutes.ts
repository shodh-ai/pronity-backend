import { Router } from 'express';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getUserInfo } from '../controllers/userController.js';

const router = Router();

router.get('/info', authMiddleware, getUserInfo)

export default router;