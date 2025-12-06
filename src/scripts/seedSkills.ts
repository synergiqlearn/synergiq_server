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
  // More Explorer Skills
  {
    name: 'Data Science with Python',
    category: 'Explorer',
    description: 'Explore data analysis, visualization, and statistical modeling',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Data Science Explorer',
      description: 'Discover insights from data',
      steps: [
        'Learn Pandas and NumPy',
        'Master data visualization with Matplotlib',
        'Explore statistical analysis',
        'Work with real datasets',
        'Build predictive models',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [
      {
        type: 'course',
        title: 'Data Science with Python',
        url: 'https://www.coursera.org/specializations/data-science-python',
        provider: 'Coursera',
      },
    ],
    tags: ['Data Science', 'Python', 'Analytics'],
    icon: '📊',
    isActive: true,
  },
  {
    name: 'Blockchain Technology',
    category: 'Explorer',
    description: 'Explore decentralized systems and cryptocurrency development',
    difficulty: 'Advanced',
    roadmap: {
      title: 'Blockchain Explorer',
      description: 'Understand Web3 and decentralization',
      steps: [
        'Understand blockchain fundamentals',
        'Learn Solidity programming',
        'Explore smart contracts',
        'Build DApps with Web3.js',
        'Deploy on Ethereum testnet',
      ],
      estimatedTime: '4-5 months',
    },
    resources: [],
    tags: ['Blockchain', 'Web3', 'Solidity', 'Ethereum'],
    icon: '⛓️',
    isActive: true,
  },
  {
    name: 'UI/UX Design Principles',
    category: 'Explorer',
    description: 'Discover user-centered design and creative problem-solving',
    difficulty: 'Beginner',
    roadmap: {
      title: 'Design Explorer',
      description: 'Create beautiful user experiences',
      steps: [
        'Learn design fundamentals',
        'Master Figma/Adobe XD',
        'Understand user research',
        'Create wireframes and prototypes',
        'Build design systems',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['UI/UX', 'Design', 'Figma'],
    icon: '🎨',
    isActive: true,
  },
  {
    name: 'Game Development Basics',
    category: 'Explorer',
    description: 'Explore game engines and interactive entertainment',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Game Dev Explorer',
      description: 'Build engaging games',
      steps: [
        'Learn Unity/Unreal basics',
        'Understand game physics',
        'Create game mechanics',
        'Design levels and gameplay',
        'Publish your first game',
      ],
      estimatedTime: '4-6 months',
    },
    resources: [],
    tags: ['Game Dev', 'Unity', 'C#'],
    icon: '🎮',
    isActive: true,
  },
  
  // More Achiever Skills
  {
    name: 'React Native Mobile Development',
    category: 'Achiever',
    description: 'Build cross-platform mobile apps with measurable user metrics',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Mobile App Achiever',
      description: 'Ship apps to App Store and Play Store',
      steps: [
        'Master React Native fundamentals',
        'Build navigation and state management',
        'Integrate APIs and databases',
        'Optimize performance',
        'Deploy to production',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [],
    tags: ['React Native', 'Mobile', 'iOS', 'Android'],
    icon: '📱',
    isActive: true,
  },
  {
    name: 'Cloud Computing (AWS)',
    category: 'Achiever',
    description: 'Deploy and scale applications on AWS with certifications',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'AWS Certification Path',
      description: 'Earn AWS certifications',
      steps: [
        'Learn AWS core services',
        'Master EC2, S3, RDS',
        'Understand IAM and security',
        'Practice with real projects',
        'Pass AWS certification exam',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [],
    tags: ['AWS', 'Cloud', 'DevOps'],
    icon: '☁️',
    isActive: true,
  },
  {
    name: 'Frontend Performance Optimization',
    category: 'Achiever',
    description: 'Achieve blazing-fast load times and perfect Lighthouse scores',
    difficulty: 'Advanced',
    roadmap: {
      title: 'Performance Champion',
      description: 'Build the fastest websites',
      steps: [
        'Measure performance metrics',
        'Optimize bundle size',
        'Implement lazy loading',
        'Master caching strategies',
        'Achieve 100/100 Lighthouse score',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['Performance', 'Frontend', 'Optimization'],
    icon: '⚡',
    isActive: true,
  },
  
  // More Strategist Skills
  {
    name: 'Database Design & Optimization',
    category: 'Strategist',
    description: 'Plan efficient database schemas and query optimization',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Database Strategist',
      description: 'Design optimal data models',
      steps: [
        'Learn relational database design',
        'Master SQL optimization',
        'Understand indexing strategies',
        'Plan NoSQL data models',
        'Implement database scaling',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [],
    tags: ['Database', 'SQL', 'PostgreSQL', 'MongoDB'],
    icon: '🗄️',
    isActive: true,
  },
  {
    name: 'Cybersecurity Fundamentals',
    category: 'Strategist',
    description: 'Analyze and protect systems from security threats',
    difficulty: 'Advanced',
    roadmap: {
      title: 'Security Architect',
      description: 'Build secure systems',
      steps: [
        'Understand security principles',
        'Learn penetration testing',
        'Master encryption and authentication',
        'Analyze vulnerabilities',
        'Implement security best practices',
      ],
      estimatedTime: '5-6 months',
    },
    resources: [],
    tags: ['Security', 'Cybersecurity', 'Ethical Hacking'],
    icon: '🔒',
    isActive: true,
  },
  {
    name: 'Software Testing & QA',
    category: 'Strategist',
    description: 'Plan comprehensive testing strategies and quality assurance',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'QA Strategist',
      description: 'Ensure software quality',
      steps: [
        'Learn testing methodologies',
        'Master unit and integration testing',
        'Understand E2E testing',
        'Plan test coverage strategies',
        'Implement CI/CD pipelines',
      ],
      estimatedTime: '3-4 months',
    },
    resources: [],
    tags: ['Testing', 'QA', 'Jest', 'Cypress'],
    icon: '🧪',
    isActive: true,
  },
  
  // More Practitioner Skills
  {
    name: 'Docker & Containerization',
    category: 'Practitioner',
    description: 'Build and deploy containerized applications hands-on',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'Docker Practitioner',
      description: 'Containerize everything',
      steps: [
        'Learn Docker basics',
        'Create Dockerfiles',
        'Use Docker Compose',
        'Deploy with Kubernetes',
        'Build production containers',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['Docker', 'DevOps', 'Containers'],
    icon: '🐳',
    isActive: true,
  },
  {
    name: 'REST API Development',
    category: 'Practitioner',
    description: 'Build robust APIs with Node.js/Express through practice',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'API Builder',
      description: 'Create production-ready APIs',
      steps: [
        'Learn REST principles',
        'Build CRUD operations',
        'Implement authentication',
        'Add error handling',
        'Deploy and document APIs',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['API', 'Node.js', 'Express', 'REST'],
    icon: '🔌',
    isActive: true,
  },
  {
    name: 'CI/CD Pipeline Setup',
    category: 'Practitioner',
    description: 'Implement continuous integration and deployment workflows',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'DevOps Practitioner',
      description: 'Automate everything',
      steps: [
        'Learn Git workflows',
        'Set up GitHub Actions',
        'Configure automated testing',
        'Deploy with pipelines',
        'Monitor deployments',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['CI/CD', 'DevOps', 'GitHub Actions'],
    icon: '🔄',
    isActive: true,
  },
  {
    name: 'MongoDB Database Development',
    category: 'Practitioner',
    description: 'Build applications with MongoDB through hands-on practice',
    difficulty: 'Beginner',
    roadmap: {
      title: 'MongoDB Builder',
      description: 'Master NoSQL databases',
      steps: [
        'Learn MongoDB basics',
        'Design document schemas',
        'Perform CRUD operations',
        'Use aggregation pipelines',
        'Optimize queries',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['MongoDB', 'NoSQL', 'Database'],
    icon: '🍃',
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
  {
    name: 'JavaScript Fundamentals',
    category: 'All',
    description: 'Master the language of the web',
    difficulty: 'Beginner',
    roadmap: {
      title: 'JavaScript Essentials',
      description: 'Build interactive web applications',
      steps: [
        'Learn ES6+ syntax',
        'Master async programming',
        'Understand DOM manipulation',
        'Work with APIs',
        'Build real projects',
      ],
      estimatedTime: '2-3 months',
    },
    resources: [],
    tags: ['JavaScript', 'Web Dev', 'Frontend'],
    icon: '⚡',
    isActive: true,
  },
  {
    name: 'SQL & Database Basics',
    category: 'All',
    description: 'Learn to query and manage relational databases',
    difficulty: 'Beginner',
    roadmap: {
      title: 'SQL Fundamentals',
      description: 'Master data querying',
      steps: [
        'Learn SELECT, WHERE, JOIN',
        'Understand database normalization',
        'Practice complex queries',
        'Master transactions',
        'Optimize query performance',
      ],
      estimatedTime: '1-2 months',
    },
    resources: [],
    tags: ['SQL', 'Database', 'PostgreSQL'],
    icon: '💾',
    isActive: true,
  },
  {
    name: 'HTML & CSS Fundamentals',
    category: 'All',
    description: 'Build beautiful and responsive web pages',
    difficulty: 'Beginner',
    roadmap: {
      title: 'Web Basics',
      description: 'Create stunning websites',
      steps: [
        'Learn HTML5 semantic tags',
        'Master CSS layouts (Flexbox, Grid)',
        'Understand responsive design',
        'Build with CSS frameworks',
        'Create portfolio projects',
      ],
      estimatedTime: '1-2 months',
    },
    resources: [],
    tags: ['HTML', 'CSS', 'Web Dev'],
    icon: '🌐',
    isActive: true,
  },
  {
    name: 'Data Structures & Algorithms',
    category: 'All',
    description: 'Essential problem-solving skills for every developer',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'DSA Mastery',
      description: 'Ace technical interviews',
      steps: [
        'Learn arrays and strings',
        'Master linked lists and trees',
        'Understand sorting algorithms',
        'Practice dynamic programming',
        'Solve 200+ LeetCode problems',
      ],
      estimatedTime: '4-6 months',
    },
    resources: [],
    tags: ['DSA', 'Algorithms', 'Interview Prep'],
    icon: '📚',
    isActive: true,
  },
  {
    name: 'TypeScript',
    category: 'All',
    description: 'Add type safety to JavaScript applications',
    difficulty: 'Intermediate',
    roadmap: {
      title: 'TypeScript Pro',
      description: 'Write safer code',
      steps: [
        'Learn TypeScript basics',
        'Understand type system',
        'Master interfaces and generics',
        'Configure tsconfig.json',
        'Migrate JS projects to TS',
      ],
      estimatedTime: '1-2 months',
    },
    resources: [],
    tags: ['TypeScript', 'JavaScript', 'Type Safety'],
    icon: '📘',
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
    console.log(`✅ Successfully seeded ${skills.length} skills to database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedSkills();
