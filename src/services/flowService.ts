import { PrismaClient } from "@prisma/client";
import UserDTO from "../models/UserDTO.js";
import FlowDTO from "../models/FlowDTO.js";
import { Components } from "../types/FlowPayload.js";

interface FlowElementPayload {
  type: string;
  task: string;
  topic: string;
  level: string;
}

export const generateFlow = async (user: UserDTO) => {
  const prisma = new PrismaClient();
};

export const saveFlow = async (
  userId: string,
  flowElements: FlowElementPayload[],
  analysis: string
) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$transaction(async (tx) => {
      await tx.flowElement.deleteMany({
        where: {
          userId: userId,
        },
      });

      const flowElementsToCreate = flowElements.map((element, index) => ({
        userId: userId,
        type: element.type,
        task: element.task,
        topic: element.topic,
        level: element.level,
        order: index,
      }));

      if (flowElementsToCreate.length > 0) {
        await tx.flowElement.createMany({
          data: flowElementsToCreate,
        });
      }

      await tx.user.update({
        where: { id: userId },
        data: { currentOrder: 0, analysis: analysis },
      });
    });
  } catch (error) {
    console.error("Error saving flow:", error);
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};

export const getFlow = async (user: UserDTO): Promise<FlowDTO> => {
  const prisma = new PrismaClient();
  try {
    const flowElements = await prisma.flowElement.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    if (!flowElements || flowElements.length === 0) {
      throw new Error("No flow elements found for this user");
    }

    const components: Components[] = flowElements.map((element) => ({
      id: element.id,
      type: element.type,
      level: element.level,
      task: element.task,
      topic: element.topic,
    }));

    return {
      last_studied: user.currentOrder,
      components: components,
    };
  } catch (error) {
    console.error("Error getting flow:", error);
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};

export const getNextFlow = async (user: UserDTO): Promise<Components> => {
  const prisma = new PrismaClient();
  try {
    const nextFlowElement = await prisma.$transaction(async (tx) => {
      const element = await tx.flowElement.findFirst({
        where: {
          userId: user.id,
          order: user.currentOrder,
        },
      });

      if (!element) {
        return null;
      }

      await tx.user.update({
        where: { id: user.id },
        data: { currentOrder: { increment: 1 } },
      });

      return element;
    });

    if (!nextFlowElement) {
      throw new Error("End of flow.");
    }

    return {
      id: nextFlowElement.id,
      type: nextFlowElement.type,
      level: nextFlowElement.level,
      task: nextFlowElement.task,
      topic: nextFlowElement.topic,
    };
  } catch (error) {
    console.error("Error getting next flow:", error);
    if (error instanceof Error && error.message === "End of flow.") {
      throw error;
    }
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};

export const showNextFlow = async (user: UserDTO): Promise<Components> => {
  const prisma = new PrismaClient();
  try {
    const nextFlowElement = await prisma.flowElement.findFirst({
      where: {
        userId: user.id,
        order: user.currentOrder,
      },
    });

    if (!nextFlowElement) {
      throw new Error("End of flow.");
    }

    return {
      id: nextFlowElement.id,
      type: nextFlowElement.type,
      level: nextFlowElement.level,
      task: nextFlowElement.task,
      topic: nextFlowElement.topic,
    };
  } catch (error) {
    console.error("Error showing next flow:", error);
    if (error instanceof Error && error.message === "End of flow.") {
      throw error;
    }
    throw new Error("Database error");
  } finally {
    await prisma.$disconnect();
  }
};
