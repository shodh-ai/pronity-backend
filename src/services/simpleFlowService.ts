import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

// Simple mock data for testing
const mockTopics = [
  { id: 'topic1', topicName: 'Computer Science', field: 'Technology', level: 2 },
  { id: 'topic2', topicName: 'Mathematics', field: 'Science', level: 1 },
  { id: 'topic3', topicName: 'Physics', field: 'Science', level: 3 }
];

const mockComponents = [
  // Speaking task first to prioritize testing with letsspeak page
  { id: 'comp3', type: 'speaking', level: 3, content: 'Speaking practice for Physics' },
  { id: 'comp1', type: 'reading', level: 1, content: 'Reading practice for Computer Science' },
  { id: 'comp2', type: 'writing', level: 2, content: 'Writing practice for Mathematics' },
  { id: 'vocab1', type: 'vocab', level: 1, content: 'Vocabulary practice for Computer Science' }
];

// In-memory store to track user positions (in a real app, this would be in a database)
const userPositions: Record<string, number> = {};

/**
 * Get the current task flow for a user
 */
export const getTaskFlow = async (userId: string, res: Response) => {
  try {
    console.log('Getting task flow for user:', userId);
    
    // Skip database check for testing purposes
    console.log('Using mock data for user:', userId);
    
    // Initialize position if not already set
    if (userPositions[userId] === undefined) {
      userPositions[userId] = 0;
    }
    
    const position = userPositions[userId];
    console.log(`Current position for user ${userId}: ${position}`);
    
    // Get the current component based on position
    const componentIndex = position % mockComponents.length;
    const component = mockComponents[componentIndex];
    const topicIndex = componentIndex % mockTopics.length;
    const topic = mockTopics[topicIndex];
    
    // Return the current task flow
    return res.status(200).json({
      currentPosition: position,
      totalTasks: mockComponents.length,
      currentTask: {
        taskId: component.id,
        title: `${component.type.charAt(0).toUpperCase() + component.type.slice(1)} Practice`,
        description: component.content,
        taskType: component.type,
        difficultyLevel: component.level,
        topic: {
          topicId: topic.id,
          name: topic.topicName,
          description: topic.field,
          isExamTopic: topic.level > 2
        }
      }
    });
  } catch (error) {
    console.error('Error in getTaskFlow:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Move to the next task in the flow
 */
export const nextTask = async (userId: string, res: Response) => {
  try {
    console.log('Moving to next task for user:', userId);
    
    // Skip database check for testing purposes
    console.log('Using mock data for user:', userId);
    
    // Initialize position if not already set
    if (userPositions[userId] === undefined) {
      userPositions[userId] = 0;
    }
    
    // Increment the position
    userPositions[userId] = (userPositions[userId] + 1) % mockComponents.length;
    const position = userPositions[userId];
    
    console.log(`New position for user ${userId}: ${position}`);
    
    // Get the next component based on the updated position
    const componentIndex = position;
    const component = mockComponents[componentIndex];
    const topicIndex = componentIndex % mockTopics.length;
    const topic = mockTopics[topicIndex];
    
    // Return the next task flow
    return res.status(200).json({
      currentPosition: position,
      totalTasks: mockComponents.length,
      currentTask: {
        taskId: component.id,
        title: `${component.type.charAt(0).toUpperCase() + component.type.slice(1)} Practice`,
        description: component.content,
        taskType: component.type,
        difficultyLevel: component.level,
        topic: {
          topicId: topic.id,
          name: topic.topicName,
          description: topic.field,
          isExamTopic: topic.level > 2
        }
      }
    });
  } catch (error) {
    console.error('Error in nextTask:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
