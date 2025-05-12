import AuthDTO from "../models/AuthDTO.js";
import { PrismaClient } from '@prisma/client';

export const findUserByEmail = async (email: string): Promise<AuthDTO | null> => {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.auth.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true
            }
        })
        if (!user) {
            return null;
        }
        return user as AuthDTO;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new Error('Database error');
    }
}

export const registerUser = async (email: string, password: string, name?: string): Promise<AuthDTO> => {
    const prisma = new PrismaClient();
    try {
        console.log('Creating auth record with email:', email);
        const newUser = await prisma.$transaction(async (tx) => {
            // First create the Auth record
            const auth = await tx.auth.create({
                data: {
                    email,
                    password,
                },
            });
            console.log('Auth record created with ID:', auth.id);
            
            // Parse name into firstName and lastName if provided
            let firstName = 'New';
            let lastName = 'User';
            
            if (name) {
                const nameParts = name.trim().split(' ');
                firstName = nameParts[0] || 'New';
                lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
            } else if (email) {
                // Use email username as first name if no name provided
                firstName = email.split('@')[0] || 'New';
            }
            
            // Then create a corresponding User record with the same ID
            const user = await tx.user.create({
                data: {
                    id: auth.id, // Use the same ID as the Auth record
                    firstName,
                    lastName,
                    occupation: 'Student',
                    major: 'English',
                    nativeLanguage: 'English'
                },
            });
            console.log('User record created with ID:', user.id);
            
            return auth;
        });
        
        return newUser;
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}