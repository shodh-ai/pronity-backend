import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { SpeakingPractice } from '../models/speakingPractice.js';
import { CustomRequest } from '../types/customRequest.js';

// Get the current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Save transcription data for a speaking practice session
 */
export const saveTranscription = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { userId, questionText, transcription, duration, practiceDate } = req.body;
    
    // Verify user is saving their own data
    if (userId !== req.user?.userId) {
      res.status(403).json({ error: 'Unauthorized - you can only save data for your own account' });
      return;
    }
    
    // Create a new speaking practice record
    const speakingPractice = await SpeakingPractice.create({
      id: uuidv4(),
      userId,
      questionText: questionText || 'Speaking practice session',
      transcription,
      duration: duration || 0,
      practiceDate: practiceDate || new Date().toISOString(),
      audioUrl: null, // Will be updated when audio is uploaded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    res.status(201).json(speakingPractice);
  } catch (error) {
    console.error('Error saving transcription:', error);
    res.status(500).json({ error: 'Failed to save transcription' });
  }
};

/**
 * Upload audio recording for a speaking practice session
 */
export const uploadAudio = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    console.log('Upload audio request received', { 
      body: req.body,
      files: req.files ? 'Files included' : 'No files',
      fileKeys: req.files ? Object.keys(req.files) : [] 
    });
    
    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files were uploaded');
      res.status(400).json({ error: 'No audio file uploaded' });
      return;
    }
    
    const practiceId = req.body.practiceId;
    if (!practiceId) {
      console.log('No practice ID provided');
      res.status(400).json({ error: 'Practice ID is required' });
      return;
    }
    
    // Get the speaking practice record
    console.log(`Looking for practice with ID: ${practiceId}`);
    const practice = await SpeakingPractice.findOne({ where: { id: practiceId } });
    
    if (!practice) {
      console.log(`Practice not found with ID: ${practiceId}`);
      res.status(404).json({ error: 'Speaking practice not found' });
      return;
    }
    
    console.log('Found practice:', practice);
    
    // Verify user is uploading to their own practice
    if (practice.userId !== req.user?.userId) {
      console.log(`User ID mismatch: ${practice.userId} vs ${req.user?.userId}`);
      res.status(403).json({ error: 'Unauthorized - you can only upload to your own practice sessions' });
      return;
    }
    
    // Get the uploaded file (assuming it's named 'audio' in the form)
    const audioFile = req.files?.audio;
    
    console.log('Audio file details:', { 
      exists: !!audioFile,
      isArray: Array.isArray(audioFile),
      type: audioFile ? typeof audioFile : 'N/A'
    });
    
    if (!audioFile || Array.isArray(audioFile)) {
      console.log('Invalid audio file format');
      res.status(400).json({ error: 'Invalid audio file format' });
      return;
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads/audio');
    console.log(`Uploads directory: ${uploadsDir}`);
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileExtension = path.extname(audioFile.name) || '.webm';
    const fileName = `${practiceId}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    console.log(`Saving file to: ${filePath}`);
    
    // Move the file to the uploads directory
    try {
      await new Promise<void>((resolve, reject) => {
        audioFile.mv(filePath, (err: any) => {
          if (err) {
            console.error('Error moving file:', err);
            reject(err);
          } else {
            console.log('File moved successfully');
            resolve();
          }
        });
      });
    } catch (moveError: unknown) {
      console.error('Error moving file (caught):', moveError);
      const errorMessage = moveError instanceof Error ? moveError.message : 'Unknown error';
      res.status(500).json({ error: 'Failed to save audio file', details: errorMessage });
      return;
    }
    
    // Update the practice record with the audio URL
    const audioUrl = `/uploads/audio/${fileName}`;
    console.log(`Updating practice record with audioUrl: ${audioUrl}`);
    
    await SpeakingPractice.update({ id: practiceId, audioUrl });
    
    console.log('Audio upload successful');
    res.status(200).json({ 
      success: true, 
      message: 'Audio uploaded successfully',
      audioUrl 
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ error: 'Failed to upload audio', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};
