import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUserById } from '../services/userService.js';
import { v4 as uuidv4 } from 'uuid';
import { RoomServiceClient, CreateOptions } from 'livekit-server-sdk';
import axios from 'axios';

const prisma = new PrismaClient();

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        
        // Fetch user from database using the same service function as getUserInfo
        const user = await getUserById(userId);
        
        // Check if user exists
        if (!user) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        // Return user profile data in the same format as the existing API
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

// Get user skills by user ID
export const getUserSkills = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        try {
            // Fetch user's topics (as skills)
            const userTopics = await prisma.topic.findMany({
                where: {
                    userTopics: {
                        some: {
                            id: userId
                        }
                    }
                },
                select: {
                    id: true,
                    topicName: true
                }
            });
            
            // Fetch user's words (as vocabulary skills)
            const userWords = await prisma.word.findMany({
                where: {
                    userWords: {
                        some: {
                            id: userId
                        }
                    }
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
                    userInterests: {
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
            const responseStatus = res.status(200);
            void responseStatus.json({
                success: true,
                data: skillScores,
                details: {
                    topics: userTopics,
                    vocabulary: userWords,
                    interests: userInterests
                }
            });
            return;
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
            
            res.status(200).json({
                success: true,
                data: fallbackSkills,
                fallback: true
            });
            return;
        }
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
        return;
    }
};

// New controller function
export const startAiSessionController = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore 
    const authenticatedUserId = req.user?.userId;
    // @ts-ignore
    const userToken = req.user?.token; 

    if (!authenticatedUserId) {
        console.error('[startAiSessionController] User not authenticated or user ID missing from token payload');
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return; // Added return to stop execution
    }
    
    if (!userToken) {
        console.warn('[startAiSessionController] User token not found in req.user. Authorization header to webrtc-token-service will be empty or not sent.');
    }

    const livekitHost = process.env.LIVEKIT_URL;
    const livekitApiKey = process.env.LIVEKIT_API_KEY;
    const livekitApiSecret = process.env.LIVEKIT_API_SECRET;
    const tokenServiceUrl = process.env.WEBRTC_TOKEN_SERVICE_URL || 'http://localhost:3002/api/token'; 

    if (!livekitHost || !livekitApiKey || !livekitApiSecret) {
        console.error('[startAiSessionController] LiveKit environment variables (LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET) not fully configured in pronity-backend.');
        res.status(500).json({ success: false, message: 'Server misconfiguration: LiveKit credentials missing.' });
            return;
    }
    if (!process.env.WEBRTC_TOKEN_SERVICE_URL) {
        console.warn(`[startAiSessionController] WEBRTC_TOKEN_SERVICE_URL not set in .env, defaulting to ${tokenServiceUrl}. Ensure this is correct for your environment.`);
    }

    try {
        const roomName = `rox-session-${authenticatedUserId}-${uuidv4().substring(0, 8)}`;
        const participantIdentity = `student-${authenticatedUserId}`;

        const roomServiceClient = new RoomServiceClient(livekitHost, livekitApiKey, livekitApiSecret);

        const roomOptions: CreateOptions = {
            name: roomName,
            emptyTimeout: 300, // 5 minutes in seconds
            maxParticipants: 2, 
            metadata: JSON.stringify({
                user_id: authenticatedUserId,
                // agent_dispatch_criteria: "rox_tutor_session", // Example metadata for agent framework
            })
        };
        
        console.log(`[startAiSessionController] Creating LiveKit room: ${roomName} with metadata: ${roomOptions.metadata}`);
        const room = await roomServiceClient.createRoom(roomOptions);
        console.log(`[startAiSessionController] LiveKit room ${room.name} created successfully.`);

        console.log(`[startAiSessionController] Requesting token from webrtc-token-service (${tokenServiceUrl}) for room: ${roomName}, identity: ${participantIdentity}`);
        
        const tokenServiceRequestPayload = {
            room_name: roomName,
            participant_identity: participantIdentity,
            User_id: authenticatedUserId, 
            participant_name: `Student ${authenticatedUserId.substring(0,5)}` // Example name
        };

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...(userToken && { 'Authorization': `Bearer ${userToken}` })
            }
        };

        const tokenServiceResponse = await axios.post(tokenServiceUrl, tokenServiceRequestPayload, axiosConfig);
        
        const studentLiveKitToken = tokenServiceResponse.data.token; 
        const clientLiveKitWsUrl = process.env.LIVEKIT_WS_URL || livekitHost; 

        if (!studentLiveKitToken) {
            console.error('[startAiSessionController] Failed to get student token from webrtc-token-service. Response:', tokenServiceResponse.data);
            res.status(500).json({ success: false, message: 'Failed to retrieve student LiveKit token.' });
        }
        console.log(`[startAiSessionController] Student LiveKit token received for room ${roomName}.`);

        res.status(200).json({
            success: true,
            roomName: roomName,
            studentToken: studentLiveKitToken,
            livekitUrl: clientLiveKitWsUrl 
        });

    } catch (error: any) {
        console.error(`[startAiSessionController] Error starting AI session for user ${authenticatedUserId}: ${error.message}`);
        if (axios.isAxiosError(error)) {
            console.error('[startAiSessionController] Axios error details:', {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                data: error.response?.data,
            });
            res.status(error.response?.status || 500).json({ 
                success: false, 
                message: 'Failed to communicate with token service.',
                details: error.response?.data || error.message
            });
            return;
        }
        if (error.message && (error.message.toLowerCase().includes('livekit') || error.constructor?.name?.toLowerCase().includes('livekit'))) { 
             console.error('[startAiSessionController] LiveKit SDK error:', error);
             res.status(500).json({ success: false, message: 'LiveKit operation failed.', details: error.message });
             return;
        }
        res.status(500).json({ success: false, message: 'Internal server error while starting AI session.', details: error.message });
        return;
    }
};
