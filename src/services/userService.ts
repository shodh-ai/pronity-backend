import { PrismaClient } from "@prisma/client";
import UserDTO from "../models/UserDTO.js";

export const getUserById = async (userId: string): Promise<UserDTO | null> => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      goal: user.goal,
      feeling: user.feeling,
      confidence: user.confidence,
      analysis: user.analysis,
      currentOrder: user.currentOrder,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};

export const addUserDetails = async (
  userId: string,
  name: string,
  goal: string,
  feeling: string,
  confidence: string,
  analysis: string
): Promise<UserDTO> => {
  const prisma = new PrismaClient();
  try {
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        name,
        goal,
        feeling,
        confidence,
        analysis,
        currentOrder: 0,
      },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      goal: newUser.goal,
      feeling: newUser.feeling,
      confidence: newUser.confidence,
      analysis: newUser.analysis,
      currentOrder: newUser.currentOrder,
      createdAt: newUser.createdAt,
    };
  } catch (error) {
    console.error("Error adding user details:", error);
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};
