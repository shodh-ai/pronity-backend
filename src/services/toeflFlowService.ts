import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

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

/**
 * Get the user's active flow
 * @param userId The user's ID
 * @returns The active flow or null if none exists
 */
export const getUserActiveFlow = async (userId: string): Promise<TaskFlow | null> => {
  const prisma = new PrismaClient();
  try {
    console.log('Looking for user with ID:', userId);
    
    // First check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log('User not found in database with ID:', userId);
      return null;
    }
    
    console.log('User found:', user.id);
    
    // Query the database for the user's active flow
    const flow = await prisma.flow.findFirst({
      where: {
        user: {
          id: userId
        }
      },
      include: {
        flowComponents: {
          include: {
            component: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!flow) {
      console.log('No active flow found for user');
      return null;
    }
    
    console.log('Found flow:', flow.id);

    // Convert the flow to the TaskFlow interface
    return {
      flowId: flow.id,
      userId,
      sequence: flow.flowComponents.map(fc => fc.componentId),
      currentPosition: flow.lastCompleted,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error getting user active flow:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Create a new flow for the user
 * @param userId The user's ID
 * @param res Express response object
 * @returns The response with the new flow
 */
export const createNewFlow = async (userId: string, res: Response) => {
  const prisma = new PrismaClient();
  try {
    console.log('Creating new flow for user ID:', userId);
    
    // Get user with interests
    let user = await prisma.user.findUnique({ // Changed const to let
      where: { id: userId },
      include: { userInterests: true }
    });

    if (!user) {
      console.log('User not found in database with ID:', userId);
      
      // For testing purposes, let's try to create a basic user if it doesn't exist
      try {
        console.log('Attempting to create a test user with ID:', userId);
        const newUser = await prisma.user.create({
          data: {
            id: userId,
            firstName: 'Test',
            lastName: 'User',
            occupation: 'Student',
            major: 'Computer Science',
            nativeLanguage: 'English'
          }
        });
        user = { ...newUser, userInterests: [] }; // Assign the newly created user with empty interests
        console.log('Created test user:', user.id);
      } catch (createError) {
        console.error('Failed to create test user:', createError);
        return res.status(404).json({ message: 'User not found and could not be created' });
      }
    } else {
      console.log('Found user:', user.id);
    }

    // Extract interest names
    const interests = user.userInterests.map(interest => interest.name.toLowerCase());

    // Find topics that match user interests
    let matchingTopics: any[] = [];
    for (const interest of interests) {
      const topics = await prisma.topic.findMany({
        where: {
          OR: [
            { field: { contains: interest, mode: 'insensitive' } },
            { topicName: { contains: interest, mode: 'insensitive' } }
          ]
        }
      });
      matchingTopics = [...matchingTopics, ...topics];
    }

    // If no matching topics, use default topics
    if (matchingTopics.length === 0) {
      matchingTopics = await prisma.topic.findMany({
        take: 10
      });
    }

    // Create components for the flow
    const components = [];
    for (let i = 0; i < Math.min(10, matchingTopics.length); i++) {
      const component = await prisma.component.create({
        data: {
          type: i % 3 === 0 ? 'reading' : i % 3 === 1 ? 'writing' : 'speaking',
          level: Math.min(3, Math.floor(Math.random() * 3) + 1),
          content: `Task related to ${matchingTopics[i].topicName}`
        }
      });
      components.push(component);
      
      // Add vocabulary component after every 2 regular components
      if (i % 2 === 1) {
        const vocabComponent = await prisma.component.create({
          data: {
            type: 'vocab',
            level: Math.min(3, Math.floor(Math.random() * 3) + 1),
            content: `Vocabulary practice for ${matchingTopics[i].topicName}`
          }
        });
        components.push(vocabComponent);
      }
    }

    // Create new flow
    const newFlow = await prisma.flow.create({
      data: {
        lastCompleted: 0,
        user: {
          connect: {
            id: userId
          }
        }
      }
    });

    // Create flow components
    for (let i = 0; i < components.length; i++) {
      await prisma.flowComponent.create({
        data: {
          flowId: newFlow.id,
          componentId: components[i].id,
          order: i
        }
      });
    }

    // Get the first component
    const firstComponent = components[0];
    
    // Check if it's a vocabulary component
    if (firstComponent.type === 'vocab') {
      // Get vocabulary words for the component
      const words = await getVocabularyWords(userId, 5);
      
      return res.status(200).json({
        currentPosition: 0,
        totalTasks: components.length,
        currentTask: {
          taskId: firstComponent.id,
          title: "Vocabulary Practice",
          description: "Expand your vocabulary with these words",
          taskType: "vocab",
          difficultyLevel: firstComponent.level,
          words
        }
      });
    } else {
      // Get topic for the component
      const topicIndex = 0;
      const topic = matchingTopics[topicIndex];
      
      return res.status(200).json({
        currentPosition: 0,
        totalTasks: components.length,
        currentTask: {
          taskId: firstComponent.id,
          title: `${firstComponent.type.charAt(0).toUpperCase() + firstComponent.type.slice(1)} Practice`,
          description: firstComponent.content || `Practice ${firstComponent.type} with this task`,
          taskType: firstComponent.type,
          difficultyLevel: firstComponent.level,
          topic: {
            topicId: topic.id,
            name: topic.topicName,
            description: topic.field,
            isExamTopic: topic.level > 2
          }
        }
      });
    }
  } catch (error) {
    console.error('Error creating new flow:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Get a task by ID
 * @param taskId The task ID
 * @returns The task or null if not found
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  const prisma = new PrismaClient();
  try {
    const component = await prisma.component.findUnique({
      where: { id: taskId }
    });

    if (!component) return null;

    // Get flow component to determine the topic
    const flowComponent = await prisma.flowComponent.findFirst({
      where: { componentId: taskId },
      include: { flow: true }
    });

    if (!flowComponent) return null;

    // Get a random topic for this task
    const topic = await prisma.topic.findFirst({
      orderBy: { id: 'asc' }
    });

    if (!topic) return null;

    return {
      taskId: component.id,
      title: `${component.type.charAt(0).toUpperCase() + component.type.slice(1)} Practice`,
      description: component.content || `Practice ${component.type} with this task`,
      taskType: component.type,
      difficultyLevel: component.level,
      topicId: topic.id
    };
  } catch (error) {
    console.error('Error getting task by ID:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Get a topic by ID
 * @param topicId The topic ID
 * @returns The topic or null if not found
 */
export const getTopicById = async (topicId: string): Promise<Topic | null> => {
  const prisma = new PrismaClient();
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) return null;

    return {
      topicId: topic.id,
      name: topic.topicName,
      description: topic.field,
      isExamTopic: topic.level > 2
    };
  } catch (error) {
    console.error('Error getting topic by ID:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Get vocabulary words for a user
 * @param userId The user's ID
 * @param count The number of words to retrieve
 * @returns Array of vocabulary words
 */
export const getVocabularyWords = async (userId: string, count: number): Promise<VocabularyWord[]> => {
  const prisma = new PrismaClient();
  try {
    // Get user with interests
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { userInterests: true }
    });

    if (!user) return [];

    // Extract interest names
    const interests = user.userInterests.map(interest => interest.name.toLowerCase());

    // Find topics that match user interests
    let matchingTopics: any[] = [];
    for (const interest of interests) {
      const topics = await prisma.topic.findMany({
        where: {
          OR: [
            { field: { contains: interest, mode: 'insensitive' } },
            { topicName: { contains: interest, mode: 'insensitive' } }
          ]
        }
      });
      matchingTopics = [...matchingTopics, ...topics];
    }

    // If no matching topics, use default topics
    if (matchingTopics.length === 0) {
      matchingTopics = await prisma.topic.findMany({
        take: 10
      });
    }

    // Get words the user hasn't seen yet
    // This is a simplified implementation since we don't have a Word model that matches our needs
    // In a real implementation, we would query a vocabulary_words table
    
    // Create mock vocabulary words based on topics
    const words: VocabularyWord[] = [];
    for (let i = 0; i < Math.min(count, matchingTopics.length); i++) {
      const topic = matchingTopics[i];
      words.push({
        wordId: `word_${i}_${Date.now()}`,
        word: `Term${i+1}`,
        definition: `Definition for term related to ${topic.topicName}`,
        exampleSentence: `This is an example sentence using Term${i+1} in the context of ${topic.topicName}.`,
        difficultyLevel: Math.min(3, Math.floor(Math.random() * 3) + 1),
        topicId: topic.id,
        topic: {
          topicId: topic.id,
          name: topic.topicName,
          description: topic.field,
          isExamTopic: topic.level > 2
        }
      });
    }

    return words;
  } catch (error) {
    console.error('Error getting vocabulary words:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Update the position of a flow
 * @param flowId The flow ID
 * @param newPosition The new position
 * @returns True if successful, false otherwise
 */
export const updateFlowPosition = async (flowId: string, newPosition: number): Promise<boolean> => {
  const prisma = new PrismaClient();
  try {
    await prisma.flow.update({
      where: { id: flowId },
      data: {
        lastCompleted: newPosition
      }
    });
    return true;
  } catch (error) {
    console.error('Error updating flow position:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
};
