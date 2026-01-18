import dotenv from 'dotenv';
import connectDB from '../config/db';
import Project from '../models/Project';
import User from '../models/User';

dotenv.config();

const projects = [
  {
    title: 'E-Commerce Platform',
    description: 'Building a full-stack e-commerce platform with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, payment integration with Stripe, and admin dashboard for inventory management.',
    category: 'Web Development',
    status: 'active',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe', 'E-commerce'],
    deadline: new Date('2026-03-15'),
    githubRepo: 'https://github.com/example/ecommerce-platform',
    liveDemo: 'https://ecommerce-demo.example.com',
    isPublic: true,
    tasks: [
      {
        title: 'Set up database schema',
        description: 'Design and implement MongoDB collections for users, products, orders',
        status: 'completed',
        createdAt: new Date('2025-11-01'),
        completedAt: new Date('2025-11-05'),
      },
      {
        title: 'Implement authentication system',
        description: 'JWT-based auth with refresh tokens',
        status: 'completed',
        createdAt: new Date('2025-11-06'),
        completedAt: new Date('2025-11-12'),
      },
      {
        title: 'Build product catalog',
        description: 'Product listing, filtering, search functionality',
        status: 'in-progress',
        createdAt: new Date('2025-11-13'),
      },
      {
        title: 'Integrate payment gateway',
        description: 'Stripe integration for secure payments',
        status: 'todo',
        createdAt: new Date('2025-11-20'),
      },
    ],
  },
  {
    title: 'AI Chatbot for Student Support',
    description: 'Developing an intelligent chatbot using GPT-4 API to help students with course recommendations, assignment queries, and campus navigation. Includes natural language processing and context-aware responses.',
    category: 'Machine Learning',
    status: 'active',
    tags: ['Python', 'OpenAI', 'NLP', 'Flask', 'TensorFlow'],
    deadline: new Date('2026-02-28'),
    githubRepo: 'https://github.com/example/ai-chatbot',
    isPublic: true,
    tasks: [
      {
        title: 'Research GPT-4 API capabilities',
        description: 'Study API documentation and pricing',
        status: 'completed',
        createdAt: new Date('2025-10-15'),
        completedAt: new Date('2025-10-20'),
      },
      {
        title: 'Build Flask backend',
        description: 'Create REST API for chatbot interactions',
        status: 'in-progress',
        createdAt: new Date('2025-10-21'),
      },
      {
        title: 'Train custom model',
        description: 'Fine-tune on university-specific data',
        status: 'todo',
        createdAt: new Date('2025-11-01'),
      },
    ],
  },
  {
    title: 'Mobile Fitness Tracker',
    description: 'React Native app for tracking workouts, calories, and fitness goals. Features include exercise library, progress charts, social challenges, and integration with wearable devices.',
    category: 'Mobile App',
    status: 'planning',
    tags: ['React Native', 'Firebase', 'Health API', 'Charts'],
    deadline: new Date('2026-04-30'),
    isPublic: true,
    tasks: [
      {
        title: 'Design app UI/UX',
        description: 'Create wireframes and mockups in Figma',
        status: 'in-progress',
        createdAt: new Date('2025-11-25'),
      },
      {
        title: 'Set up Firebase project',
        description: 'Configure authentication and database',
        status: 'todo',
        createdAt: new Date('2025-11-28'),
      },
    ],
  },
  {
    title: 'Smart Home IoT System',
    description: 'IoT project using Raspberry Pi and sensors to control home appliances. Includes temperature monitoring, automated lighting, security alerts, and mobile app dashboard.',
    category: 'IoT',
    status: 'active',
    tags: ['Raspberry Pi', 'Arduino', 'MQTT', 'Python', 'React'],
    deadline: new Date('2026-01-31'),
    githubRepo: 'https://github.com/example/smart-home',
    isPublic: true,
    tasks: [
      {
        title: 'Set up Raspberry Pi',
        description: 'Install OS and configure network',
        status: 'completed',
        createdAt: new Date('2025-10-01'),
        completedAt: new Date('2025-10-03'),
      },
      {
        title: 'Connect temperature sensors',
        description: 'Wire DHT22 sensors and test readings',
        status: 'completed',
        createdAt: new Date('2025-10-04'),
        completedAt: new Date('2025-10-08'),
      },
      {
        title: 'Build dashboard',
        description: 'Real-time data visualization with React',
        status: 'in-progress',
        createdAt: new Date('2025-10-09'),
      },
    ],
  },
  {
    title: 'Blockchain Voting System',
    description: 'Decentralized voting application using Ethereum smart contracts. Ensures transparency, immutability, and secure vote casting for student elections.',
    category: 'Blockchain',
    status: 'planning',
    tags: ['Solidity', 'Ethereum', 'Web3.js', 'Truffle', 'MetaMask'],
    deadline: new Date('2026-05-15'),
    isPublic: true,
    tasks: [
      {
        title: 'Learn Solidity basics',
        description: 'Complete online course on smart contracts',
        status: 'in-progress',
        createdAt: new Date('2025-11-20'),
      },
      {
        title: 'Design voting contract',
        description: 'Define contract structure and functions',
        status: 'todo',
        createdAt: new Date('2025-11-25'),
      },
    ],
  },
  {
    title: 'Stock Price Predictor',
    description: 'Machine learning model using LSTM networks to predict stock prices. Features historical data analysis, real-time predictions, and visualization dashboard.',
    category: 'Data Science',
    status: 'active',
    tags: ['Python', 'TensorFlow', 'Pandas', 'Keras', 'Matplotlib'],
    deadline: new Date('2026-02-15'),
    githubRepo: 'https://github.com/example/stock-predictor',
    isPublic: true,
    tasks: [
      {
        title: 'Collect historical data',
        description: 'Scrape stock data from Yahoo Finance',
        status: 'completed',
        createdAt: new Date('2025-10-10'),
        completedAt: new Date('2025-10-15'),
      },
      {
        title: 'Data preprocessing',
        description: 'Clean and normalize stock data',
        status: 'completed',
        createdAt: new Date('2025-10-16'),
        completedAt: new Date('2025-10-22'),
      },
      {
        title: 'Build LSTM model',
        description: 'Train neural network on historical data',
        status: 'in-progress',
        createdAt: new Date('2025-10-23'),
      },
      {
        title: 'Create visualization dashboard',
        description: 'Display predictions with interactive charts',
        status: 'todo',
        createdAt: new Date('2025-11-01'),
      },
    ],
  },
  {
    title: '2D Platformer Game',
    description: 'Retro-style platformer game built with Unity. Features include level design, enemy AI, power-ups, boss battles, and local multiplayer mode.',
    category: 'Game Development',
    status: 'active',
    tags: ['Unity', 'C#', 'Game Design', '2D Graphics'],
    deadline: new Date('2026-03-31'),
    githubRepo: 'https://github.com/example/platformer-game',
    isPublic: true,
    tasks: [
      {
        title: 'Character movement mechanics',
        description: 'Implement jump, run, and attack animations',
        status: 'completed',
        createdAt: new Date('2025-09-15'),
        completedAt: new Date('2025-09-25'),
      },
      {
        title: 'Level design',
        description: 'Create 5 unique levels with increasing difficulty',
        status: 'in-progress',
        createdAt: new Date('2025-09-26'),
      },
      {
        title: 'Enemy AI',
        description: 'Implement patrol and attack behaviors',
        status: 'todo',
        createdAt: new Date('2025-10-15'),
      },
    ],
  },
  {
    title: 'Cloud-Based File Storage',
    description: 'Scalable file storage solution using AWS S3, Lambda, and DynamoDB. Features include file encryption, sharing, version control, and collaborative editing.',
    category: 'Cloud Computing',
    status: 'planning',
    tags: ['AWS', 'S3', 'Lambda', 'DynamoDB', 'React'],
    deadline: new Date('2026-04-15'),
    isPublic: true,
    tasks: [
      {
        title: 'Set up AWS infrastructure',
        description: 'Configure S3 buckets and IAM roles',
        status: 'todo',
        createdAt: new Date('2025-11-28'),
      },
      {
        title: 'Implement file upload',
        description: 'Build multipart upload with progress tracking',
        status: 'todo',
        createdAt: new Date('2025-12-05'),
      },
    ],
  },
  {
    title: 'Network Intrusion Detection',
    description: 'Cybersecurity project using machine learning to detect network intrusions. Analyzes traffic patterns, identifies anomalies, and sends real-time alerts.',
    category: 'Cybersecurity',
    status: 'active',
    tags: ['Python', 'Wireshark', 'Scikit-learn', 'Network Security'],
    deadline: new Date('2026-01-20'),
    githubRepo: 'https://github.com/example/intrusion-detection',
    isPublic: true,
    tasks: [
      {
        title: 'Capture network traffic',
        description: 'Use Wireshark to collect sample data',
        status: 'completed',
        createdAt: new Date('2025-10-05'),
        completedAt: new Date('2025-10-12'),
      },
      {
        title: 'Feature extraction',
        description: 'Extract relevant features from packets',
        status: 'in-progress',
        createdAt: new Date('2025-10-13'),
      },
      {
        title: 'Train ML model',
        description: 'Use Random Forest for classification',
        status: 'todo',
        createdAt: new Date('2025-10-25'),
      },
    ],
  },
  {
    title: 'Recipe Sharing Platform',
    description: 'Social platform for sharing and discovering recipes. Features include recipe upload, ratings, comments, ingredient shopping lists, and meal planning calendar.',
    category: 'Web Development',
    status: 'completed',
    tags: ['Vue.js', 'Express', 'PostgreSQL', 'AWS'],
    deadline: new Date('2025-11-30'),
    githubRepo: 'https://github.com/example/recipe-platform',
    liveDemo: 'https://recipes.example.com',
    isPublic: true,
    tasks: [
      {
        title: 'Database design',
        description: 'PostgreSQL schema for recipes and users',
        status: 'completed',
        createdAt: new Date('2025-08-01'),
        completedAt: new Date('2025-08-05'),
      },
      {
        title: 'Backend API',
        description: 'RESTful API with Express',
        status: 'completed',
        createdAt: new Date('2025-08-06'),
        completedAt: new Date('2025-08-20'),
      },
      {
        title: 'Frontend development',
        description: 'Vue.js SPA with responsive design',
        status: 'completed',
        createdAt: new Date('2025-08-21'),
        completedAt: new Date('2025-09-15'),
      },
      {
        title: 'Deploy to production',
        description: 'AWS EC2 deployment with CI/CD',
        status: 'completed',
        createdAt: new Date('2025-09-16'),
        completedAt: new Date('2025-09-25'),
      },
    ],
  },
  {
    title: 'Virtual Study Group Platform',
    description: 'Real-time collaboration platform for students with video chat, whiteboard, screen sharing, and document collaboration. Includes study session scheduling and recording.',
    category: 'Web Development',
    status: 'active',
    tags: ['WebRTC', 'Socket.io', 'React', 'Node.js', 'MongoDB'],
    deadline: new Date('2026-02-28'),
    githubRepo: 'https://github.com/example/study-platform',
    isPublic: true,
    tasks: [
      {
        title: 'Set up WebRTC',
        description: 'Implement peer-to-peer video connection',
        status: 'in-progress',
        createdAt: new Date('2025-11-10'),
      },
      {
        title: 'Build whiteboard',
        description: 'Canvas-based collaborative drawing tool',
        status: 'todo',
        createdAt: new Date('2025-11-25'),
      },
    ],
  },
  {
    title: 'Expense Tracker with AI Insights',
    description: 'Personal finance app with AI-powered spending analysis and budget recommendations. Tracks expenses, categorizes transactions, and provides financial insights.',
    category: 'Mobile App',
    status: 'planning',
    tags: ['Flutter', 'Firebase', 'ML Kit', 'Charts'],
    deadline: new Date('2026-05-30'),
    isPublic: true,
    tasks: [
      {
        title: 'Design app architecture',
        description: 'Plan database structure and app flow',
        status: 'in-progress',
        createdAt: new Date('2025-11-22'),
      },
    ],
  },
];

const seedProjects = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing projects...');
    await Project.deleteMany({});

    console.log('👥 Finding users...');
    const users = await User.find().limit(5);

    if (users.length === 0) {
      console.error('❌ No users found. Please seed users first.');
      process.exit(1);
    }

    console.log(`Found ${users.length} users`);

    // Assign projects to random users
    const projectsWithOwners = projects.map((project, index) => {
      const owner = users[index % users.length];
      const memberCount = Math.floor(Math.random() * 3) + 1; // 1-3 members
      const members = [owner._id];
      
      // Add random members
      for (let i = 0; i < memberCount - 1; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!members.includes(randomUser._id)) {
          members.push(randomUser._id);
        }
      }

      return {
        ...project,
        owner: owner._id,
        members,
      };
    });

    console.log('📦 Creating projects...');
    await Project.insertMany(projectsWithOwners);

    console.log('✅ Successfully seeded projects!');
    console.log(`Created ${projects.length} projects`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
