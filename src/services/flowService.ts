import { PrismaClient } from '@prisma/client';
import UserDTO from '../models/UserDTO.js';
import generateMockFlow from '../utils/mockFlowGenerator.js';
import FlowDTO from '../models/FlowDTO.js';
import { Components } from '../types/FlowPayload.js';

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
        const nextFlowComponents = await prisma.flowComponent.findMany({
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
        if (nextFlowComponents.length > 0) {
            const updatedFlow = await prisma.flow.update({
                where:{
                    id:flow.id
                },
                data:{
                    lastCompleted:lastCompleted+1
                }
            })
            return nextFlowComponents[0].component;
        }
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
        if (currentFlowComponents.length > 0) {
            return currentFlowComponents[0].component;
        }
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

        return firstFlowComponents[0].component;
    } catch (error) {
        console.error('Error getting next flow component:', error);
        throw new Error('Database error');
    } finally {
        await prisma.$disconnect();
    }
}