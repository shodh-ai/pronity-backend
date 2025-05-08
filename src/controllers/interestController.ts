import { Request, Response } from 'express';

import { getAllInterests as getAllInterestsService, addInterest as addInterestService, deleteInterest as deleteInterestService } from '../services/interestService.js';

export const getAllInterests = async (req: Request, res: Response) => {
    try {
        const interests = await getAllInterestsService();
        res.status(200).json({ message: 'Interests retrieved successfully', data: interests });
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ message: 'Internal server error during fetching interests' });
    }
}

export const addInterest = async (req: Request, res: Response) => {
    try {
        const { interestName } = req.body;
        const interest = await addInterestService(interestName);
        res.status(200).json({ message: 'Interest added successfully', data: interest });
    } catch (error) {
        console.error('Error adding interest:', error);
        res.status(500).json({ message: 'Internal server error during adding interest' });
    }
}

export const deleteInterest = async (req: Request, res: Response) => {
    try {
        const { interestName } = req.body;
        const interest = await deleteInterestService(interestName);
        res.status(200).json({ message: 'Interest deleted successfully', data: interest });
    } catch (error) {
        console.error('Error deleting interest:', error);
        res.status(500).json({ message: 'Internal server error during deleting interest' });
    }
}
    
