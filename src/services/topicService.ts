import TopicDTO from "../models/TopicDTO.js";
import UserDTO from "../models/UserDTO.js";
import { PrismaClient } from "@prisma/client";
import generateMockTopics from "../utils/mockTopicGenerator.js";

export const generateUserTopics = async (user: UserDTO) => {
    const prisma = new PrismaClient();
    try {
        const allTopics = await getAllTopics();
        const mockTopics = generateMockTopics(user, allTopics);
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                userTopics: {
                    connect: mockTopics.map((topic) => ({ id: topic.id }))
                }
            }
        });
        return updatedUser;
    } catch (error) {
        console.error('Error generating user topics:', error);
        throw new Error('Database error');
    }
}

export const getUserTopics = async (user: UserDTO): Promise<TopicDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const UserTopics = await prisma.user.findUnique(
            {
                where:
                {
                    id: user.id
                },
                include:
                {
                    userTopics: true
                }
            }
        )
        if (!UserTopics) {
            throw new Error('User not found');
        }
        return UserTopics.userTopics.map((topic) => ({
            id: topic.id,
            field: topic.field,
            topicName: topic.topicName,
            level: topic.level
        })) as TopicDTO[];
    } catch (error) {
        console.error('Error getting user topics:', error);
        throw new Error('Database error');
    }
}

export const getPractiseTopic = async (user: UserDTO): Promise<TopicDTO> => {
    var all_topics = await getAllTopics();
    const user_topics = await getUserTopics(user);
    all_topics = all_topics.filter(topic => !user_topics.some(ut => ut.id === topic.id));
    const randomValue = Math.random();
    if (randomValue > 0.8){
        const index = Math.floor(Math.random() * all_topics.length);
        return all_topics[index];
    }
    const index = Math.floor(Math.random() * user_topics.length);
    return user_topics[index];
}

export const addTopic = async (topicName: string, topicField: string, level: number): Promise<TopicDTO> => {
    const prisma = new PrismaClient();
    try {
        const topic = await prisma.topic.create({
            data: {
                topicName: topicName,
                field: topicField,
                level: level
            }
        });
        return topic as TopicDTO;
    } catch (error) {
        console.error('Error adding topic:', error);
        throw new Error('Database error');
    }
}

export const getAllTopics = async (): Promise<TopicDTO[]> => {
    const prisma = new PrismaClient();
    try {
        const topics = await prisma.topic.findMany();
        return topics as TopicDTO[];
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw new Error('Database error');
    }
}

export const deleteTopic = async (topicName: string): Promise<TopicDTO> => {
    const prisma = new PrismaClient();
    try {
        const topicIdentifier = await prisma.topic.findFirst({
            where: {
                topicName: topicName
            }
        });
        if (!topicIdentifier) {
            throw new Error('Topic not found');
        }
        const topic = await prisma.topic.delete({
            where: {
                id: topicIdentifier.id
            }
        });
        return topic as TopicDTO;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw new Error('Database error');
    }
}
