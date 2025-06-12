import { Request, Response } from 'express';
import { getTaskFlow as getFlow, nextTask as getNextTask } from '../services/simpleFlowService.js';

/**
 * Get the current task in the user's active flow
 * If no active flow exists, create a new one
 */
export const getTaskFlow = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Use the simplified flow service to get the task flow
        await getFlow(userId, res);
    } catch (error) {
        console.error('Error getting task flow:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};

/**
 * Move to the next task in the user's active flow
 */
export const nextTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Use the simplified flow service to move to the next task
        await getNextTask(userId, res);
    } catch (error) {
        console.error('Error moving to next task:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
