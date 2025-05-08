import { PrismaClient } from '@prisma/client';
import UserDTO from "../models/UserDTO.js";

export const getUserById = async (userId: string): Promise<UserDTO | null> => {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                userInterests: true
            }
        });
        if (!user) {
            return null;
        }
        
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            occupation: user.occupation,
            major: user.major,
            nativeLanguage: user.nativeLanguage,
            flow: user.flowId || 'null',
            interests: user.userInterests.map(userInterest => userInterest.name || ''),
            createdAt: user.createdAt
        };
    } catch (error) {
        console.error('Error finding user by id:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}

export const addUserDetails = async (userId: string, firstName: string, lastName: string, occupation: string, major: string, nativeLanguage: string, interests: string[]): Promise<UserDTO> => {
    const prisma = new PrismaClient();
    try {
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                firstName,
                lastName,
                occupation,
                major,
                nativeLanguage,
                userInterests: {
                    connect: interests.map(interestId => ({ id: interestId }))
                }
            }
        });
        
        const userWithInterests = await prisma.user.findUnique({
            where: { id: newUser.id },
            include: { userInterests: true }
        });
        
        if (!userWithInterests) {
            throw new Error('User was created but could not be retrieved');
        }
        
        return {
            id: userWithInterests.id,
            firstName: userWithInterests.firstName,
            lastName: userWithInterests.lastName,
            occupation: userWithInterests.occupation,
            major: userWithInterests.major,
            nativeLanguage: userWithInterests.nativeLanguage,
            flow: userWithInterests.flowId || 'null',
            interests: userWithInterests.userInterests.map(userInterest => userInterest.name || ''),
            createdAt: userWithInterests.createdAt
        };
    } catch (error) {
        console.error('Error adding user details:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}