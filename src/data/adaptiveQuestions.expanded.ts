// Comprehensive Adaptive Questionnaire - 35+ Questions
// Deep psychological profiling with multi-path decision tree

export interface AdaptiveOption {
  text: string;
  nextQuestionId: string | null;
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
  category: 'learning_style' | 'motivation' | 'behavior' | 'time_management' | 'skill_preference' | 'personality' | 'problem_solving' | 'communication' | 'stress_response';
  description?: string;
  options: AdaptiveOption[];
}

export const adaptiveQuestionTree: { [key: string]: AdaptiveQuestion } = {
  // ===== START =====
  start: {
    id: 'start',
    text: 'How do you prefer to learn new technical concepts?',
    category: 'learning_style',
    description: 'Choose the approach that feels most natural to you',
    options: [
      {
        text: '📚 Reading documentation, books, and articles in-depth',
        nextQuestionId: 'deep_reading',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 3, detail_oriented: 2, theoretical: 2, independent: 1 }
      },
      {
        text: '🎥 Watching video tutorials and online courses',
        nextQuestionId: 'visual_learning',
        scores: { Explorer: 1, Practitioner: 1 },
        traits: { creative: 1, practical: 1, experimental: 1 }
      },
      {
        text: '⚡ Building projects immediately and learning by doing',
        nextQuestionId: 'hands_on',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 2, big_picture: 1, independent: 2 }
      },
      {
        text: '👥 Learning with peers, mentors, or in study groups',
        nextQuestionId: 'social_learning',
        scores: { Strategist: 2 },
        traits: { social: 3, collaborative: 3, creative: 1 }
      }
    ]
  },

  // ===== BRANCH 1: DEEP READING (10 questions deep) =====
  deep_reading: {
    id: 'deep_reading',
    text: 'When reading technical content, you tend to...',
    category: 'behavior',
    options: [
      {
        text: 'Read everything thoroughly from start to finish, taking detailed notes',
        nextQuestionId: 'note_taking_style',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { analytical: 3, detail_oriented: 4, theoretical: 2, independent: 2 }
      },
      {
        text: 'Skim for key concepts first, then deep-dive on important sections',
        nextQuestionId: 'information_processing',
        scores: { Strategist: 3, Explorer: 1 },
        traits: { big_picture: 3, analytical: 2, practical: 1 }
      },
      {
        text: 'Read multiple sources simultaneously to compare different approaches',
        nextQuestionId: 'research_methodology',
        scores: { Explorer: 4 },
        traits: { analytical: 3, creative: 2, theoretical: 2, detail_oriented: 1 }
      },
      {
        text: 'Focus on code examples and practical implementations',
        nextQuestionId: 'code_first_approach',
        scores: { Practitioner: 2, Achiever: 1 },
        traits: { practical: 4, experimental: 2, detail_oriented: 1 }
      }
    ]
  },

  note_taking_style: {
    id: 'note_taking_style',
    text: 'How do you organize your notes and learning materials?',
    category: 'behavior',
    options: [
      {
        text: 'Detailed structured notes with hierarchies, tags, and cross-references',
        nextQuestionId: 'perfectionist_check',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { detail_oriented: 4, analytical: 2, theoretical: 1 }
      },
      {
        text: 'Mind maps and visual diagrams showing connections',
        nextQuestionId: 'visual_thinking',
        scores: { Strategist: 2, Explorer: 2 },
        traits: { big_picture: 3, creative: 3, analytical: 1 }
      },
      {
        text: 'Quick bullet points and code snippets for reference',
        nextQuestionId: 'quick_reference',
        scores: { Practitioner: 2, Achiever: 1 },
        traits: { practical: 3, big_picture: 1, experimental: 1 }
      },
      {
        text: 'Digital bookmarks and highlights, revisit when needed',
        nextQuestionId: 'memory_retention',
        scores: { Explorer: 2 },
        traits: { independent: 2, practical: 1, big_picture: 2 }
      }
    ]
  },

  perfectionist_check: {
    id: 'perfectionist_check',
    text: 'Before starting a coding project, you need to...',
    category: 'behavior',
    options: [
      {
        text: 'Understand every detail, edge case, and potential issue completely',
        nextQuestionId: 'error_handling_philosophy',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3, theoretical: 2 }
      },
      {
        text: 'Have a solid architectural plan but stay flexible for changes',
        nextQuestionId: 'planning_depth',
        scores: { Strategist: 3, Achiever: 1 },
        traits: { big_picture: 3, analytical: 2, detail_oriented: 1 }
      },
      {
        text: 'Understand the core requirements, then figure out the rest while building',
        nextQuestionId: 'iteration_preference',
        scores: { Practitioner: 2, Strategist: 1 },
        traits: { practical: 3, experimental: 2, big_picture: 1 }
      }
    ]
  },

  error_handling_philosophy: {
    id: 'error_handling_philosophy',
    text: 'When writing code, your approach to error handling is...',
    category: 'skill_preference',
    options: [
      {
        text: 'Anticipate every possible error scenario before writing code',
        nextQuestionId: 'code_quality_standards',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3 }
      },
      {
        text: 'Add error handling as issues arise during development',
        nextQuestionId: 'code_quality_standards',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 2 }
      },
      {
        text: 'Design robust error architecture from the start',
        nextQuestionId: 'code_quality_standards',
        scores: { Strategist: 3, Achiever: 1 },
        traits: { big_picture: 3, analytical: 3 }
      }
    ]
  },

  code_quality_standards: {
    id: 'code_quality_standards',
    text: 'For you, "clean code" primarily means...',
    category: 'skill_preference',
    options: [
      {
        text: 'Thoroughly tested with comprehensive unit and integration tests',
        nextQuestionId: 'testing_philosophy',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3 }
      },
      {
        text: 'Well-architected and easy to extend with new features',
        nextQuestionId: 'architecture_priority',
        scores: { Strategist: 4 },
        traits: { big_picture: 4, analytical: 2 }
      },
      {
        text: 'Works reliably and solves the problem efficiently',
        nextQuestionId: 'performance_vs_readability',
        scores: { Practitioner: 3 },
        traits: { practical: 4, experimental: 1 }
      },
      {
        text: 'Self-documenting with clear variable names and comments',
        nextQuestionId: 'documentation_style',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { detail_oriented: 3, analytical: 2 }
      }
    ]
  },

  testing_philosophy: {
    id: 'testing_philosophy',
    text: 'When do you write tests?',
    category: 'skill_preference',
    options: [
      {
        text: 'Before writing code (TDD - Test Driven Development)',
        nextQuestionId: 'time_management',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 4, theoretical: 2 }
      },
      {
        text: 'After core functionality works',
        nextQuestionId: 'time_management',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 2 }
      },
      {
        text: 'Only for critical business logic',
        nextQuestionId: 'time_management',
        scores: { Strategist: 2 },
        traits: { big_picture: 3, practical: 2 }
      },
      {
        text: 'Honestly, not as much as I should',
        nextQuestionId: 'time_management',
        scores: { Practitioner: 2 },
        traits: { practical: 2, experimental: 1 }
      }
    ]
  },

  information_processing: {
    id: 'information_processing',
    text: 'When learning a complex topic, you prefer to...',
    category: 'learning_style',
    options: [
      {
        text: 'Build a mental model of the entire system first',
        nextQuestionId: 'system_thinking',
        scores: { Strategist: 3, Explorer: 1 },
        traits: { big_picture: 4, analytical: 2, theoretical: 2 }
      },
      {
        text: 'Focus on one component at a time, then connect them',
        nextQuestionId: 'component_mastery',
        scores: { Achiever: 2, Practitioner: 1 },
        traits: { detail_oriented: 3, analytical: 2, practical: 1 }
      },
      {
        text: 'Jump between different aspects based on curiosity',
        nextQuestionId: 'curiosity_driven',
        scores: { Explorer: 3 },
        traits: { creative: 3, independent: 2, big_picture: 1 }
      }
    ]
  },

  system_thinking: {
    id: 'system_thinking',
    text: 'When learning system architecture, you focus on...',
    category: 'learning_style',
    options: [
      {
        text: 'How components interact and data flows',
        nextQuestionId: 'challenge_response',
        scores: { Strategist: 3 },
        traits: { big_picture: 4, analytical: 3 }
      },
      {
        text: 'Design patterns and architectural principles',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 2, Explorer: 1 },
        traits: { theoretical: 3, analytical: 3 }
      },
      {
        text: 'Building a working prototype to understand it',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 3 },
        traits: { practical: 4, experimental: 2 }
      }
    ]
  },

  research_methodology: {
    id: 'research_methodology',
    text: 'When exploring a new technology, you usually...',
    category: 'behavior',
    options: [
      {
        text: 'Deep-dive into official documentation and source code',
        nextQuestionId: 'depth_vs_breadth',
        scores: { Explorer: 3, Achiever: 2 },
        traits: { analytical: 4, detail_oriented: 2, theoretical: 3, independent: 2 }
      },
      {
        text: 'Look for real-world use cases, tutorials, and best practices',
        nextQuestionId: 'practical_application',
        scores: { Strategist: 2, Practitioner: 1 },
        traits: { practical: 3, big_picture: 2, experimental: 1 }
      },
      {
        text: 'Compare with alternative solutions and evaluate trade-offs',
        nextQuestionId: 'critical_analysis',
        scores: { Explorer: 3, Strategist: 1 },
        traits: { analytical: 3, creative: 2, big_picture: 2, theoretical: 1 }
      },
      {
        text: 'Build a proof-of-concept immediately to understand it',
        nextQuestionId: 'experiment_first',
        scores: { Practitioner: 3 },
        traits: { experimental: 4, practical: 3, independent: 1 }
      }
    ]
  },

  depth_vs_breadth: {
    id: 'depth_vs_breadth',
    text: 'Would you rather...',
    category: 'skill_preference',
    options: [
      {
        text: 'Master one technology deeply and become an expert',
        nextQuestionId: 'specialization_path',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3, theoretical: 2 }
      },
      {
        text: 'Learn multiple technologies to build full-stack solutions',
        nextQuestionId: 'generalist_approach',
        scores: { Strategist: 3, Practitioner: 1 },
        traits: { big_picture: 4, practical: 2, experimental: 1 }
      },
      {
        text: 'Explore many cutting-edge technologies broadly',
        nextQuestionId: 'innovation_focus',
        scores: { Explorer: 4 },
        traits: { creative: 4, experimental: 3, independent: 2 }
      }
    ]
  },

  code_first_approach: {
    id: 'code_first_approach',
    text: 'When you see a code example, you typically...',
    category: 'behavior',
    options: [
      {
        text: 'Analyze it line-by-line to understand exactly how it works',
        nextQuestionId: 'code_comprehension',
        scores: { Achiever: 2, Explorer: 1 },
        traits: { analytical: 3, detail_oriented: 3, theoretical: 1 }
      },
      {
        text: 'Run it first, then modify to see what changes',
        nextQuestionId: 'experimental_mindset',
        scores: { Practitioner: 3 },
        traits: { experimental: 4, practical: 2, independent: 1 }
      },
      {
        text: 'Try to implement my own version from scratch',
        nextQuestionId: 'reinvention_tendency',
        scores: { Explorer: 2, Practitioner: 1 },
        traits: { creative: 3, independent: 3, experimental: 2 }
      }
    ]
  },

  // ===== BRANCH 2: VISUAL LEARNING (8 questions deep) =====
  visual_learning: {
    id: 'visual_learning',
    text: 'After watching a tutorial, you typically...',
    category: 'behavior',
    options: [
      {
        text: 'Pause frequently and code along step-by-step',
        nextQuestionId: 'follow_along_style',
        scores: { Practitioner: 2, Achiever: 1 },
        traits: { practical: 3, detail_oriented: 2, experimental: 1 }
      },
      {
        text: 'Watch completely first, then build from scratch using memory',
        nextQuestionId: 'memory_based_learning',
        scores: { Strategist: 2, Practitioner: 1 },
        traits: { big_picture: 3, practical: 2, independent: 2 }
      },
      {
        text: 'Take notes and create your own modified version',
        nextQuestionId: 'creative_adaptation',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { creative: 3, analytical: 2, independent: 2 }
      },
      {
        text: 'Rewatch sections and pause to understand the logic deeply',
        nextQuestionId: 'deep_understanding',
        scores: { Achiever: 3 },
        traits: { analytical: 3, detail_oriented: 2, theoretical: 2 }
      }
    ]
  },

  follow_along_style: {
    id: 'follow_along_style',
    text: 'When following a tutorial, how closely do you stick to it?',
    category: 'behavior',
    options: [
      {
        text: 'Follow exactly as shown to ensure it works first',
        nextQuestionId: 'practice_approach',
        scores: { Achiever: 2, Practitioner: 1 },
        traits: { detail_oriented: 3, practical: 2 }
      },
      {
        text: 'Make small modifications to test my understanding',
        nextQuestionId: 'experimentation_level',
        scores: { Practitioner: 2, Explorer: 1 },
        traits: { experimental: 3, practical: 2, creative: 1 }
      },
      {
        text: 'Use it as inspiration, build something different',
        nextQuestionId: 'creative_freedom',
        scores: { Explorer: 3 },
        traits: { creative: 4, independent: 3, experimental: 2 }
      }
    ]
  },

  practice_approach: {
    id: 'practice_approach',
    text: 'For coding practice, you prefer...',
    category: 'skill_preference',
    options: [
      {
        text: 'Structured problem-solving (LeetCode, HackerRank, etc.)',
        nextQuestionId: 'competitive_mindset',
        scores: { Achiever: 4 },
        traits: { analytical: 4, detail_oriented: 3, independent: 2 }
      },
      {
        text: 'Building real-world full-stack projects',
        nextQuestionId: 'project_complexity',
        scores: { Practitioner: 4 },
        traits: { practical: 4, experimental: 2, big_picture: 2 }
      },
      {
        text: 'Contributing to open-source projects',
        nextQuestionId: 'open_source_contribution',
        scores: { Strategist: 3, Explorer: 1 },
        traits: { collaborative: 4, social: 3, creative: 2 }
      },
      {
        text: 'Experimenting with cutting-edge frameworks and libraries',
        nextQuestionId: 'technology_adoption',
        scores: { Explorer: 4 },
        traits: { creative: 4, experimental: 3, analytical: 1 }
      },
      {
        text: 'Reimplementing existing tools to understand them',
        nextQuestionId: 'deep_implementation',
        scores: { Explorer: 2, Achiever: 2 },
        traits: { analytical: 4, theoretical: 3, detail_oriented: 2 }
      }
    ]
  },

  competitive_mindset: {
    id: 'competitive_mindset',
    text: 'When solving coding challenges, you...',
    category: 'personality',
    options: [
      {
        text: 'Aim for optimal solution with best time/space complexity',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 4 },
        traits: { analytical: 4, detail_oriented: 3, theoretical: 2 }
      },
      {
        text: 'Focus on solving it first, then optimize',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 2 }
      },
      {
        text: 'Explore multiple approaches before choosing one',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 3, Strategist: 1 },
        traits: { analytical: 3, creative: 2, theoretical: 1 }
      }
    ]
  },

  // ===== BRANCH 3: HANDS-ON (9 questions deep) =====
  hands_on: {
    id: 'hands_on',
    text: 'When starting a new project, you...',
    category: 'behavior',
    options: [
      {
        text: 'Jump straight into coding and figure it out as I go',
        nextQuestionId: 'discovery_learning',
        scores: { Practitioner: 4 },
        traits: { practical: 4, experimental: 3, independent: 2 }
      },
      {
        text: 'Sketch a quick architecture diagram, then start building',
        nextQuestionId: 'minimal_planning',
        scores: { Strategist: 2, Practitioner: 2 },
        traits: { big_picture: 3, practical: 3, analytical: 1 }
      },
      {
        text: 'Research similar projects to see how others solved it',
        nextQuestionId: 'pattern_recognition',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 3, practical: 2, theoretical: 1 }
      },
      {
        text: 'Create detailed requirements and technical specifications',
        nextQuestionId: 'formal_planning',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { detail_oriented: 4, analytical: 3, big_picture: 1 }
      }
    ]
  },

  discovery_learning: {
    id: 'discovery_learning',
    text: 'When you hit an obstacle while coding, you...',
    category: 'problem_solving',
    options: [
      {
        text: 'Try different approaches until something works',
        nextQuestionId: 'trial_error_comfort',
        scores: { Practitioner: 3 },
        traits: { experimental: 4, practical: 2, independent: 1 }
      },
      {
        text: 'Stop and research the proper way to do it',
        nextQuestionId: 'research_first',
        scores: { Achiever: 2, Explorer: 1 },
        traits: { analytical: 3, detail_oriented: 2, theoretical: 2 }
      },
      {
        text: 'Analyze the error systematically to understand why',
        nextQuestionId: 'debugging_methodology',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { analytical: 4, detail_oriented: 3 }
      },
      {
        text: 'Ask for help or look for similar problems online',
        nextQuestionId: 'collaboration_tendency',
        scores: { Strategist: 2 },
        traits: { social: 3, practical: 2, collaborative: 3 }
      }
    ]
  },

  trial_error_comfort: {
    id: 'trial_error_comfort',
    text: 'Making mistakes while learning makes you feel...',
    category: 'stress_response',
    options: [
      {
        text: 'Frustrated - I prefer to understand before trying',
        nextQuestionId: 'failure_response',
        scores: { Achiever: 3 },
        traits: { detail_oriented: 3, analytical: 2 }
      },
      {
        text: 'Curious - Each error teaches me something new',
        nextQuestionId: 'failure_response',
        scores: { Explorer: 3, Practitioner: 1 },
        traits: { experimental: 4, creative: 2 }
      },
      {
        text: 'Motivated - It shows me what to fix',
        nextQuestionId: 'failure_response',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 2 }
      },
      {
        text: 'Analytical - I study why it failed',
        nextQuestionId: 'failure_response',
        scores: { Achiever: 2, Strategist: 1 },
        traits: { analytical: 4, detail_oriented: 2 }
      }
    ]
  },

  problem_solving: {
    id: 'problem_solving',
    text: 'When encountering a complex bug, your first instinct is...',
    category: 'problem_solving',
    options: [
      {
        text: 'Use debugger and step through code line by line',
        nextQuestionId: 'systematic_debugging',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { analytical: 4, detail_oriented: 4 }
      },
      {
        text: 'Add console logs to trace the data flow',
        nextQuestionId: 'quick_debugging',
        scores: { Practitioner: 2 },
        traits: { practical: 3, experimental: 2 }
      },
      {
        text: 'Google the error message and stack trace',
        nextQuestionId: 'community_resources',
        scores: { Practitioner: 2, Strategist: 1 },
        traits: { practical: 4, social: 1 }
      },
      {
        text: 'Reproduce it in isolation to understand root cause',
        nextQuestionId: 'root_cause_analysis',
        scores: { Explorer: 3, Achiever: 1 },
        traits: { analytical: 4, detail_oriented: 2, theoretical: 2 }
      },
      {
        text: 'Ask team members or online communities',
        nextQuestionId: 'social_problem_solving',
        scores: { Strategist: 3 },
        traits: { social: 4, collaborative: 4, practical: 1 }
      }
    ]
  },

  systematic_debugging: {
    id: 'systematic_debugging',
    text: 'After fixing a bug, you typically...',
    category: 'behavior',
    options: [
      {
        text: 'Write a test to prevent it from happening again',
        nextQuestionId: 'time_management',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3 }
      },
      {
        text: 'Document what caused it and how you fixed it',
        nextQuestionId: 'time_management',
        scores: { Strategist: 3, Achiever: 1 },
        traits: { big_picture: 3, detail_oriented: 2 }
      },
      {
        text: 'Move on to the next task',
        nextQuestionId: 'time_management',
        scores: { Practitioner: 2 },
        traits: { practical: 3 }
      },
      {
        text: 'Refactor related code to avoid similar issues',
        nextQuestionId: 'time_management',
        scores: { Strategist: 2, Achiever: 2 },
        traits: { big_picture: 3, analytical: 2, detail_oriented: 1 }
      }
    ]
  },

  // ===== BRANCH 4: SOCIAL LEARNING (7 questions deep) =====
  social_learning: {
    id: 'social_learning',
    text: 'In group learning settings, you usually...',
    category: 'personality',
    options: [
      {
        text: 'Lead discussions and explain concepts to others',
        nextQuestionId: 'teaching_learning',
        scores: { Strategist: 4 },
        traits: { social: 4, collaborative: 3, big_picture: 2 }
      },
      {
        text: 'Listen carefully and ask insightful questions',
        nextQuestionId: 'active_listening',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 3, detail_oriented: 2, social: 2 }
      },
      {
        text: 'Pair program and code together in real-time',
        nextQuestionId: 'pair_programming_style',
        scores: { Practitioner: 2, Strategist: 1 },
        traits: { practical: 3, collaborative: 4, social: 2 }
      },
      {
        text: 'Share resources and interesting findings',
        nextQuestionId: 'knowledge_sharing',
        scores: { Explorer: 2, Strategist: 1 },
        traits: { social: 3, creative: 2, collaborative: 2 }
      }
    ]
  },

  teaching_learning: {
    id: 'teaching_learning',
    text: 'When explaining a concept to someone, you...',
    category: 'communication',
    options: [
      {
        text: 'Use analogies and real-world examples',
        nextQuestionId: 'collaboration_style',
        scores: { Strategist: 3 },
        traits: { big_picture: 3, creative: 2, social: 3 }
      },
      {
        text: 'Draw diagrams and visual representations',
        nextQuestionId: 'collaboration_style',
        scores: { Strategist: 2, Explorer: 1 },
        traits: { big_picture: 3, creative: 3, social: 2 }
      },
      {
        text: 'Walk through code examples step-by-step',
        nextQuestionId: 'collaboration_style',
        scores: { Achiever: 2, Practitioner: 1 },
        traits: { detail_oriented: 3, practical: 3, social: 2 }
      },
      {
        text: 'Build something together to demonstrate',
        nextQuestionId: 'collaboration_style',
        scores: { Practitioner: 3 },
        traits: { practical: 4, collaborative: 3, experimental: 1 }
      }
    ]
  },

  collaboration_style: {
    id: 'collaboration_style',
    text: 'In team projects, you naturally gravitate towards...',
    category: 'personality',
    options: [
      {
        text: 'Architecture planning and system design',
        nextQuestionId: 'leadership_style',
        scores: { Strategist: 4 },
        traits: { big_picture: 4, analytical: 2, collaborative: 2 }
      },
      {
        text: 'Implementing complex core features',
        nextQuestionId: 'implementation_focus',
        scores: { Achiever: 3, Practitioner: 1 },
        traits: { detail_oriented: 3, practical: 3, analytical: 2 }
      },
      {
        text: 'Researching and integrating new technologies',
        nextQuestionId: 'innovation_role',
        scores: { Explorer: 4 },
        traits: { creative: 4, analytical: 2, experimental: 3 }
      },
      {
        text: 'Building prototypes and MVPs quickly',
        nextQuestionId: 'rapid_development',
        scores: { Practitioner: 3, Strategist: 1 },
        traits: { practical: 4, experimental: 2, big_picture: 1 }
      }
    ]
  },

  leadership_style: {
    id: 'leadership_style',
    text: 'When leading a project, you prioritize...',
    category: 'personality',
    options: [
      {
        text: 'Clear communication and team alignment',
        nextQuestionId: 'challenge_response',
        scores: { Strategist: 4 },
        traits: { big_picture: 3, social: 4, collaborative: 4 }
      },
      {
        text: 'Delivering high-quality, well-tested code',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 4, analytical: 3 }
      },
      {
        text: 'Meeting deadlines and shipping features',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 3, Strategist: 1 },
        traits: { practical: 4, big_picture: 2 }
      },
      {
        text: 'Innovative solutions and technical excellence',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 3, Achiever: 1 },
        traits: { creative: 4, analytical: 3, experimental: 2 }
      }
    ]
  },

  // ===== CONVERGENT QUESTIONS (all paths lead here) =====
  time_management: {
    id: 'time_management',
    text: 'How do you manage your learning and coding time?',
    category: 'time_management',
    options: [
      {
        text: 'Fixed daily schedule at the same time every day',
        nextQuestionId: 'consistency_habits',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { detail_oriented: 3, analytical: 1 }
      },
      {
        text: 'Flexible schedule based on motivation and energy levels',
        nextQuestionId: 'energy_optimization',
        scores: { Explorer: 2, Practitioner: 1 },
        traits: { creative: 2, independent: 2 }
      },
      {
        text: 'Intensive focused sprints when I have deadlines',
        nextQuestionId: 'deadline_driven',
        scores: { Practitioner: 3 },
        traits: { practical: 3, experimental: 1 }
      },
      {
        text: 'Weekly goals with planned milestones',
        nextQuestionId: 'goal_setting',
        scores: { Strategist: 4 },
        traits: { big_picture: 3, detail_oriented: 2, analytical: 1 }
      }
    ]
  },

  consistency_habits: {
    id: 'consistency_habits',
    text: 'Your ideal learning session lasts...',
    category: 'time_management',
    options: [
      {
        text: '25-45 minutes with breaks (Pomodoro)',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 3 },
        traits: { detail_oriented: 3, practical: 2 }
      },
      {
        text: '1-2 hours of deep focus',
        nextQuestionId: 'challenge_response',
        scores: { Achiever: 2, Explorer: 1 },
        traits: { analytical: 3, detail_oriented: 2 }
      },
      {
        text: '3-4 hours until I finish what I started',
        nextQuestionId: 'challenge_response',
        scores: { Practitioner: 3 },
        traits: { practical: 3, independent: 2 }
      },
      {
        text: 'As long as needed until I understand',
        nextQuestionId: 'challenge_response',
        scores: { Explorer: 2, Achiever: 1 },
        traits: { analytical: 2, independent: 2 }
      }
    ]
  },

  challenge_response: {
    id: 'challenge_response',
    text: 'When facing a difficult concept you cannot grasp, you...',
    category: 'stress_response',
    options: [
      {
        text: 'Keep trying persistently until I master it completely',
        nextQuestionId: 'perseverance_style',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 3, analytical: 2 }
      },
      {
        text: 'Break it down into smaller, manageable parts',
        nextQuestionId: 'decomposition_strategy',
        scores: { Strategist: 4 },
        traits: { big_picture: 3, analytical: 3 }
      },
      {
        text: 'Build something simple to understand through practice',
        nextQuestionId: 'practical_understanding',
        scores: { Practitioner: 4 },
        traits: { practical: 4, experimental: 2 }
      },
      {
        text: 'Explore different explanations and perspectives',
        nextQuestionId: 'multi_perspective',
        scores: { Explorer: 4 },
        traits: { creative: 3, analytical: 2, theoretical: 2 }
      },
      {
        text: 'Discuss with others who understand it',
        nextQuestionId: 'social_support',
        scores: { Strategist: 2 },
        traits: { social: 4, collaborative: 3 }
      }
    ]
  },

  perseverance_style: {
    id: 'perseverance_style',
    text: 'When stuck on something for hours, you...',
    category: 'stress_response',
    options: [
      {
        text: 'Take a break and come back with fresh perspective',
        nextQuestionId: 'motivation_type',
        scores: { Strategist: 3 },
        traits: { big_picture: 3, analytical: 1 }
      },
      {
        text: 'Push through until I solve it',
        nextQuestionId: 'motivation_type',
        scores: { Achiever: 4 },
        traits: { detail_oriented: 3, analytical: 2 }
      },
      {
        text: 'Switch to a different approach or project',
        nextQuestionId: 'motivation_type',
        scores: { Explorer: 2, Practitioner: 1 },
        traits: { creative: 2, practical: 2 }
      },
      {
        text: 'Ask for help after trying on my own',
        nextQuestionId: 'motivation_type',
        scores: { Strategist: 2 },
        traits: { social: 3, collaborative: 2 }
      }
    ]
  },

  motivation_type: {
    id: 'motivation_type',
    text: 'What motivates you most in your learning journey?',
    category: 'motivation',
    options: [
      {
        text: 'Building something useful and innovative',
        nextQuestionId: 'creation_motivation',
        scores: { Practitioner: 3, Explorer: 1 },
        traits: { practical: 3, creative: 3, experimental: 2 }
      },
      {
        text: 'Mastering complex concepts and becoming an expert',
        nextQuestionId: 'mastery_motivation',
        scores: { Achiever: 4 },
        traits: { analytical: 4, detail_oriented: 3, theoretical: 2 }
      },
      {
        text: 'Solving meaningful real-world problems',
        nextQuestionId: 'impact_motivation',
        scores: { Strategist: 4 },
        traits: { big_picture: 4, practical: 2, social: 1 }
      },
      {
        text: 'Discovering and exploring new technologies',
        nextQuestionId: 'curiosity_motivation',
        scores: { Explorer: 4 },
        traits: { creative: 4, analytical: 2, independent: 2 }
      },
      {
        text: 'Collaborating and teaching others',
        nextQuestionId: 'community_motivation',
        scores: { Strategist: 3 },
        traits: { social: 4, collaborative: 4, big_picture: 1 }
      }
    ]
  },

  creation_motivation: {
    id: 'creation_motivation',
    text: 'When building a project, you feel most satisfied when...',
    category: 'motivation',
    options: [
      {
        text: 'Users love it and find it useful',
        nextQuestionId: 'final_goal',
        scores: { Strategist: 3, Practitioner: 1 },
        traits: { big_picture: 3, social: 2, practical: 2 }
      },
      {
        text: 'The code is elegant and well-architected',
        nextQuestionId: 'final_goal',
        scores: { Achiever: 3, Strategist: 1 },
        traits: { detail_oriented: 3, analytical: 3 }
      },
      {
        text: 'It works and solves the problem',
        nextQuestionId: 'final_goal',
        scores: { Practitioner: 4 },
        traits: { practical: 4 }
      },
      {
        text: 'It uses innovative technology or approach',
        nextQuestionId: 'final_goal',
        scores: { Explorer: 4 },
        traits: { creative: 4, experimental: 3 }
      }
    ]
  },

  // ===== FINAL QUESTIONS =====
  final_goal: {
    id: 'final_goal',
    text: 'What is your primary goal for the next 6 months?',
    category: 'motivation',
    description: 'Choose what matters most to you right now',
    options: [
      {
        text: 'Land a job/internship at a top tech company',
        nextQuestionId: 'career_preparation',
        scores: { Achiever: 3, Practitioner: 1 },
        traits: { practical: 3, detail_oriented: 2 }
      },
      {
        text: 'Build an impressive portfolio project',
        nextQuestionId: null,
        scores: { Practitioner: 3, Strategist: 1 },
        traits: { practical: 4, creative: 2, experimental: 1 }
      },
      {
        text: 'Master a specific technology or framework deeply',
        nextQuestionId: null,
        scores: { Achiever: 4 },
        traits: { analytical: 3, detail_oriented: 4, theoretical: 2 }
      },
      {
        text: 'Explore multiple tech stacks and broaden knowledge',
        nextQuestionId: null,
        scores: { Explorer: 4 },
        traits: { creative: 3, big_picture: 2, experimental: 2 }
      },
      {
        text: 'Contribute to open source and build reputation',
        nextQuestionId: null,
        scores: { Strategist: 3, Explorer: 1 },
        traits: { social: 4, collaborative: 3, creative: 2 }
      },
      {
        text: 'Start my own tech startup or side project',
        nextQuestionId: null,
        scores: { Strategist: 3, Practitioner: 2 },
        traits: { big_picture: 4, practical: 3, creative: 2, independent: 3 }
      }
    ]
  },

  career_preparation: {
    id: 'career_preparation',
    text: 'For interview preparation, you focus on...',
    category: 'skill_preference',
    description: 'This is the final question!',
    options: [
      {
        text: 'Data structures & algorithms mastery',
        nextQuestionId: null,
        scores: { Achiever: 4 },
        traits: { analytical: 4, detail_oriented: 3, theoretical: 2 }
      },
      {
        text: 'System design and architecture patterns',
        nextQuestionId: null,
        scores: { Strategist: 4 },
        traits: { big_picture: 4, analytical: 3, theoretical: 2 }
      },
      {
        text: 'Building projects to demonstrate skills',
        nextQuestionId: null,
        scores: { Practitioner: 4 },
        traits: { practical: 4, experimental: 2, creative: 1 }
      },
      {
        text: 'Understanding multiple tech stacks broadly',
        nextQuestionId: null,
        scores: { Explorer: 3 },
        traits: { creative: 2, big_picture: 3, experimental: 1 }
      }
    ]
  },

  // Add remaining leaf questions (all end with nextQuestionId: null or point to motivation_type/final_goal)
  visual_thinking: { id: 'visual_thinking', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  quick_reference: { id: 'quick_reference', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  memory_retention: { id: 'memory_retention', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  planning_depth: { id: 'planning_depth', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  iteration_preference: { id: 'iteration_preference', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  component_mastery: { id: 'component_mastery', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  curiosity_driven: { id: 'curiosity_driven', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  practical_application: { id: 'practical_application', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  critical_analysis: { id: 'critical_analysis', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  experiment_first: { id: 'experiment_first', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  specialization_path: { id: 'specialization_path', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  generalist_approach: { id: 'generalist_approach', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  innovation_focus: { id: 'innovation_focus', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  code_comprehension: { id: 'code_comprehension', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  experimental_mindset: { id: 'experimental_mindset', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  reinvention_tendency: { id: 'reinvention_tendency', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  memory_based_learning: { id: 'memory_based_learning', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'practice_approach', scores: {}, traits: {}}] },
  creative_adaptation: { id: 'creative_adaptation', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'practice_approach', scores: {}, traits: {}}] },
  deep_understanding: { id: 'deep_understanding', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'practice_approach', scores: {}, traits: {}}] },
  experimentation_level: { id: 'experimentation_level', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  creative_freedom: { id: 'creative_freedom', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  project_complexity: { id: 'project_complexity', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  open_source_contribution: { id: 'open_source_contribution', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  technology_adoption: { id: 'technology_adoption', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  deep_implementation: { id: 'deep_implementation', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  minimal_planning: { id: 'minimal_planning', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'problem_solving', scores: {}, traits: {}}] },
  pattern_recognition: { id: 'pattern_recognition', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'problem_solving', scores: {}, traits: {}}] },
  formal_planning: { id: 'formal_planning', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  research_first: { id: 'research_first', text: 'placeholder', category: 'behavior', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  debugging_methodology: { id: 'debugging_methodology', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  collaboration_tendency: { id: 'collaboration_tendency', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  failure_response: { id: 'failure_response', text: 'placeholder', category: 'stress_response', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  quick_debugging: { id: 'quick_debugging', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  community_resources: { id: 'community_resources', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  root_cause_analysis: { id: 'root_cause_analysis', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  social_problem_solving: { id: 'social_problem_solving', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  active_listening: { id: 'active_listening', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'collaboration_style', scores: {}, traits: {}}] },
  pair_programming_style: { id: 'pair_programming_style', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'collaboration_style', scores: {}, traits: {}}] },
  knowledge_sharing: { id: 'knowledge_sharing', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  implementation_focus: { id: 'implementation_focus', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  innovation_role: { id: 'innovation_role', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  rapid_development: { id: 'rapid_development', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  energy_optimization: { id: 'energy_optimization', text: 'placeholder', category: 'time_management', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  deadline_driven: { id: 'deadline_driven', text: 'placeholder', category: 'time_management', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  goal_setting: { id: 'goal_setting', text: 'placeholder', category: 'time_management', options: [{text: 'A', nextQuestionId: 'challenge_response', scores: {}, traits: {}}] },
  decomposition_strategy: { id: 'decomposition_strategy', text: 'placeholder', category: 'problem_solving', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  practical_understanding: { id: 'practical_understanding', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  multi_perspective: { id: 'multi_perspective', text: 'placeholder', category: 'learning_style', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  social_support: { id: 'social_support', text: 'placeholder', category: 'personality', options: [{text: 'A', nextQuestionId: 'motivation_type', scores: {}, traits: {}}] },
  mastery_motivation: { id: 'mastery_motivation', text: 'placeholder', category: 'motivation', options: [{text: 'A', nextQuestionId: 'final_goal', scores: {}, traits: {}}] },
  impact_motivation: { id: 'impact_motivation', text: 'placeholder', category: 'motivation', options: [{text: 'A', nextQuestionId: 'final_goal', scores: {}, traits: {}}] },
  curiosity_motivation: { id: 'curiosity_motivation', text: 'placeholder', category: 'motivation', options: [{text: 'A', nextQuestionId: 'final_goal', scores: {}, traits: {}}] },
  community_motivation: { id: 'community_motivation', text: 'placeholder', category: 'motivation', options: [{text: 'A', nextQuestionId: 'final_goal', scores: {}, traits: {}}] },
  architecture_priority: { id: 'architecture_priority', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  performance_vs_readability: { id: 'performance_vs_readability', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] },
  documentation_style: { id: 'documentation_style', text: 'placeholder', category: 'skill_preference', options: [{text: 'A', nextQuestionId: 'time_management', scores: {}, traits: {}}] }
};

export const getNextQuestion = (questionId: string): AdaptiveQuestion | null => {
  return adaptiveQuestionTree[questionId] || null;
};

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

export const getTotalQuestions = (): number => {
  return Object.keys(adaptiveQuestionTree).length;
};
