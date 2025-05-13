import { Request, Response } from 'express';
import { UserStatusService } from '../services/userStatusService.js';
import { CustomRequest } from '../types/customRequest.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get the current status for a user
 */
export const getUserStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract user ID from authenticated request
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized - You must be logged in' });
      return;
    }
    
    // Check if user exists (for development/testing)
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!existingUser) {
        console.log(`User ${userId} doesn't exist for status check. Creating temporary user for testing.`);
        try {
          await prisma.user.create({
            data: {
              id: userId,
              firstName: 'Test',
              lastName: 'User',
              occupation: 'Tester',
              major: 'Testing',
              nativeLanguage: 'English',
              createdAt: new Date()
            }
          });
          console.log(`Created temporary user ${userId} for testing`);
        } catch (userCreateError) {
          // Just log the error, we'll still return default status values
          console.error('Failed to create test user:', userCreateError);
        }
      }
    } catch (userCheckError) {
      console.error('Error checking user existence:', userCheckError);
      // Continue anyway to return at least a default status
    }
    
    // Try to get user status
    let userStatus = await UserStatusService.getUserStatus(userId);
    
    // If no status exists, create one with default values
    if (!userStatus) {
      try {
        console.log(`No status found for user ${userId}, creating default status`);
        userStatus = await UserStatusService.updateUserStatus(userId, {
          speaking: 5,  // Default value of 5/10
          writing: 5,   // Default value of 5/10
          listening: 5  // Default value of 5/10
        });
        console.log('Created default status:', userStatus);
      } catch (createError) {
        console.error('Error creating default status:', createError);
        // If creation fails, just return default values without storing
        res.status(200).json({
          userId,
          speaking: 5,
          writing: 5,
          listening: 5,
          updatedAt: new Date().toISOString()
        });
        return;
      }
    }
    
    res.status(200).json(userStatus);
  } catch (error) {
    console.error('Error getting user status:', error);
    res.status(500).json({ error: 'Failed to get user status' });
  }
};

/**
 * Update user's status scores
 */
export const updateUserStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract user ID from authenticated request
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized - You must be logged in' });
      return;
    }
    
    // For development/testing, auto-create a user if it doesn't exist
    // Note: In production, you would want to validate that the user exists
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      // If user doesn't exist, create a temporary one for testing
      if (!existingUser) {
        console.log(`User ${userId} doesn't exist. Creating temporary user for testing.`);
        
        // Try to create a user with this ID
        // Note: This is only for testing and should be removed in production
        try {
          await prisma.user.create({
            data: {
              id: userId,
              firstName: 'Test',
              lastName: 'User',
              occupation: 'Tester',
              major: 'Testing',
              nativeLanguage: 'English',
              createdAt: new Date()
            }
          });
          console.log(`Created temporary user ${userId} for testing`);
        } catch (userCreateError) {
          console.error('Failed to create test user:', userCreateError);
          res.status(404).json({ 
            error: 'User not found in database. This is likely because your test account is not properly set up.'
          });
          return;
        }
      }
    } catch (userCheckError) {
      console.error('Error checking user existence:', userCheckError);
      // Continue with the update attempt even if we can't check the user
    }
    
    const { speaking, writing, listening } = req.body;
    
    // Validate inputs
    if (
      (speaking !== undefined && (isNaN(speaking) || speaking < 0 || speaking > 10)) ||
      (writing !== undefined && (isNaN(writing) || writing < 0 || writing > 10)) ||
      (listening !== undefined && (isNaN(listening) || listening < 0 || listening > 10))
    ) {
      res.status(400).json({ error: 'Invalid score values - must be numbers between 0 and 10' });
      return;
    }
    
    // Only update fields that were provided
    const updateData: { speaking?: number; writing?: number; listening?: number } = {};
    if (speaking !== undefined) updateData.speaking = Number(speaking); // Ensure it's a number
    if (writing !== undefined) updateData.writing = Number(writing);   // Ensure it's a number
    if (listening !== undefined) updateData.listening = Number(listening); // Ensure it's a number
    
    console.log('Updating status for user', userId, 'with data:', updateData);
    
    // Update user status
    const updatedStatus = await UserStatusService.updateUserStatus(userId, updateData);
    
    res.status(200).json(updatedStatus);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

/**
 * Reset user's status scores to zero
 */
export const resetUserStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Extract user ID from authenticated request
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized - You must be logged in' });
      return;
    }
    
    // Reset user status to zeros
    const resetStatus = await UserStatusService.resetUserStatus(userId);
    
    res.status(200).json(resetStatus);
  } catch (error) {
    console.error('Error resetting user status:', error);
    res.status(500).json({ error: 'Failed to reset user status' });
  }
};
