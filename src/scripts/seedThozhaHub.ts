import dotenv from 'dotenv';
import connectDB from '../config/db';
import StudyGroup from '../models/StudyGroup';
import DoubtQuestion from '../models/DoubtQuestion';
import User from '../models/User';

dotenv.config();

const seedGroups = async () => {
  try {
    await connectDB();

    // Find a user to be admin (using first user)
    const users = await User.find().limit(5);
    if (users.length === 0) {
      console.log('No users found. Please create users first.');
      process.exit(1);
    }

    const groups = [
      {
        name: 'React Developers',
        description: 'Learn and discuss React.js, hooks, and best practices',
        category: 'Frontend',
        tags: ['react', 'javascript', 'hooks', 'components'],
        admin: users[0]._id,
        members: users.slice(0, 3).map(u => u._id),
        isPublic: true,
        rules: 'Be respectful, share knowledge, and help each other learn.',
      },
      {
        name: 'Python & Django',
        description: 'Backend development with Python and Django framework',
        category: 'Backend',
        tags: ['python', 'django', 'backend', 'rest-api'],
        admin: users[1]._id,
        members: users.slice(1, 4).map(u => u._id),
        isPublic: true,
      },
      {
        name: 'Machine Learning Enthusiasts',
        description: 'Discuss ML algorithms, models, and real-world applications',
        category: 'AI/ML',
        tags: ['machine-learning', 'ai', 'python', 'tensorflow'],
        admin: users[0]._id,
        members: users.slice(0, 2).map(u => u._id),
        isPublic: true,
      },
      {
        name: 'DevOps & Cloud',
        description: 'Docker, Kubernetes, AWS, Azure, and DevOps practices',
        category: 'DevOps',
        tags: ['devops', 'docker', 'kubernetes', 'aws', 'cloud'],
        admin: users[2]._id,
        members: users.slice(2, 5).map(u => u._id),
        isPublic: true,
      },
      {
        name: 'Mobile App Development',
        description: 'React Native, Flutter, and native mobile development',
        category: 'Mobile',
        tags: ['react-native', 'flutter', 'mobile', 'ios', 'android'],
        admin: users[1]._id,
        members: users.slice(0, 3).map(u => u._id),
        isPublic: true,
      },
    ];

    await StudyGroup.deleteMany({});
    const createdGroups = await StudyGroup.insertMany(groups);
    console.log(`✅ Created ${createdGroups.length} study groups`);

    // Seed some doubt questions
    const doubts = [
      {
        author: users[0]._id,
        title: 'How to handle async operations in React?',
        content: 'I\'m struggling with managing async data fetching in React components. Should I use useEffect with async functions or a separate async function?',
        category: 'Frontend',
        tags: ['react', 'async', 'hooks', 'useeffect'],
        codeSnippet: `useEffect(() => {\n  async function fetchData() {\n    const data = await api.get('/data');\n    setData(data);\n  }\n  fetchData();\n}, []);`,
        codeLanguage: 'javascript',
      },
      {
        author: users[1]._id,
        title: 'Best way to structure Django REST API?',
        content: 'What is the recommended project structure for a large Django REST API with multiple apps?',
        category: 'Backend',
        tags: ['django', 'python', 'rest-api', 'architecture'],
      },
      {
        author: users[2]._id,
        title: 'Difference between supervised and unsupervised learning?',
        content: 'Can someone explain with examples when to use supervised vs unsupervised learning algorithms?',
        category: 'AI/ML',
        tags: ['machine-learning', 'algorithms', 'supervised', 'unsupervised'],
      },
      {
        author: users[0]._id,
        title: 'Docker vs Kubernetes - When to use which?',
        content: 'I understand Docker containerizes applications, but when should I use Kubernetes? Is it overkill for small projects?',
        category: 'DevOps',
        tags: ['docker', 'kubernetes', 'containers', 'devops'],
      },
      {
        author: users[3]._id,
        title: 'React Native performance optimization tips?',
        content: 'My React Native app is lagging on older devices. What are some best practices for performance optimization?',
        category: 'Mobile',
        tags: ['react-native', 'performance', 'optimization', 'mobile'],
      },
    ];

    await DoubtQuestion.deleteMany({});
    const createdDoubts = await DoubtQuestion.insertMany(doubts);
    console.log(`✅ Created ${createdDoubts.length} doubt questions`);

    console.log('\n✨ Thozha Hub data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedGroups();
