import { PrismaClient } from '@prisma/client';
import { UserStatusDTO } from '../models/UserStatusDTO.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class UserStatusService {
  /**
   * Get the current status for a user
   */
  static async getUserStatus(userId: string): Promise<UserStatusDTO | null> {
    try {
      // Use Prisma client to find user status
      const userStatus = await prisma.userStatus.findUnique({
        where: { userId }
      });

      // If no status found, return null
      if (!userStatus) return null;
      
      // Convert Date to string for the DTO
      return {
        ...userStatus,
        updatedAt: userStatus.updatedAt.toISOString()
      } as UserStatusDTO;
    } catch (error) {
      console.error('Error getting user status:', error);
      throw new Error('Failed to get user status');
    }
  }

  /**
   * Create or update user status
   */
  static async updateUserStatus(
    userId: string,
    data: { 
      speaking?: number; 
      writing?: number; 
      listening?: number;
    }
  ): Promise<UserStatusDTO> {
    try {
      // Prepare update data
      const updateData: any = {};
      if (data.speaking !== undefined) updateData.speaking = data.speaking;
      if (data.writing !== undefined) updateData.writing = data.writing;
      if (data.listening !== undefined) updateData.listening = data.listening;
      updateData.updatedAt = new Date();
      
      // Use Prisma upsert to either create or update
      const userStatus = await prisma.userStatus.upsert({
        where: { userId },
        update: updateData,
        create: {
          id: uuidv4(),
          userId,
          speaking: data.speaking ?? 0,
          writing: data.writing ?? 0,
          listening: data.listening ?? 0,
          updatedAt: new Date()
        }
      });
      
      // Convert Date to string for the DTO
      return {
        ...userStatus,
        updatedAt: userStatus.updatedAt.toISOString()
      } as UserStatusDTO;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  }

  /**
   * Reset user status to zeros
   */
  static async resetUserStatus(userId: string): Promise<UserStatusDTO> {
    try {
      // Use Prisma upsert to reset all scores to zero
      const userStatus = await prisma.userStatus.upsert({
        where: { userId },
        update: {
          speaking: 0,
          writing: 0,
          listening: 0,
          updatedAt: new Date()
        },
        create: {
          id: uuidv4(),
          userId,
          speaking: 0,
          writing: 0,
          listening: 0,
          updatedAt: new Date()
        }
      });
      
      // Convert Date to string for the DTO
      return {
        ...userStatus,
        updatedAt: userStatus.updatedAt.toISOString()
      } as UserStatusDTO;
    } catch (error) {
      console.error('Error resetting user status:', error);
      throw new Error('Failed to reset user status');
    }
  }
}
