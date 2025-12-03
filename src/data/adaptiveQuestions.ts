// Adaptive Questionnaire - Decision Tree Based Profiling
// Each answer leads to different next questions

export interface AdaptiveOption {
  text: string;
  nextQuestionId: string | null; // null means end of questionnaire
  scores: {
    Explorer?: number;
    Achiever?: number;
    Strategist?: number;
    Practitioner?: number;
  };
  traits?: {
    analytical?: number;
    creative?: number;
    social?: number;
    practical?: number;
    detail_oriented?: number;
    big_picture?: number;
    independent?: number;
    collaborative?: number;
    theoretical?: number;
    experimental?: number;
  };
}

export interface AdaptiveQuestion {
  id: string;
  text: string;
  category: 'learning_style' | 'motivation' | 'behavior' | 'time_management' | 'skill_preference' | 'personality';
  description?: string; // Helper text for user
  options: AdaptiveOption[];
}

// Decision Tree Structure
export const adaptiveQuestionTree: { [key: string]: AdaptiveQuestion } = {
  // START: Learning Style Discovery
  start: {
    id: 'start',
    text: 'How do you prefer to learn new technical concepts?',
    category: 'learning_style',
    description: 'This helps us understand your primary learning style',
    options: [
      {
        text: '📚 Reading documentation and articles',
        nextQuestionId: 'deep_reading',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 2, detail_oriented: 1 }
      },
      {
        text: '🎥 Watching video tutorials',
        nextQuestionId: 'visual_learning',
        scores: { Explorer: 1, Practitioner: 1 },
        traits: { creative: 1, practical: 1 }
      },
      {
        text: '⚡ Building projects immediately',
        nextQuestionId: 'hands_on',
        scores: { Practitioner: 3 },
        traits: { practical: 3, big_picture: 1 }
      },
      {
        text: '👥 Learning with peers/mentors',
        nextQuestionId: 'social_learning',
        scores: { Strategist: 2 },
        traits: { social: 3, creative: 1 }
      }
    ]
  },

  // Branch 1: Deep Reading Path
  deep_reading: {
    id: 'deep_reading',
    text: 'When reading technical content, you tend to...',
    category: 'behavior',
    options: [
      {
        text: 'Read everything thoroughly, take detailed notes',
        nextQuestionId: 'perfectionist_check',
        scores: { Achiever: 2, Strategist: 1 },
        traits: { analytical: 2, detail_oriented: 3 }
      },
      {
        text: 'Skim for key concepts, then deep-dive on important parts',
        nextQuestionId: 'time_management',
        scores: { Strategist: 2, Explorer: 1 },
        traits: { big_picture: 2, analytical: 1 }
      },
      {
        text: 'Read multiple sources to compare approaches',
        nextQuestionId: 'research_depth',
        scores: { Explorer: 3 },
        traits: { analytical: 2, creative: 1 }
      }
    ]
  },

  perfectionist_check: {
    id: 'perfectionist_check',
    text: 'Before starting a project, you need to...',
    category: 'behavior',
    options: [
      {
        text: 'Understand every detail and edge case',
        nextQuestionId: 'motivation_type',
        scores: { Achiever: 3 },
        traits: { detail_oriented: 3, analytical: 2 }
      },
      {
        text: 'Have a solid plan but be flexible',
        nextQuestionId: 'motivation_type',
        scores: { Strategist: 2, Achiever: 1 },
        traits: { big_picture: 2, detail_oriented: 1 }
      },
      {
        text: 'Just enough to get started',
        nextQuestionId: 'motivation_type',
        scores: { Practitioner: 2 },
        traits: { practical: 2, big_picture: 1 }
      }
    ]
  },

  research_depth: {
    id: 'research_depth',
    text: 'When exploring a new technology, you usually...',
    category: 'behavior',
    options: [
      {
        text: 'Try to understand the underlying concepts first',
        nextQuestionId: 'motivation_type',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 3, detail_oriented: 1 }
      },
      {
        text: 'Look for real-world use cases and examples',
        nextQuestionId: 'motivation_type',
        scores: { Strategist: 2 },
        traits: { practical: 2, big_picture: 2 }
      },
      {
        text: 'Explore alternative solutions and compare',
        nextQuestionId: 'motivation_type',
        scores: { Explorer: 3 },
        traits: { creative: 2, analytical: 2 }
      }
    ]
  },

  // Branch 2: Visual Learning Path
  visual_learning: {
    id: 'visual_learning',
    text: 'After watching a tutorial, you typically...',
    category: 'behavior',
    options: [
      {
        text: 'Pause and code along step-by-step',
        nextQuestionId: 'practice_approach',
        scores: { Practitioner: 2, Achiever: 1 },
        traits: { practical: 2, detail_oriented: 1 }
      },
      {
        text: 'Watch completely, then build from scratch',
        nextQuestionId: 'practice_approach',
        scores: { Strategist: 2, Practitioner: 1 },
        traits: { big_picture: 2, practical: 1 }
      },
      {
        text: 'Take notes and create your own version',
        nextQuestionId: 'practice_approach',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { creative: 2, analytical: 1 }
      }
    ]
  },

  practice_approach: {
    id: 'practice_approach',
    text: 'When practicing coding, you prefer...',
    category: 'skill_preference',
    options: [
      {
        text: 'Solving structured problems (LeetCode, HackerRank)',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 3 },
        traits: { analytical: 2, detail_oriented: 2 }
      },
      {
        text: 'Building real projects',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 3 },
        traits: { practical: 3, creative: 1 }
      },
      {
        text: 'Contributing to open source',
        nextQuestionId: 'challenge_response',
        scores: { Strategist: 2, Explorer: 1 },
        traits: { social: 2, creative: 1 }
      },
      {
        text: 'Experimenting with new libraries/frameworks',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 3 },
        traits: { creative: 2, practical: 1 }
      }
    ]
  },

  // Branch 3: Hands-On Path
  hands_on: {
    id: 'hands_on',
    text: 'When starting a new project, you...',
    category: 'behavior',
    options: [
      {
        text: 'Jump in and figure it out as I go',
        nextQuestionId: 'problem_solving',
        scores: { Practitioner: 3 },
        traits: { practical: 3, big_picture: 1 }
      },
      {
        text: 'Make a quick plan, then start building',
        nextQuestionId: 'problem_solving',
        scores: { Strategist: 2, Practitioner: 1 },
        traits: { big_picture: 2, practical: 2 }
      },
      {
        text: 'Research similar projects first',
        nextQuestionId: 'problem_solving',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 2, creative: 1 }
      }
    ]
  },

  problem_solving: {
    id: 'problem_solving',
    text: 'When you encounter a bug, your first instinct is to...',
    category: 'behavior',
    options: [
      {
        text: 'Debug systematically line by line',
        nextQuestionId: 'time_management',
        scores: { Achiever: 2, Strategist: 1 },
        traits: { analytical: 3, detail_oriented: 2 }
      },
      {
        text: 'Google the error message',
        nextQuestionId: 'time_management',
        scores: { Practitioner: 2 },
        traits: { practical: 3 }
      },
      {
        text: 'Reproduce it and understand why it happens',
        nextQuestionId: 'time_management',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 2, detail_oriented: 1 }
      },
      {
        text: 'Ask for help from community/peers',
        nextQuestionId: 'time_management',
        scores: { Strategist: 2 },
        traits: { social: 3, practical: 1 }
      }
    ]
  },

  // Branch 4: Social Learning Path
  social_learning: {
    id: 'social_learning',
    text: 'In group learning settings, you usually...',
    category: 'personality',
    options: [
      {
        text: 'Lead discussions and explain concepts',
        nextQuestionId: 'collaboration_style',
        scores: { Strategist: 3 },
        traits: { social: 3, big_picture: 2 }
      },
      {
        text: 'Listen and ask clarifying questions',
        nextQuestionId: 'collaboration_style',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 2, detail_oriented: 1 }
      },
      {
        text: 'Work on code together',
        nextQuestionId: 'collaboration_style',
        scores: { Practitioner: 2, Strategist: 1 },
        traits: { practical: 2, social: 2 }
      }
    ]
  },

  collaboration_style: {
    id: 'collaboration_style',
    text: 'In team projects, you enjoy...',
    category: 'personality',
    options: [
      {
        text: 'Planning architecture and coordinating',
        nextQuestionId: 'challenge_response',
        scores: { Strategist: 3 },
        traits: { big_picture: 3, social: 2 }
      },
      {
        text: 'Implementing core features',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 2, Practitioner: 1 },
        traits: { practical: 2, detail_oriented: 2 }
      },
      {
        text: 'Exploring new technologies to integrate',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 3 },
        traits: { creative: 3, analytical: 1 }
      }
    ]
  },

  // Common Questions (All Paths Lead Here)
  time_management: {
    id: 'time_management',
    text: 'How do you typically manage your learning time?',
    category: 'time_management',
    options: [
      {
        text: 'Fixed schedule, same time every day',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 2, Strategist: 1 },
        traits: { detail_oriented: 2 }
      },
      {
        text: 'Flexible, whenever I feel motivated',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 2, Practitioner: 1 },
        traits: { creative: 1, practical: 1 }
      },
      {
        text: 'Intensive bursts when I have deadlines',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 2 },
        traits: { practical: 2 }
      },
      {
        text: 'Planned weekly goals',
        nextQuestionId: 'challenge_response',
        scores: { Strategist: 3 },
        traits: { big_picture: 2, detail_oriented: 1 }
      }
    ]
  },

  challenge_response: {
    id: 'challenge_response',
    text: 'When facing a difficult concept, you...',
    category: 'behavior',
    options: [
      {
        text: 'Keep trying until I master it completely',
        nextQuestionId: 'motivation_type',
        scores: { Achiever: 3 },
        traits: { detail_oriented: 2, analytical: 1 }
      },
      {
        text: 'Break it down into smaller parts',
        nextQuestionId: 'motivation_type',
        scores: { Strategist: 3 },
        traits: { big_picture: 2, analytical: 2 }
      },
      {
        text: 'Build something simple to understand it',
        nextQuestionId: 'motivation_type',
        scores: { Practitioner: 3 },
        traits: { practical: 3 }
      },
      {
        text: 'Explore different explanations and approaches',
        nextQuestionId: 'motivation_type',
        scores: { Explorer: 3 },
        traits: { creative: 2, analytical: 1 }
      }
    ]
  },

  motivation_type: {
    id: 'motivation_type',
    text: 'What motivates you most to learn?',
    category: 'motivation',
    options: [
      {
        text: 'Building something useful/innovative',
        nextQuestionId: 'final_goal',
        scores: { Practitioner: 2, Explorer: 1 },
        traits: { practical: 2, creative: 2 }
      },
      {
        text: 'Mastering complex concepts',
        nextQuestionId: 'final_goal',
        scores: { Achiever: 3 },
        traits: { analytical: 3, detail_oriented: 2 }
      },
      {
        text: 'Solving real-world problems',
        nextQuestionId: 'final_goal',
        scores: { Strategist: 3 },
        traits: { big_picture: 3, practical: 1 }
      },
      {
        text: 'Discovering new technologies',
        nextQuestionId: 'final_goal',
        scores: { Explorer: 3 },
        traits: { creative: 3, analytical: 1 }
      }
    ]
  },

  // FINAL Question
  final_goal: {
    id: 'final_goal',
    text: 'What is your primary goal for the next 6 months?',
    category: 'motivation',
    description: 'This is the last question!',
    options: [
      {
        text: 'Get a job/internship',
        nextQuestionId: null, // END
        scores: { Achiever: 2, Practitioner: 1 },
        traits: { practical: 2, detail_oriented: 1 }
      },
      {
        text: 'Build a portfolio project',
        nextQuestionId: null,
        scores: { Practitioner: 2, Strategist: 1 },
        traits: { practical: 3, creative: 1 }
      },
      {
        text: 'Master a specific technology/framework',
        nextQuestionId: null,
        scores: { Achiever: 3 },
        traits: { analytical: 2, detail_oriented: 2 }
      },
      {
        text: 'Explore multiple tech stacks',
        nextQuestionId: null,
        scores: { Explorer: 3 },
        traits: { creative: 2, big_picture: 1 }
      },
      {
        text: 'Contribute to open source/community',
        nextQuestionId: null,
        scores: { Strategist: 2, Explorer: 1 },
        traits: { social: 3, creative: 1 }
      }
    ]
  }
};

// Helper function to get next question
export const getNextQuestion = (questionId: string): AdaptiveQuestion | null => {
  return adaptiveQuestionTree[questionId] || null;
};

// Helper function to calculate final category
export const calculateCategory = (scores: {
  Explorer: number;
  Achiever: number;
  Strategist: number;
  Practitioner: number;
}): string => {
  const entries = Object.entries(scores);
  entries.sort(([, a], [, b]) => b - a);
  return entries[0][0];
};
