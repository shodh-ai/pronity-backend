import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getAllInterests as getAllInterestsService, addInterest as addInterestService, deleteInterest as deleteInterestService } from '../services/interestService.js';

// Add the getUserInterests service function import
import { getUserInterests as getUserInterestsService } from '../services/interestService.js';

// Helper function to extract user ID from token
const getUserIdFromToken = (req: Request): string | null => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log('No authorization header found');
            return null;
        }
        
        if (!authHeader.startsWith('Bearer ')) {
            console.log('Authorization header does not start with Bearer');
            return null;
        }

        const token = authHeader.split(' ')[1];
        if (!token || token === 'undefined' || token === 'null') {
            console.log('Token is empty or undefined:', token);
            return null;
        }
        
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error('JWT_SECRET environment variable is not set');
            return null;
        }

        try {
            const decoded = jwt.verify(token, secretKey) as { userId: string };
            if (!decoded || !decoded.userId) {
                console.log('Token payload does not contain userId');
                return null;
            }
            return decoded.userId;
        } catch (jwtError: any) {
            console.error('JWT verification error:', jwtError.message);
            return null;
        }
    } catch (error) {
        console.error('Error extracting user ID from token:', error);
        return null;
    }
};

export const getAllInterests = async (req: Request, res: Response) => {
    try {
        // Get all interests (for admin purposes)
        const interests = await getAllInterestsService();
        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching all interests:', error);
        res.status(500).json({ message: 'Internal server error during fetching interests' });
    }
}

export const getUserInterests = async (req: Request, res: Response) => {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const interests = await getUserInterestsService(userId);
        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching user interests:', error);
        res.status(500).json({ message: 'Internal server error during fetching user interests' });
    }
}

export const addInterest = async (req: Request, res: Response) => {
    try {
        console.log('addInterest request body:', req.body);
        
        const userId = getUserIdFromToken(req);
        console.log('Extracted userId from token:', userId);
        
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { interestName } = req.body;
        console.log('Interest name from request body:', interestName);
        
        if (!interestName) {
            return res.status(400).json({ message: 'Interest name is required' });
        }

        console.log('Calling addInterestService with:', { interestName, userId });
        const interest = await addInterestService(interestName, userId);
        console.log('Interest added successfully:', interest);
        
        res.status(201).json(interest);
    } catch (error) {
        console.error('Error adding interest:', error);
        // Send more detailed error information in development
        if (process.env.NODE_ENV !== 'production') {
            res.status(500).json({ 
                message: 'Internal server error during adding interest', 
                error: error instanceof Error ? error.message : String(error)
            });
        } else {
            res.status(500).json({ message: 'Internal server error during adding interest' });
        }
    }
}

export const deleteInterest = async (req: Request, res: Response) => {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { interestId } = req.body;
        if (!interestId) {
            return res.status(400).json({ message: 'Interest ID is required' });
        }

        const interest = await deleteInterestService(interestId, userId);
        res.status(200).json(interest);
    } catch (error) {
        console.error('Error deleting interest:', error);
        res.status(500).json({ message: 'Internal server error during deleting interest' });
    }
}
