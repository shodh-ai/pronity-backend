import { Request, Response } from "express";

import { addWord as addWordService, getAllWords as getAllWordsService, deleteWord as deleteWordService } from "../services/wordService.js";

export const addWord = async (req: Request, res: Response) => {
    try {
        const newWord = await addWordService(req.body);
        res.status(200).json({ message: 'Word added successfully', word: newWord });
    } catch (error) {
        console.error('Error adding word:', error);
        res.status(500).json({ message: 'Internal server error during adding word' });
    }
}

export const getAllWords = async (req: Request, res: Response) => {
    try {
        const words = await getAllWordsService();
        res.status(200).json({ message: 'Words retrieved successfully', words });
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error during fetching words' });
    }
}

export const deleteWord = async (req: Request, res: Response) => {
    try {
        const deletedWord = await deleteWordService(req.body.word);
        res.status(200).json({ message: 'Word deleted successfully', word: deletedWord });
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ message: 'Internal server error during deleting word' });
    }
}