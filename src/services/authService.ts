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

export const registerUser = async (userEmail: string, userHashPassword: string): Promise<AuthDTO> => {
    const prisma = new PrismaClient();
    try {
        const newUser = await prisma.auth.create({
            data: {
                email: userEmail,
                password: userHashPassword
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        return newUser as AuthDTO;
    } catch (error) {
        console.error('Error registering user:', error);
        throw new Error('Database error');
    }
}