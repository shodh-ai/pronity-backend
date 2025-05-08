import { PrismaClient } from "@prisma/client";
import NotesPayload from "../types/NotesPayload.js";
import NotesDTO from "../models/NotesDTO.js";


export const addNote = async (userId: string, note: NotesPayload) => {
    const prisma = new PrismaClient();
    try {
        const newNote = await prisma.note.create({
            data: {
                userId,
                ...note,
            },
        });
        return newNote;
    } catch (error) {
        console.error("Error adding note:", error);
        throw new Error("Database error");
    }
}

export const getNotes = async (userId: string): Promise<NotesDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const notes = await prisma.note.findMany({
            where: {
                userId,
            },
        });
        return notes.map(note => ({
            id: note.id,
            userId: note.userId,
            heading: note.heading,
            content: note.content,
            createdAt: note.date,
        }));
    } catch (error) {
        console.error("Error getting notes:", error);
        throw new Error("Database error");
    }
}