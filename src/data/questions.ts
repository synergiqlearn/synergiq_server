import { IQuestion } from '../models/Questionnaire';

export const questions: IQuestion[] = [
  {
    id: 'q1',
    text: 'When learning something new, I prefer to:',
    category: 'learning',
    options: [
      { text: 'Try different approaches and experiment', value: 3, type: 'Explorer' },
      { text: 'Set clear goals and track my progress', value: 3, type: 'Achiever' },
      { text: 'Plan everything step-by-step first', value: 3, type: 'Strategist' },
      { text: 'Jump in and learn by doing', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q2',
    text: 'How do you handle challenges?',
    category: 'behavior',
    options: [
      { text: 'Try creative solutions and new methods', value: 3, type: 'Explorer' },
      { text: 'Push through until I succeed', value: 3, type: 'Achiever' },
      { text: 'Analyze the problem and create a strategy', value: 3, type: 'Strategist' },
      { text: 'Apply what I know and adapt as I go', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q3',
    text: 'What motivates you most in learning?',
    category: 'goals',
    options: [
      { text: 'Discovering new ideas and possibilities', value: 3, type: 'Explorer' },
      { text: 'Reaching milestones and achieving results', value: 3, type: 'Achiever' },
      { text: 'Understanding systems and finding optimal solutions', value: 3, type: 'Strategist' },
      { text: 'Building real things and solving practical problems', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q4',
    text: 'Your ideal project would involve:',
    category: 'interests',
    options: [
      { text: 'Research and innovation', value: 3, type: 'Explorer' },
      { text: 'Competition and measurable outcomes', value: 3, type: 'Achiever' },
      { text: 'Planning and optimization', value: 3, type: 'Strategist' },
      { text: 'Hands-on development and implementation', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q5',
    text: 'When working in a team, you usually:',
    category: 'behavior',
    options: [
      { text: 'Generate new ideas and explore alternatives', value: 3, type: 'Explorer' },
      { text: 'Drive the team toward goals and deadlines', value: 3, type: 'Achiever' },
      { text: 'Organize tasks and coordinate efforts', value: 3, type: 'Strategist' },
      { text: 'Execute tasks and deliver working solutions', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q6',
    text: 'How do you prefer to spend your free time?',
    category: 'interests',
    options: [
      { text: 'Exploring new hobbies and interests', value: 2, type: 'Explorer' },
      { text: 'Completing personal projects and goals', value: 2, type: 'Achiever' },
      { text: 'Learning about complex topics in depth', value: 2, type: 'Strategist' },
      { text: 'Building or creating something useful', value: 2, type: 'Practitioner' },
    ],
  },
  {
    id: 'q7',
    text: 'Your approach to problem-solving is:',
    category: 'learning',
    options: [
      { text: 'Brainstorm many possible solutions', value: 3, type: 'Explorer' },
      { text: 'Focus on what will work fastest', value: 3, type: 'Achiever' },
      { text: 'Analyze root causes and patterns', value: 3, type: 'Strategist' },
      { text: 'Try solutions and iterate based on results', value: 3, type: 'Practitioner' },
    ],
  },
  {
    id: 'q8',
    text: 'What describes your learning style best?',
    category: 'learning',
    options: [
      { text: 'Curious and open to new methods', value: 3, type: 'Explorer' },
      { text: 'Goal-oriented and focused on results', value: 3, type: 'Achiever' },
      { text: 'Systematic and methodical', value: 3, type: 'Strategist' },
      { text: 'Practical and application-focused', value: 3, type: 'Practitioner' },
    ],
  },
];
