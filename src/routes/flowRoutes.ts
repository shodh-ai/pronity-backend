import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getTaskFlow, nextTask } from '../controllers/flowControllers.js';

const router = Router();

// Apply authentication middleware to all flow routes
router.use(authMiddleware);

// Flow API endpoints
router.get('/tasks/current', getTaskFlow); // Match frontend API call
router.post('/tasks/flow/next', nextTask);

export default router;
