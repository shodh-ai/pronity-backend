import { PrismaClient } from "@prisma/client";
import InterestDTO from "../models/InterestDTO.js";

export const getAllInterests = async (): Promise<InterestDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const interests = await prisma.interest.findMany();
        return interests as InterestDTO[];
    } catch (error) {
        console.error('Error fetching all interests:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}

export const getUserInterests = async (userId: string): Promise<InterestDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { userInterests: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user.userInterests as InterestDTO[];
    } catch (error) {
        console.error('Error fetching user interests:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}

export const addInterest = async (interestName: string, userId: string): Promise<InterestDTO> => {
    const prisma = new PrismaClient();
    console.log(`addInterest called with interestName: ${interestName}, userId: ${userId}`);
    
    try {
        // First check if the user exists
        console.log(`Looking for user with ID: ${userId}`);
        
        // Let's first check if we have any users at all
        const allUsers = await prisma.user.findMany({ take: 5 });
        console.log(`Found ${allUsers.length} users in the database. First few:`, 
            allUsers.map(u => ({ id: u.id })));
            
        // Now try to find the specific user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error(`User with ID ${userId} not found`);
            throw new Error(`User with ID ${userId} not found`);
        }
        console.log(`Found user:`, { id: user.id });

        // Check if the interest already exists
        console.log(`Checking if interest '${interestName}' already exists`);
        let interest = await prisma.interest.findFirst({
            where: { name: interestName }
        });

        // If interest doesn't exist, create it
        if (!interest) {
            console.log(`Interest '${interestName}' doesn't exist, creating it`);
            interest = await prisma.interest.create({
                data: { name: interestName }
            });
            console.log(`Created new interest:`, interest);
        } else {
            console.log(`Found existing interest:`, interest);
        }

        // Connect interest to user if not already connected
        console.log(`Checking if interest is already connected to user`);
        const isAlreadyConnected = await prisma.user.findFirst({
            where: {
                id: userId,
                userInterests: {
                    some: {
                        id: interest.id
                    }
                }
            }
        });

        if (!isAlreadyConnected) {
            console.log(`Connecting interest ${interest.id} to user ${userId}`);
            // Update user to connect with this interest
            try {
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        userInterests: {
                            connect: { id: interest.id }
                        }
                    },
                    include: { userInterests: true }
                });
                console.log(`Successfully connected interest to user. User now has ${updatedUser.userInterests.length} interests`);
            } catch (updateError) {
                console.error(`Error connecting interest to user:`, updateError);
                throw updateError;
            }
        } else {
            console.log(`Interest already connected to user`);
        }

        console.log(`Returning interest:`, interest);
        return interest as InterestDTO;
    } catch (error) {
        console.error('Error adding interest to user:', error);
        // Improve error message with more details
        if (error instanceof Error) {
            throw new Error(`Database error: ${error.message}`);
        } else {
            throw new Error(`Database error: ${String(error)}`);
        }
    } finally {
        await prisma.$disconnect();
    }
}

export const deleteInterest = async (interestId: string, userId: string): Promise<InterestDTO> => {
    const prisma = new PrismaClient();
    try {
        // First check if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { userInterests: true }
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the interest exists
        const interest = await prisma.interest.findUnique({
            where: { id: interestId }
        });

        if (!interest) {
            throw new Error('Interest not found');
        }

        // Disconnect the interest from the user
        await prisma.user.update({
            where: { id: userId },
            data: {
                userInterests: {
                    disconnect: { id: interestId }
                }
            }
        });

        // Return the disconnected interest
        return interest as InterestDTO;

        // Note: We're not deleting the interest from the database
        // just disconnecting it from the user, as other users might be using it
    } catch (error) {
        console.error('Error removing interest from user:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}
