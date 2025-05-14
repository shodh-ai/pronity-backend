import { Request, Response } from 'express';
import { getTaskFlow as getFlow, nextTask as getNextTask } from '../services/simpleFlowService.js';

/**
 * Get the current task in the user's active flow
 * If no active flow exists, create a new one
 */
export const getTaskFlow = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Use the simplified flow service to get the task flow
        return await getFlow(userId, res);
    } catch (error) {
        console.error('Error getting task flow:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Move to the next task in the user's active flow
 */
export const nextTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Use the simplified flow service to move to the next task
        return await getNextTask(userId, res);
    } catch (error) {
        console.error('Error moving to next task:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
