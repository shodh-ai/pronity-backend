import { PrismaClient } from "@prisma/client";
import WordPayload from "../types/WordPayload.js";
import WordDTO from "../models/WordDTO.js";

export const addWord = async (data: WordPayload): Promise<WordDTO> => {
    const prisma = new PrismaClient();
    try {
        const newWord = await prisma.word.create({
            data: {
                ...data,
            },
        });
        return newWord as WordDTO;
    } catch (error) {
        console.error("Error adding word:", error);
        throw new Error("Database error");
    }
}

export const getAllWords = async (): Promise<WordDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const words = await prisma.word.findMany();
        return words as WordDTO[];
    } catch (error) {
        console.error("Error fetching words:", error);
        throw new Error("Database error");
    }
}

export const deleteWord = async (word: string): Promise<WordDTO> => {
    const prisma = new PrismaClient();
    try {
        const wordPointer = await prisma.word.findFirst({
            where: {
                word,
            },
        });
        if (!wordPointer) {
            throw new Error("Word not found");
        }
        const deletedWord = await prisma.word.delete({
            where: {
                id: wordPointer.id,
            },
        });
        return deletedWord as WordDTO;
    } catch (error) {
        console.error("Error deleting word:", error);
        throw new Error("Database error");
    }
}

export const getUserWords = async (userId: string): Promise<WordDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                userWords: true
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user.userWords as WordDTO[];
    } catch (error) {
        console.error("Error getting user words:", error);
        throw new Error("Database error");
    } finally {
        await prisma.$disconnect();
    }
}

export const learnNewWord = async (userId: string): Promise<WordDTO | null> => {
    const prisma = new PrismaClient();
    try {
        const allWords = await getAllWords();
        
        const userWords = await getUserWords(userId);

        const newWords = allWords.filter((word) => !userWords.some((userWord) => userWord.id === word.id));

        if (newWords.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * newWords.length);
        const wordToLearn = newWords[randomIndex];

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                userWords: {
                    connect: {
                        id: wordToLearn.id
                    }
                }
            }
        });

        return wordToLearn as WordDTO;
    } catch (error) {
        console.error("Error learning new word:", error);
        throw new Error("Database error");
    } finally {
        await prisma.$disconnect();
    }
}