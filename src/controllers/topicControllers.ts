import { Request, Response } from 'express';

import { addTopic as addTopicService, getAllTopics as getAllTopicsService, deleteTopic as deleteTopicService } from '../services/topicService.js';

export const addTopic = async (req: Request, res: Response) => {
    try {
        const { topicName, topicField, level } = req.body;
        const topic = await addTopicService(topicName, topicField, level);
        res.status(200).json({ message: 'Topic added successfully', data: topic });
    } catch (error) {
        console.error('Error adding topic:', error);
        res.status(500).json({ message: 'Internal server error during adding topic' });
    }
}

export const getAllTopics = async (req: Request, res: Response) => {
    try {
        const topics = await getAllTopicsService();
        res.status(200).json({ message: 'Topics retrieved successfully', data: topics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ message: 'Internal server error during fetching topics' });
    }
}

export const deleteTopic = async (req: Request, res: Response) => {
    try {
        const { topicName } = req.body;
        const topic = await deleteTopicService(topicName);
        res.status(200).json({ message: 'Topic deleted successfully', data: topic });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ message: 'Internal server error during deleting topic' });
    }
}
