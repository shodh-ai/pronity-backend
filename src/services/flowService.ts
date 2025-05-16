import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import UserDTO from '../models/userDTO.js';
import generateMockFlow from '../utils/mockFlowGenerator.js';
import FlowDTO from '../models/FlowDTO.js';
import { Components } from '../types/FlowPayload.js';

// Interface for task flow structure
interface TaskFlow {
  flowId: string;
  userId: string;
  sequence: string[];
  currentPosition: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for task structure
interface Task {
  taskId: string;
  title: string;
  description: string;
  taskType: string;
  difficultyLevel: number;
  topicId: string;
  progress?: {
    completed: boolean;
    completedAt: string | null;
    score: number | null;
  };
}

// Interface for topic structure
interface Topic {
  topicId: string;
  name: string;
  description: string;
  isExamTopic?: boolean;
}

// Interface for vocabulary word structure
interface VocabularyWord {
  wordId: string;
  word: string;
  definition: string;
  exampleSentence: string;
  difficultyLevel: number;
  topicId: string;
  topic?: Topic;
}

export const generateFlow = async (user: UserDTO) => {
    const prisma = new PrismaClient();
    try {
        const flowComponents = generateMockFlow(user);
        
        const flowData = await prisma.flow.create({
            data: {
                lastCompleted: 0,
                user: {
                    connect: {
                        id: user.id
                    }
                }
            }
        });
        
        for (let i = 0; i < flowComponents.length; i++) {
            const componentData = flowComponents[i];
            
            const component = await prisma.component.create({
                data: {
                    type: componentData.type,
                    level: componentData.level
                }
            });
            
            await prisma.flowComponent.create({
                data: {
                    flowId: flowData.id,
                    componentId: component.id,
                    order: i
                }
            });
        }
        
        const updatedUser = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                flow: true
            }
        });
        
        return updatedUser;
    } catch (error) {
        console.error('Error generating flow:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}

export const getFlow = async (user: UserDTO): Promise<FlowDTO> => {
    const prisma = new PrismaClient();
    try {
        // Check if user has a flow ID and it's not 'null'
        if (!user.flow || user.flow === 'null') {
            throw new Error('User does not have a flow');
        }

        const flow = await prisma.flow.findUnique({
            where: {
                id: user.flow
            }
        });

        if (!flow) {
            throw new Error('Flow not found');
        }

        const flowComponents = await prisma.flowComponent.findMany({
            where: {
                flowId: flow.id
            },
            include: {
                component: true
            },
            orderBy: {
                order: 'asc'
            }
        });
        
        return {
            last_studied: flow.lastCompleted,
            components: flowComponents.map(fc => fc.component)
        };
    } catch (error) {
        console.error('Error getting flow:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}

export const getNextFlow = async (user:UserDTO): Promise<Components> => {
    const prisma = new PrismaClient();
    try {
        if (!user.flow || user.flow === 'null') {
            throw new Error('User does not have a flow');
        }

        const flow = await prisma.flow.findUnique({
            where: {
                id: user.flow
            }
        });

        if (!flow) {
            throw new Error('Flow not found');
        }

        const lastCompleted = flow.lastCompleted;
        // Get the next component in the flow (with order > lastCompleted)
        const nextFlowComponents = await prisma.flowComponent.findMany({
            where: {
                flowId: flow.id,
                order: {
                    gt: lastCompleted  // Ensure we're getting the next component
                }
            },
            include: {
                component: true
            },
            orderBy: {
                order: 'asc'  // Order by ascending to get the next component
            },
            take: 1  // Only take the first matching component
        });
        
        console.log('Found next flow components:', nextFlowComponents.length > 0 ? 'Yes' : 'No');
        if (nextFlowComponents.length > 0) {
            // Update the flow to move to the next component
            const updatedFlow = await prisma.flow.update({
                where:{
                    id:flow.id
                },
                data:{
                    lastCompleted:lastCompleted+1
                }
            });
            
            console.log('Moving to next component:', nextFlowComponents[0].component.id);
            return nextFlowComponents[0].component;
        }
        // If no next component found, get the current component
        console.log('No next component found, retrieving current component at position:', lastCompleted);
        const currentFlowComponents = await prisma.flowComponent.findMany({
            where: {
                flowId: flow.id,
                order: {
                    equals: lastCompleted
                }
            },
            include: {
                component: true
            },
            orderBy: {
                order: 'asc'
            },
            take: 1
        });
        
        console.log('Found current flow components:', currentFlowComponents.length > 0 ? 'Yes' : 'No');
        if (currentFlowComponents.length > 0) {
            return currentFlowComponents[0].component;
        }
        // If no current component found, restart from the beginning
        console.log('No current component found, restarting flow from the beginning');
        const firstFlowComponents = await prisma.flowComponent.findMany({
            where: {
                flowId: flow.id
            },
            include: {
                component: true
            },
            orderBy: {
                order: 'asc'
            },
            take: 1
        });
        
        if (firstFlowComponents.length === 0) {
            throw new Error('No components found in flow');
        }
        
        // Reset the flow position to 0
        await prisma.flow.update({
            where: {
                id: flow.id
            },
            data: {
                lastCompleted: 0
            }
        });
        
        console.log('Flow restarted, returning first component:', firstFlowComponents[0].component.id);

        return firstFlowComponents[0].component;
    } catch (error) {
        console.error('Error getting next flow component:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}