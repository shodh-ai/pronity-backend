import express from 'express';
import { getUserProfile, getUserSkills } from '../controllers/apiController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Root endpoint
router.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Pronity API is running' });
});

// Get user profile by ID
router.get('/users/:userId', (req, res) => {
    getUserProfile(req, res);
});

// Get user skills by ID
router.get('/users/:userId/skills', (req, res) => {
    getUserSkills(req, res);
});

export default router;
