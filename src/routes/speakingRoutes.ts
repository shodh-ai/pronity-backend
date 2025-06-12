import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { saveTranscription, uploadAudio } from '../controllers/speakingController.js';

const router = express.Router();

// Save speaking practice transcription
router.post('/save-transcription', authMiddleware, saveTranscription);

// Upload audio recording associated with a speaking practice
router.post('/upload-audio', authMiddleware, uploadAudio);

export default router;
