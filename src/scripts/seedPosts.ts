import dotenv from 'dotenv';
import connectDB from '../config/db';
import Post from '../models/Post';
import User from '../models/User';

dotenv.config();

const seedPosts = async () => {
  try {
    await connectDB();

    // Get first user to be the author
    const user = await User.findOne();
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    // Clear existing posts
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing posts');

    const posts = [
      {
        title: 'Welcome to Thozha Community! 🎉',
        content: `Hey everyone! Welcome to our new community forum. This is a space where we can share knowledge, ask questions, collaborate on projects, and help each other grow. 

Feel free to introduce yourself, share your learning journey, or ask for help on anything you're working on. Let's build an amazing community together!

Some ground rules:
- Be respectful and supportive
- Share knowledge freely
- Help others when you can
- Have fun learning!`,
        category: 'General',
        tags: ['welcome', 'introduction', 'community'],
        author: user._id,
        isPinned: true,
      },
      {
        title: 'Looking for teammates for a React Native mobile app project',
        content: `I'm planning to build a fitness tracking mobile app using React Native and need 2-3 teammates. Looking for:
- 1 Backend developer (Node.js/Express)
- 1 UI/UX designer
- 1 React Native developer

The project aims to help users track workouts, set goals, and connect with workout buddies. Timeline: 3 months. Comment below if interested!`,
        category: 'Projects',
        tags: ['react-native', 'mobile-app', 'team-project', 'fitness'],
        author: user._id,
      },
      {
        title: 'How to prepare for software engineering interviews?',
        content: `I have interviews coming up with some tech companies and I'm feeling a bit overwhelmed. What are the best resources and strategies you've used to prepare for:
- Data structures and algorithms
- System design
- Behavioral questions
- Coding challenges

Any advice would be greatly appreciated!`,
        category: 'Career',
        tags: ['interviews', 'career', 'preparation', 'advice'],
        author: user._id,
      },
      {
        title: 'Mastering TypeScript: Tips from my learning journey',
        content: `After 6 months of using TypeScript, here are my top tips:

1. Start with strict mode from day one
2. Use interfaces for object shapes
3. Leverage utility types (Partial, Pick, Omit)
4. Don't use 'any' - use 'unknown' instead
5. Learn generics - they're powerful!
6. Use type guards for runtime checks

What are your favorite TypeScript features?`,
        category: 'Skills',
        tags: ['typescript', 'javascript', 'programming', 'tips'],
        author: user._id,
      },
      {
        title: 'Hackathon this weekend at Tech Park!',
        content: `There's a 24-hour hackathon happening this Saturday-Sunday at Tech Park. Theme is "AI for Good". 

Registration: techpark.com/hackathon
Prizes: $5000 first place
Perks: Free food, mentorship, swag

Who's going? Let's form a team!`,
        category: 'Events',
        tags: ['hackathon', 'ai', 'competition', 'networking'],
        author: user._id,
      },
      {
        title: 'Help needed: MongoDB aggregation pipeline issue',
        content: `I'm trying to create a complex aggregation pipeline to calculate user statistics, but I'm getting incorrect results. 

Here's what I'm trying to do:
- Group users by department
- Calculate average score
- Sort by total projects completed

Anyone experienced with MongoDB aggregations who can help?`,
        category: 'Help',
        tags: ['mongodb', 'database', 'help', 'aggregation'],
        author: user._id,
      },
      {
        title: 'Free AWS certifications study materials',
        content: `I recently passed my AWS Solutions Architect Associate exam and want to share the resources that helped me:

1. AWS Free Tier hands-on practice
2. A Cloud Guru course (amazing!)
3. AWS documentation deep dives
4. Practice exams on Tutorials Dojo
5. YouTube channels: FreeCodeCamp, Stephane Maarek

Happy to answer any questions about the exam!`,
        category: 'Resources',
        tags: ['aws', 'cloud', 'certification', 'free-resources'],
        author: user._id,
      },
      {
        title: 'Daily coding challenge: Implement a LRU Cache',
        content: `Let's do a coding challenge together! 

Problem: Design and implement a Least Recently Used (LRU) cache with O(1) operations.

Requirements:
- get(key): Get the value if key exists
- put(key, value): Update or insert key-value pair
- When cache reaches capacity, invalidate least recently used item

Drop your solutions in the comments! Any language welcome.`,
        category: 'General',
        tags: ['coding-challenge', 'algorithms', 'data-structures'],
        author: user._id,
      },
      {
        title: 'Building a full-stack e-commerce platform - Progress Update',
        content: `Week 3 update on my e-commerce project:

✅ User authentication with JWT
✅ Product catalog with search
✅ Shopping cart functionality
🚧 Payment integration (Stripe)
🚧 Order tracking system
⏰ Admin dashboard

Stack: Next.js 14, TypeScript, PostgreSQL, Prisma, TailwindCSS

Would love feedback on the architecture!`,
        category: 'Projects',
        tags: ['full-stack', 'ecommerce', 'nextjs', 'progress'],
        author: user._id,
      },
      {
        title: 'Career switch from mechanical to software engineering',
        content: `I'm a mechanical engineer looking to transition into software development. I've been learning programming for 8 months now (Python, JavaScript, React).

Questions for those who've made similar transitions:
- How long did it take you?
- What projects helped you land your first job?
- Should I pursue a bootcamp or self-study?
- How do I explain the career gap in interviews?

Any advice is much appreciated!`,
        category: 'Career',
        tags: ['career-change', 'advice', 'self-taught', 'motivation'],
        author: user._id,
      },
      {
        title: 'Docker vs Kubernetes: When to use what?',
        content: `I understand Docker containers, but I'm confused about when to use Kubernetes. 

Can someone explain:
- What problems does K8s solve?
- When is Docker Compose enough?
- Is K8s overkill for small projects?
- Best resources to learn K8s?

Thanks!`,
        category: 'Skills',
        tags: ['docker', 'kubernetes', 'devops', 'containers'],
        author: user._id,
      },
      {
        title: 'Workshop: Introduction to Machine Learning - This Friday!',
        content: `Free ML workshop happening this Friday 6 PM at Innovation Hub!

Topics covered:
- ML fundamentals
- Supervised vs Unsupervised learning
- Hands-on with scikit-learn
- Building your first model

Register: innovationhub.com/ml-workshop
Limited seats available!`,
        category: 'Events',
        tags: ['machine-learning', 'workshop', 'python', 'ai'],
        author: user._id,
      },
      {
        title: 'Git merge conflicts - How do you handle them?',
        content: `I'm working on a team project and we keep running into merge conflicts. It's becoming really frustrating.

What's your workflow to minimize conflicts?
- Do you use feature branches?
- How often do you pull from main?
- Any tools that make this easier?

Share your best practices!`,
        category: 'Help',
        tags: ['git', 'version-control', 'collaboration', 'help'],
        author: user._id,
      },
      {
        title: 'Amazing free course: Full Stack Open 2024',
        content: `Just finished Full Stack Open (fullstackopen.com) and it's absolutely incredible!

What you'll learn:
- React with hooks
- Node.js & Express
- MongoDB
- GraphQL
- TypeScript
- Testing (Jest, Cypress)
- CI/CD

Completely free, university-level quality. Highly recommend!`,
        category: 'Resources',
        tags: ['free-course', 'full-stack', 'react', 'nodejs'],
        author: user._id,
      },
      {
        title: 'Should I learn Vue or stick with React?',
        content: `I've been using React for 2 years and I'm comfortable with it. But I keep hearing great things about Vue 3 and its composition API.

For those who've used both:
- Is it worth learning Vue?
- How different is the learning curve?
- Which has better job opportunities?
- Can you recommend Vue 3 resources?

Thoughts?`,
        category: 'General',
        tags: ['react', 'vue', 'frontend', 'discussion'],
        author: user._id,
      },
      {
        title: 'Open source contribution - Where to start?',
        content: `I want to start contributing to open source projects but I don't know where to begin. 

Looking for advice on:
- How to find beginner-friendly projects
- Understanding contribution guidelines
- Making your first PR
- Dealing with code review feedback

If you have experience contributing to OSS, please share your journey!`,
        category: 'Skills',
        tags: ['open-source', 'github', 'contribution', 'beginner'],
        author: user._id,
      },
      {
        title: 'Tech meetup: System Design Study Group forming!',
        content: `Starting a study group focused on system design interviews. We'll meet every Saturday morning to:

- Discuss system design concepts
- Practice whiteboarding sessions
- Review real interview questions
- Share resources and tips

Interested? Comment below and I'll create a Discord server!`,
        category: 'Events',
        tags: ['study-group', 'system-design', 'interviews', 'learning'],
        author: user._id,
      },
      {
        title: 'React useEffect cleanup - Not working as expected',
        content: `I have a useEffect hook that sets up a WebSocket connection, but the cleanup function isn't being called when the component unmounts. This is causing memory leaks.

Code snippet:
useEffect(() => {
  const ws = new WebSocket(url);
  return () => ws.close();
}, [url]);

What am I doing wrong? Any help would be appreciated!`,
        category: 'Help',
        tags: ['react', 'hooks', 'websocket', 'debugging'],
        author: user._id,
      },
      {
        title: 'Best practices for REST API design',
        content: `After building several APIs, here are the best practices I follow:

1. Use nouns for endpoints (/users, not /getUsers)
2. HTTP methods matter (GET, POST, PUT, DELETE)
3. Version your API (/api/v1/)
4. Use proper status codes
5. Implement pagination
6. Add filtering and sorting
7. Document with Swagger/OpenAPI
8. Rate limiting for security

What would you add to this list?`,
        category: 'Skills',
        tags: ['api', 'rest', 'backend', 'best-practices'],
        author: user._id,
      },
      {
        title: 'Cheat sheets collection for developers',
        content: `I've curated a collection of useful cheat sheets that I reference constantly:

- Git commands
- Linux terminal
- Docker commands
- SQL queries
- Regex patterns
- HTTP status codes
- Python built-ins
- JavaScript array methods

GitHub repo: github.com/dev-cheatsheets (example)
Feel free to contribute more!`,
        category: 'Resources',
        tags: ['cheat-sheets', 'productivity', 'reference', 'tools'],
        author: user._id,
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`✅ Successfully seeded ${createdPosts.length} posts`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
