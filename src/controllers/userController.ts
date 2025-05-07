import { Request, Response } from 'express';

export const getUserInfo = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    console.log(userId);
    res.status(200).json({ message: 'User info retrieved successfully', userId });
}