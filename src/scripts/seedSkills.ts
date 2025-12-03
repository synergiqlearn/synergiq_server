import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Skill from '../models/Skill';
import connectDB from '../config/db';

dotenv.config();

const skills = [
  // Explorer Skills
  {
    name: 'Machine Learning Fundamentals',
    category: 'Explorer',
    description: 'Explore the fundamentals of machine learning, neural networks, and AI applications',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'ML Explorer Path',
      description: 'Discover the exciting world of AI and machine learning',
      steps: [
        'Learn Python basics and NumPy',
        'Understand supervised vs unsupervised learning',
        'Explore neural networks with TensorFlow',
        'Build your first ML model',
        'Experiment with different algorithms',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [
      {
        type: 'course',
        title: 'Machine Learning by Andrew Ng',
        url: 'https://www.coursera.org/learn/machine-learning',
        provider: 'Coursera',
      },
      {
        type: 'video',
        title: 'Neural Networks Explained',
        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
        provider: '3Blue1Brown',
      },
    ],
    tags: ['AI', 'ML', 'Python', 'Data Science'],
    icon: '🤖',
    isActive: true,
  },
  {
    name: 'Creative Coding with p5.js',
    category: 'Explorer',
    description: 'Create interactive art and animations using JavaScript',
    difficulty: 'Beginner',
    roadmap: {
      title: 'Creative Coding Journey',
      description: 'Express creativity through code',
      steps: [
        'Learn JavaScript basics',
        'Understand canvas and drawing',
        'Create interactive animations',
        'Experiment with generative art',
        'Build portfolio projects',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [
      {
        type: 'course',
        title: 'Code! Programming with p5.js',
        url: 'https://www.youtube.com/playlist?list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA',
        provider: 'The Coding Train',
      },
    ],
    tags: ['JavaScript', 'Art', 'Creative', 'Animation'],
    icon: '🎨',
    isActive: true,
  },
  // Achiever Skills
  {
    name: 'Full Stack Web Development',
    category: 'Achiever',
    description: 'Master both frontend and backend development to build complete web applications',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Full Stack Mastery',
      description: 'Build end-to-end web applications',
      steps: [
        'Master HTML, CSS, JavaScript',
        'Learn React.js for frontend',
        'Learn Node.js and Express',
        'Database design with MongoDB',
        'Deploy full-stack applications',
      ],
      estimatedTime: '4-6 months',
    },
    resources: [
      {
        type: 'course',
        title: 'The Complete Web Developer',
        url: 'https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/',
        provider: 'Udemy',
      },
    ],
    tags: ['Web Dev', 'React', 'Node.js', 'MongoDB'],
    icon: '💻',
    isActive: true,
  },
  {
    name: 'Competitive Programming',
    category: 'Achiever',
    description: 'Excel in coding competitions and technical interviews',
    difficulty: 'Advanced',
    roadmap: {
      title: 'CP Champion Path',
      description: 'Master algorithms and problem-solving',
      steps: [
        'Learn data structures fundamentals',
        'Master sorting and searching algorithms',
        'Practice dynamic programming',
        'Solve Codeforces/LeetCode problems',
        'Participate in competitions',
      ],
      estimatedTime: '6-12 months',
    },
    resources: [
      {
        type: 'article',
        title: 'Competitive Programming Guide',
        url: 'https://www.geeksforgeeks.org/how-to-prepare-for-competitive-programming/',
        provider: 'GeeksforGeeks',
      },
    ],
    tags: ['Algorithms', 'DSA', 'Problem Solving'],
    icon: '🏆',
    isActive: true,
  },
  // Strategist Skills
  {
    name: 'System Design & Architecture',
    category: 'Strategist',
    description: 'Design scalable and efficient software systems',
    difficulty: 'Advanced',
    roadmap: {
      title: 'System Architecture Expert',
      description: 'Build scalable distributed systems',
      steps: [
        'Understand distributed systems basics',
        'Learn database design patterns',
        'Study microservices architecture',
        'Master caching and load balancing',
        'Design real-world systems',
      ],
      estimatedTime: '5-8 months',
    },
    resources: [
      {
        type: 'book',
        title: 'Designing Data-Intensive Applications',
        url: 'https://dataintensive.net/',
        provider: 'O\'Reilly',
      },
    ],
    tags: ['Architecture', 'Design', 'Scalability'],
    icon: '🏗️',
    isActive: true,
  },
  {
    name: 'Cloud Computing (AWS/Azure)',
    category: 'Strategist',
    description: 'Master cloud infrastructure and deployment strategies',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Cloud Architect Path',
      description: 'Deploy and manage cloud infrastructure',
      steps: [
        'Learn cloud computing fundamentals',
        'Master AWS/Azure services',
        'Understand serverless architecture',
        'Implement CI/CD pipelines',
        'Design multi-region deployments',
      ],
      estimatedTime: '4-6 months',
    },
    resources: [
      {
        type: 'course',
        title: 'AWS Certified Solutions Architect',
        url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
        provider: 'AWS',
      },
    ],
    tags: ['Cloud', 'AWS', 'DevOps', 'Infrastructure'],
    icon: '☁️',
    isActive: true,
  },
  // Practitioner Skills
  {
    name: 'Mobile App Development (React Native)',
    category: 'Practitioner',
    description: 'Build cross-platform mobile applications',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Mobile Dev Journey',
      description: 'Create real-world mobile apps',
      steps: [
        'Learn React fundamentals',
        'Master React Native components',
        'Implement navigation and state',
        'Integrate APIs and databases',
        'Deploy to App Store and Play Store',
      ],
      estimatedTime: '3-5 months',
    },
    resources: [
      {
        type: 'course',
        title: 'React Native - The Practical Guide',
        url: 'https://www.udemy.com/course/react-native-the-practical-guide/',
        provider: 'Udemy',
      },
    ],
    tags: ['Mobile', 'React Native', 'iOS', 'Android'],
    icon: '📱',
    isActive: true,
  },
  {
    name: 'DevOps Engineering',
    category: 'Practitioner',
    description: 'Automate deployment and manage infrastructure',
    difficulty: 'Advanced',
    roadmap: {
      title: 'DevOps Practitioner',
      description: 'Streamline development workflows',
      steps: [
        'Learn Linux and shell scripting',
        'Master Docker and containers',
        'Understand Kubernetes orchestration',
        'Implement CI/CD with Jenkins/GitHub Actions',
        'Monitor systems with Prometheus',
      ],
      estimatedTime: '5-7 months',
    },
    resources: [
      {
        type: 'course',
        title: 'DevOps Bootcamp',
        url: 'https://www.udemy.com/course/devops-bootcamp/',
        provider: 'Udemy',
      },
    ],
    tags: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    icon: '⚙️',
    isActive: true,
  },
  // Universal Skills (All categories)
  {
    name: 'Git & Version Control',
    category: 'All',
    description: 'Master version control and collaboration with Git',
    difficulty: 'Beginner',
    roadmap: {
      title: 'Git Mastery',
      description: 'Essential skill for all developers',
      steps: [
        'Understand version control basics',
        'Learn Git commands and workflows',
        'Master branching and merging',
        'Collaborate with GitHub/GitLab',
        'Handle merge conflicts',
      ],
      estimatedTime: '1-2 months',
    },
    resources: [
      {
        type: 'course',
        title: 'Git & GitHub Crash Course',
        url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
        provider: 'freeCodeCamp',
      },
    ],
    tags: ['Git', 'Version Control', 'GitHub'],
    icon: '🌿',
    isActive: true,
  },
  {
    name: 'Python Programming',
    category: 'All',
    description: 'Learn one of the most versatile programming languages',
    difficulty: 'Beginner',
    roadmap: {
      title: 'Python Fundamentals',
      description: 'Start your programming journey',
      steps: [
        'Learn syntax and basic concepts',
        'Understand data structures',
        'Master functions and OOP',
        'Work with libraries and modules',
        'Build practical projects',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [
      {
        type: 'course',
        title: 'Python for Everybody',
        url: 'https://www.py4e.com/',
        provider: 'University of Michigan',
      },
    ],
    tags: ['Python', 'Programming', 'Beginner'],
    icon: '🐍',
    isActive: true,
  },
];

const seedSkills = async () => {
  try {
    await connectDB();

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('📝 Cleared existing skills');

    // Insert new skills
    await Skill.insertMany(skills);
    console.log('✅ Successfully seeded skills database');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedSkills();
