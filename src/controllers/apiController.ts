import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUserById } from '../services/userService.js';

const prisma = new PrismaClient();

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Fetch user from database using the same service function as getUserInfo
        const user = await getUserById(userId);
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Return user profile data in the same format as the existing API
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Get user skills by user ID
export const getUserSkills = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        try {
            // Fetch user's topics (as skills)
            const userTopics = await prisma.topic.findMany({
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                },
                select: {
                    id: true,
                    title: true,
                    description: true
                }
            });
            
            // Fetch user's words (as vocabulary skills)
            const userWords = await prisma.word.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    word: true,
                    meaning: true
                }
            });
            
            // Fetch user's interests (as additional skills)
            const userInterests = await prisma.interest.findMany({
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    }
                },
                select: {
                    id: true,
                    name: true
                }
            });
            
            // Calculate skill scores based on the data we have
            // For the Python client, we need to format the skills in a specific way
            const skillScores = {
                speaking_fluency: userTopics.length > 0 ? Math.min(5, Math.max(1, Math.floor(userTopics.length / 2) + 2)) : 3,
                speaking_coherence: userWords.length > 0 ? Math.min(5, Math.max(1, Math.floor(userWords.length / 10) + 2)) : 3,
                speaking_vocabulary: userWords.length > 0 ? Math.min(5, Math.max(1, Math.floor(userWords.length / 5) + 1)) : 3,
                speaking_grammar: 3, // Default value since we don't have grammar data
                speaking_pronunciation: 3, // Default value since we don't have pronunciation data
            };
            
            // Return both the detailed skills data and the formatted scores
            return res.status(200).json({
                success: true,
                data: skillScores,
                details: {
                    topics: userTopics,
                    vocabulary: userWords,
                    interests: userInterests
                }
            });
        } catch (dbError) {
            console.error('Database query error:', dbError);
            
            // Fallback data that matches the Python client's expectations
            const fallbackSkills = {
                speaking_fluency: 3,
                speaking_coherence: 3,
                speaking_vocabulary: 3,
                speaking_grammar: 3,
                speaking_pronunciation: 3
            };
            
            return res.status(200).json({
                success: true,
                data: fallbackSkills,
                fallback: true
            });
        }
    } catch (error) {
        console.error('Error fetching user skills:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};
