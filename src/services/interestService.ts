import { PrismaClient } from "@prisma/client";
import InterestDTO from "../models/InterestDTO.js";

export const getAllInterests = async (): Promise<InterestDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const interests = await prisma.interest.findMany();
        return interests as InterestDTO[];
    } catch (error) {
        console.error('Error fetching interests:', error);
        throw new Error('Database error');
    }
}

export const addInterest = async (interestName: string): Promise<InterestDTO> => {
    const prisma = new PrismaClient();
    try {
        const newInterest = await prisma.interest.create({
            data: {
                name: interestName
            }
        });
        return newInterest as InterestDTO;
    } catch (error) {
        console.error('Error adding interest:', error);
        throw new Error('Database error');
    }
}

export const deleteInterest = async (interestName: string): Promise<InterestDTO> => {
    const prisma = new PrismaClient();
    try {
        const interest = await prisma.interest.findFirst({
            where: {
                name: interestName
            }
        });
        if (!interest) {
            throw new Error('Interest not found');
        }
        const deletedInterest = await prisma.interest.delete({
            where: {
                id: interest.id
            }
        });
        return deletedInterest as InterestDTO;
    } catch (error) {
        console.error('Error deleting interest:', error);
        throw new Error('Database error');
    }
}
