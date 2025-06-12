import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware as authenticateToken } from '../middlewares/authMiddleware.js';

// Define a type for the user object attached by authMiddleware
interface AuthenticatedUser {
  userId: string;
  // Add other properties if your authMiddleware sets them
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const router = express.Router();
const prisma = new PrismaClient();

interface WritingPracticeData {
  questionText: string;
  writtenText: string; // This will be HTML content
  duration: number;
  practiceDate: string;
  topicId?: string;
  taskId?: string;
  wordCount?: number;
  // userId is not expected from client, it will be from JWT token
}

// POST /writing/save-submission
router.post('/save-submission', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const { questionText, writtenText, duration, practiceDate, topicId, taskId, wordCount } = req.body as WritingPracticeData;
  const userId = req.user?.userId; // Extracted from JWT by authenticateToken middleware

  if (!userId) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  if (!questionText || !writtenText || duration === undefined || !practiceDate) {
    res.status(400).json({ message: 'Missing required fields: questionText, writtenText, duration, practiceDate' });
    return;
  }

  try {
    const submissionDate = new Date(practiceDate);
    if (isNaN(submissionDate.getTime())) {
        res.status(400).json({ message: 'Invalid practiceDate format. Please use ISO 8601 format.' });
        return;
    }

    const newSubmission = await prisma.writingSubmission.create({
      data: {
        userId,
        questionText,
        writtenTextHtml: writtenText, // Store HTML content
        durationSeconds: duration,
        practiceDate: submissionDate,
        topicId: topicId || null,
        taskId: taskId || null,
        wordCount: wordCount || null,
      },
    });
    res.status(201).json(newSubmission);
    return;
  } catch (error) {
    console.error('Error saving writing submission:', error);
    res.status(500).json({ message: 'Failed to save writing submission', error: (error as Error).message });
    return;
  }
});

// GET /writing/submissions?topicId=...&taskId=...
router.get('/submissions', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { topicId, taskId } = req.query;

  if (!userId) {
    res.status(403).json({ message: 'User not authenticated' });
    return;
  }

  // Basic validation for query parameters
  if (topicId && typeof topicId !== 'string') {
    res.status(400).json({ message: 'Invalid topicId parameter.' });
    return;
  }
  if (taskId && typeof taskId !== 'string') {
    res.status(400).json({ message: 'Invalid taskId parameter.' });
    return;
  }

  try {
    const submissions = await prisma.writingSubmission.findMany({
      where: {
        userId,
        ...(topicId && { topicId: topicId as string }),
        ...(taskId && { taskId: taskId as string }),
      },
      orderBy: {
        practiceDate: 'desc', // Get the most recent ones first
      },
      // Depending on frontend needs, you might want to take(1) to get only the most recent
      // For now, fetching all that match, frontend can pick.
      // If strictly one submission per (topicId, taskId) is expected by frontend, adjust query (e.g., take: 1)
    });

    if (!submissions || submissions.length === 0) {
      // Distinguish between no submissions found for criteria vs. a general error
      // The frontend expects a submission or an error if it was specifically looking for one by ID (which is not the case here)
      // For a list, an empty array is a valid response.
      res.status(200).json([]);
    return; 
    }

    // The frontend `fetchWritingSubmission` in `pronityClient.ts` seems to expect a single object.
    // If that's the strict contract for this endpoint, we should return submissions[0] or 404 if empty.
    // However, the current frontend call passes topicId and taskId, which could match multiple.
    // For now, returning the first one if any, as per the likely expectation for a 'report' page.
    res.status(200).json(submissions[0]); // Returning the most recent one based on query
    return;

  } catch (error) {
    console.error('Error fetching writing submissions:', error);
    res.status(500).json({ message: 'Failed to fetch writing submissions', error: (error as Error).message });
    return;
  }
});

export default router;
