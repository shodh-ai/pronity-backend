import express, { Request, Response } from 'express';
import * as userStatusController from '../controllers/userStatusController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { CustomRequest } from '../types/customRequest.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get current user's status
router.get('/', (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  userStatusController.getUserStatus(customReq, res);
});

// Update user's status scores
router.put('/', (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  userStatusController.updateUserStatus(customReq, res);
});

// Reset user's status scores to zero
router.post('/reset', (req: Request, res: Response) => {
  const customReq = req as CustomRequest;
  userStatusController.resetUserStatus(customReq, res);
});

export default router;
