export interface SpeakingPractice {
  id: string;
  userId: string;
  questionText: string;
  transcription: string;
  duration: number;
  practiceDate: string;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mock implementation for development since we don't have Sequelize setup
export const SpeakingPractice = {
  // Mock database for storing speaking practices
  practices: [] as SpeakingPractice[],
  
  // Create a new speaking practice
  create: async (practice: Omit<SpeakingPractice, 'id'> & { id: string }): Promise<SpeakingPractice> => {
    const newPractice = { ...practice };
    SpeakingPractice.practices.push(newPractice);
    return newPractice;
  },
  
  // Find a speaking practice by ID
  findOne: async ({ where }: { where: { id: string } }): Promise<SpeakingPractice | null> => {
    const practice = SpeakingPractice.practices.find(p => p.id === where.id);
    return practice || null;
  },
  
  // Update a speaking practice
  update: async (practice: Partial<SpeakingPractice>): Promise<void> => {
    const index = SpeakingPractice.practices.findIndex(p => p.id === practice.id);
    if (index !== -1) {
      SpeakingPractice.practices[index] = { 
        ...SpeakingPractice.practices[index], 
        ...practice,
        updatedAt: new Date().toISOString()
      };
    }
  }
};
