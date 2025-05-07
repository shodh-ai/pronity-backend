import { Request, Response, NextFunction } from 'express';
import verifyToken from '../utils/verifyToken.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decodedToken = verifyToken(token) as { userId: string };
        req.user = { userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};