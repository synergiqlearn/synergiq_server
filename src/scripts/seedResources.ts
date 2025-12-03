import dotenv from 'dotenv';
import connectDB from '../config/db';
import Resource from '../models/Resource';
import User from '../models/User';

dotenv.config();

const resources = [
  // Explorer Resources
  {
    title: 'Introduction to Web Development',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ysEN5RaKOlA',
    description: 'Complete beginner-friendly tutorial covering HTML, CSS, and JavaScript fundamentals',
    thumbnail: 'https://i.ytimg.com/vi/ysEN5RaKOlA/maxresdefault.jpg',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Development', 'Beginner'],
    difficulty: 'Beginner',
    category: 'Explorer',
    author: 'Programming with Mosh',
    duration: '1 hour',
  },
  {
    title: 'Python for Everybody',
    type: 'course',
    url: 'https://www.py4e.com/',
    description: 'Free Python course with video lessons, assignments, and auto-graded exercises',
    tags: ['Python', 'Programming', 'Data Science'],
    difficulty: 'Beginner',
    category: 'Explorer',
    author: 'Dr. Charles Severance',
    duration: '10 weeks',
  },
  {
    title: 'MDN Web Docs',
    type: 'documentation',
    url: 'https://developer.mozilla.org/',
    description: 'Comprehensive documentation for web technologies including HTML, CSS, and JavaScript',
    tags: ['Documentation', 'Web', 'Reference'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'Mozilla',
    duration: 'Reference',
  },
  
  // Achiever Resources
  {
    title: 'Full Stack Open',
    type: 'course',
    url: 'https://fullstackopen.com/',
    description: 'Deep dive into modern web development with React, Node.js, MongoDB, and GraphQL',
    tags: ['React', 'Node.js', 'MongoDB', 'Full Stack'],
    difficulty: 'Intermediate',
    category: 'Achiever',
    author: 'University of Helsinki',
    duration: '12 weeks',
  },
  {
    title: 'LeetCode - Top Interview Questions',
    type: 'tutorial',
    url: 'https://leetcode.com/explore/interview/card/top-interview-questions-easy/',
    description: 'Practice coding challenges commonly asked in technical interviews',
    tags: ['Algorithms', 'Data Structures', 'Interview Prep'],
    difficulty: 'Intermediate',
    category: 'Achiever',
    author: 'LeetCode',
    duration: '50+ problems',
  },
  {
    title: 'System Design Primer',
    type: 'article',
    url: 'https://github.com/donnemartin/system-design-primer',
    description: 'Learn how to design large-scale systems with this comprehensive guide',
    tags: ['System Design', 'Architecture', 'Scalability'],
    difficulty: 'Advanced',
    category: 'Strategist',
    author: 'Donne Martin',
    duration: '2-3 weeks',
  },
  
  // Strategist Resources
  {
    title: 'Clean Code by Robert Martin',
    type: 'book',
    url: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    description: 'Essential guide to writing maintainable and professional code',
    tags: ['Software Engineering', 'Best Practices', 'Clean Code'],
    difficulty: 'Intermediate',
    category: 'Strategist',
    author: 'Robert C. Martin',
    duration: '464 pages',
  },
  {
    title: 'Design Patterns in Software Engineering',
    type: 'course',
    url: 'https://refactoring.guru/design-patterns',
    description: 'Comprehensive guide to software design patterns with examples',
    tags: ['Design Patterns', 'Architecture', 'OOP'],
    difficulty: 'Advanced',
    category: 'Strategist',
    author: 'Refactoring Guru',
    duration: '23 patterns',
  },
  {
    title: 'AWS Certified Solutions Architect',
    type: 'course',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    description: 'Learn cloud architecture and prepare for AWS certification',
    tags: ['AWS', 'Cloud', 'Architecture', 'DevOps'],
    difficulty: 'Advanced',
    category: 'Strategist',
    author: 'Amazon Web Services',
    duration: '8-12 weeks',
  },
  
  // Practitioner Resources
  {
    title: 'Build a REST API with Node.js',
    type: 'tutorial',
    url: 'https://www.youtube.com/watch?v=fgTGADljAeg',
    description: 'Hands-on tutorial to build a complete REST API from scratch',
    tags: ['Node.js', 'Express', 'REST API', 'Backend'],
    difficulty: 'Intermediate',
    category: 'Practitioner',
    author: 'Traversy Media',
    duration: '1.5 hours',
  },
  {
    title: 'React Projects for Beginners',
    type: 'tutorial',
    url: 'https://www.youtube.com/watch?v=a_7Z7C_JCyo',
    description: 'Build 15 React projects to master frontend development',
    tags: ['React', 'JavaScript', 'Frontend', 'Projects'],
    difficulty: 'Beginner',
    category: 'Practitioner',
    author: 'freeCodeCamp',
    duration: '9 hours',
  },
  {
    title: 'Docker Tutorial for Beginners',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=pTFZFxd4hOI',
    description: 'Learn Docker containerization with practical examples',
    tags: ['Docker', 'DevOps', 'Containers'],
    difficulty: 'Beginner',
    category: 'Practitioner',
    author: 'Programming with Mosh',
    duration: '1 hour',
  },
  
  // General Resources for All
  {
    title: 'Git and GitHub for Beginners',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    description: 'Master version control with Git and collaboration with GitHub',
    tags: ['Git', 'GitHub', 'Version Control'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'freeCodeCamp',
    duration: '1 hour',
  },
  {
    title: 'CS50: Introduction to Computer Science',
    type: 'course',
    url: 'https://cs50.harvard.edu/x/',
    description: 'Harvard\'s famous introduction to computer science and programming',
    tags: ['Computer Science', 'Programming', 'Algorithms'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'Harvard University',
    duration: '12 weeks',
  },
  {
    title: 'The Odin Project',
    type: 'course',
    url: 'https://www.theodinproject.com/',
    description: 'Free full-stack curriculum with projects and community support',
    tags: ['Full Stack', 'Web Development', 'Ruby', 'JavaScript'],
    difficulty: 'Intermediate',
    category: 'All',
    author: 'The Odin Project',
    duration: '6-12 months',
  },
  {
    title: 'JavaScript.info',
    type: 'documentation',
    url: 'https://javascript.info/',
    description: 'Modern JavaScript tutorial from basics to advanced concepts',
    tags: ['JavaScript', 'Tutorial', 'Web Development'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'Ilya Kantor',
    duration: 'Reference',
  },
  {
    title: 'freeCodeCamp Curriculum',
    type: 'course',
    url: 'https://www.freecodecamp.org/',
    description: 'Free coding bootcamp with certifications in web development',
    tags: ['Web Development', 'JavaScript', 'React', 'Certifications'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'freeCodeCamp',
    duration: '300+ hours',
  },
  {
    title: 'TypeScript Handbook',
    type: 'documentation',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    description: 'Official TypeScript documentation and best practices',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    difficulty: 'Intermediate',
    category: 'All',
    author: 'Microsoft',
    duration: 'Reference',
  },
  {
    title: 'Scrimba - Learn to Code',
    type: 'course',
    url: 'https://scrimba.com/',
    description: 'Interactive coding courses with hands-on practice',
    tags: ['Web Development', 'React', 'JavaScript', 'Interactive'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'Scrimba',
    duration: 'Various',
  },
  {
    title: 'Tailwind CSS Documentation',
    type: 'documentation',
    url: 'https://tailwindcss.com/docs',
    description: 'Utility-first CSS framework documentation with examples',
    tags: ['CSS', 'Tailwind', 'Styling', 'Frontend'],
    difficulty: 'Beginner',
    category: 'All',
    author: 'Tailwind Labs',
    duration: 'Reference',
  },
];

const seedResources = async () => {
  try {
    await connectDB();

    // Clear existing resources
    await Resource.deleteMany({});

    // Find a user to assign as creator (you can modify this)
    const user = await User.findOne();
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    // Add createdBy field to all resources
    const resourcesWithCreator = resources.map((resource) => ({
      ...resource,
      createdBy: user._id,
    }));

    // Insert resources
    await Resource.insertMany(resourcesWithCreator);

    console.log(`✅ Successfully seeded ${resources.length} resources`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding resources:', error);
    process.exit(1);
  }
};

seedResources();
