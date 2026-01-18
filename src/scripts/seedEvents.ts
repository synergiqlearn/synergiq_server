import dotenv from 'dotenv';
import connectDB from '../config/db';
import Event from '../models/Event';
import User from '../models/User';

dotenv.config();

const seedEvents = async () => {
  try {
    await connectDB();

    // Get first user to be the creator
    const user = await User.findOne();
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    // Clear existing events
    await Event.deleteMany({});
    console.log('🗑️  Cleared existing events');

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const events = [
      {
        title: 'Tech Club Orientation 2025',
        description: `Join us for the orientation of the Tech Club! Learn about our activities, upcoming projects, and how you can be a part of our vibrant community.

Agenda:
- Introduction to Tech Club
- Showcase of past projects
- Upcoming hackathons and events
- Networking session with seniors

Refreshments will be provided!`,
        type: 'club',
        organizer: 'Computer Science Department',
        organizerContact: 'techclub@college.edu',
        date: tomorrow,
        endDate: tomorrow,
        location: 'Auditorium, Main Block',
        isOnline: false,
        registrationLink: 'https://forms.google.com/techclub',
        tags: ['orientation', 'tech-club', 'networking'],
        maxAttendees: 150,
        createdBy: user._id,
      },
      {
        title: 'Summer Internship at TechCorp',
        description: `TechCorp is hiring interns for Summer 2025!

Positions available:
- Software Development Intern
- Data Science Intern
- UI/UX Design Intern

Duration: 2-3 months
Stipend: Competitive
Location: Bangalore / Remote

Requirements:
- Currently pursuing B.Tech/M.Tech
- Strong programming skills
- Good communication skills

Application deadline: January 15, 2025`,
        type: 'internship',
        organizer: 'TechCorp Inc.',
        organizerContact: 'careers@techcorp.com',
        date: new Date('2025-01-15'),
        location: 'Bangalore / Remote',
        isOnline: true,
        registrationLink: 'https://techcorp.com/careers/internships',
        tags: ['internship', 'software', 'summer', 'techcorp'],
        createdBy: user._id,
      },
      {
        title: 'HackNight 2025 - 24 Hour Hackathon',
        description: `Get ready for the biggest hackathon of the year! Build innovative solutions, win prizes, and network with industry experts.

Theme: AI for Social Good

Prizes:
🥇 First Place: $5000 + Internship offers
🥈 Second Place: $3000
🥉 Third Place: $1500

Perks:
- Free food and swag
- Mentorship from industry experts
- Workshop sessions
- Networking opportunities

Teams: 2-4 members
Registration closes: December 20, 2024`,
        type: 'hackathon',
        organizer: 'Innovation Cell',
        organizerContact: 'hacknight@college.edu',
        date: new Date('2025-01-18'),
        endDate: new Date('2025-01-19'),
        location: 'Innovation Hub, College Campus',
        isOnline: false,
        registrationLink: 'https://hacknight.devpost.com',
        tags: ['hackathon', 'ai', 'coding', '24-hours'],
        maxAttendees: 200,
        createdBy: user._id,
      },
      {
        title: 'Full Stack Development Workshop',
        description: `Learn to build complete web applications from scratch!

Topics Covered:
- React.js fundamentals
- Node.js & Express
- MongoDB
- REST API design
- Deployment on cloud

What to bring:
- Laptop with Node.js installed
- Basic knowledge of JavaScript

Certificate of participation will be provided!`,
        type: 'workshop',
        organizer: 'Coding Club',
        organizerContact: 'codingclub@college.edu',
        date: nextWeek,
        endDate: nextWeek,
        location: 'Computer Lab 3',
        isOnline: false,
        registrationLink: 'https://forms.google.com/fullstack-workshop',
        tags: ['workshop', 'fullstack', 'react', 'nodejs'],
        maxAttendees: 50,
        requirements: 'Laptop required',
        createdBy: user._id,
      },
      {
        title: 'Google Kickstart Practice Session',
        description: `Prepare for Google Kickstart with our expert mentors!

Session includes:
- Problem-solving strategies
- Time management tips
- Mock contest
- Q&A with Google employees

All levels welcome!`,
        type: 'competition',
        organizer: 'Competitive Programming Club',
        organizerContact: 'cp@college.edu',
        date: nextWeek,
        location: 'Online (Google Meet)',
        isOnline: true,
        registrationLink: 'https://meet.google.com/abc-defg-hij',
        tags: ['competitive-programming', 'google', 'kickstart'],
        createdBy: user._id,
      },
      {
        title: 'Machine Learning Webinar Series',
        description: `Weekly webinar series on Machine Learning fundamentals and applications.

Week 1: Introduction to ML
Week 2: Supervised Learning
Week 3: Unsupervised Learning
Week 4: Neural Networks
Week 5: Deep Learning Projects

Guest speakers from Google, Microsoft, and Amazon!`,
        type: 'webinar',
        organizer: 'AI/ML Club',
        organizerContact: 'aiml@college.edu',
        date: tomorrow,
        endDate: new Date(tomorrow.getTime() + 35 * 24 * 60 * 60 * 1000), // 5 weeks
        location: 'Online (Zoom)',
        isOnline: true,
        registrationLink: 'https://zoom.us/webinar/ml-series',
        tags: ['machine-learning', 'ai', 'webinar', 'deep-learning'],
        createdBy: user._id,
      },
      {
        title: 'Startup Pitch Competition',
        description: `Pitch your startup idea and win seed funding!

Prize Pool: $10,000
Top 3 teams get mentorship from industry leaders

Eligibility:
- Early-stage startups
- College students/alumni
- Innovation-driven ideas

Judging Criteria:
- Innovation
- Market potential
- Team capability
- Business model`,
        type: 'competition',
        organizer: 'Entrepreneurship Cell',
        organizerContact: 'ecell@college.edu',
        date: nextMonth,
        location: 'Seminar Hall',
        isOnline: false,
        registrationLink: 'https://ecell.college.edu/pitch',
        tags: ['startup', 'entrepreneurship', 'pitch', 'funding'],
        maxAttendees: 30,
        requirements: 'Pitch deck required',
        createdBy: user._id,
      },
      {
        title: 'Adobe Design Challenge',
        description: `Show off your design skills and win Adobe Creative Cloud subscriptions!

Theme: Future of Education

Tools allowed:
- Adobe XD
- Figma
- Sketch

Submission deadline: January 10, 2025
Winners announced: January 15, 2025`,
        type: 'competition',
        organizer: 'Design Club',
        organizerContact: 'design@college.edu',
        date: new Date('2025-01-10'),
        location: 'Online Submission',
        isOnline: true,
        registrationLink: 'https://design-challenge.adobe.com',
        tags: ['design', 'ui-ux', 'adobe', 'competition'],
        createdBy: user._id,
      },
      {
        title: 'Data Science Internship - Analytics Firm',
        description: `Join a leading analytics firm as a Data Science Intern!

Role:
- Data analysis and visualization
- Machine learning model development
- Client presentations

Requirements:
- Python, R, or SQL
- Statistics knowledge
- Communication skills

Duration: 6 months
Stipend: ₹30,000/month
Location: Hybrid (Mumbai)`,
        type: 'internship',
        organizer: 'Analytics Solutions Ltd.',
        organizerContact: 'hr@analytics-solutions.com',
        date: new Date('2025-02-01'),
        location: 'Mumbai / Hybrid',
        isOnline: true,
        registrationLink: 'https://analytics-solutions.com/careers',
        tags: ['internship', 'data-science', 'analytics', 'python'],
        createdBy: user._id,
      },
      {
        title: 'Robotics Club Demo Day',
        description: `See amazing robots built by our club members!

Exhibits:
- Line following robots
- Obstacle avoidance bots
- Robotic arms
- Drone demonstrations

Open to all! Bring your friends and family!`,
        type: 'club',
        organizer: 'Robotics Club',
        organizerContact: 'robotics@college.edu',
        date: nextWeek,
        location: 'Engineering Block Courtyard',
        isOnline: false,
        tags: ['robotics', 'demo', 'showcase', 'engineering'],
        createdBy: user._id,
      },
      {
        title: 'Web3 and Blockchain Workshop',
        description: `Dive into the world of decentralized applications!

Topics:
- Blockchain fundamentals
- Smart contracts with Solidity
- Building DApps
- NFT development
- Web3.js integration

Prerequisites:
- Basic JavaScript knowledge
- Metamask wallet (we'll help you set up)`,
        type: 'workshop',
        organizer: 'Blockchain Club',
        organizerContact: 'blockchain@college.edu',
        date: nextMonth,
        endDate: nextMonth,
        location: 'Computer Lab 5',
        isOnline: false,
        registrationLink: 'https://forms.google.com/blockchain-workshop',
        tags: ['blockchain', 'web3', 'solidity', 'crypto'],
        maxAttendees: 40,
        requirements: 'Laptop with Metamask',
        createdBy: user._id,
      },
      {
        title: 'CodeChef College Chapter Inauguration',
        description: `We're starting a CodeChef chapter at our college!

Join us for:
- Inauguration ceremony
- Coding contest
- Networking with CodeChef team
- Prizes and goodies

All skill levels welcome!`,
        type: 'club',
        organizer: 'CodeChef College Chapter',
        organizerContact: 'codechef@college.edu',
        date: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
        location: 'Multipurpose Hall',
        isOnline: false,
        registrationLink: 'https://www.codechef.com/college-chapter',
        tags: ['coding', 'competitive-programming', 'codechef'],
        maxAttendees: 100,
        createdBy: user._id,
      },
      {
        title: 'Microsoft Learn Student Ambassador Program',
        description: `Become a Microsoft Learn Student Ambassador!

Benefits:
- Microsoft certification vouchers
- Azure credits
- Exclusive swag
- Global community access
- Leadership opportunities

Requirements:
- Passion for technology
- Good communication skills
- Willingness to organize events

Application deadline: December 31, 2024`,
        type: 'other',
        organizer: 'Microsoft',
        organizerContact: 'studentambassadors@microsoft.com',
        date: new Date('2024-12-31'),
        location: 'Online Application',
        isOnline: true,
        registrationLink: 'https://studentambassadors.microsoft.com',
        tags: ['microsoft', 'ambassador', 'opportunity', 'leadership'],
        createdBy: user._id,
      },
      {
        title: 'DevOps Bootcamp',
        description: `Master DevOps tools and practices!

Learn:
- Docker & Kubernetes
- CI/CD pipelines
- Jenkins
- AWS/Azure basics
- Infrastructure as Code

Hands-on projects included!

Duration: 5 days
Timing: 10 AM - 4 PM`,
        type: 'workshop',
        organizer: 'Cloud Computing Club',
        organizerContact: 'cloud@college.edu',
        date: new Date(nextMonth.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(nextMonth.getTime() + 12 * 24 * 60 * 60 * 1000),
        location: 'Cloud Lab',
        isOnline: false,
        registrationLink: 'https://forms.google.com/devops-bootcamp',
        tags: ['devops', 'docker', 'kubernetes', 'cloud'],
        maxAttendees: 30,
        requirements: 'Laptop required, basic Linux knowledge',
        createdBy: user._id,
      },
      {
        title: 'HackerRank University Challenge',
        description: `Compete with students from colleges across India!

Tracks:
- Algorithms
- Data Structures
- Problem Solving

Top performers get:
- HackerRank certificates
- Interview opportunities
- Cash prizes

Contest Duration: 3 hours`,
        type: 'competition',
        organizer: 'HackerRank',
        organizerContact: 'university@hackerrank.com',
        date: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000),
        location: 'Online (HackerRank Platform)',
        isOnline: true,
        registrationLink: 'https://www.hackerrank.com/university-challenge',
        tags: ['coding', 'algorithms', 'hackerrank', 'competition'],
        createdBy: user._id,
      },
      {
        title: 'Product Management 101',
        description: `Learn the fundamentals of Product Management from industry PMs!

Topics:
- Product lifecycle
- User research
- Feature prioritization
- Metrics and analytics
- Stakeholder management

Guest speaker: Senior PM from Google

Q&A session included!`,
        type: 'webinar',
        organizer: 'Product Club',
        organizerContact: 'product@college.edu',
        date: nextWeek,
        location: 'Online (Google Meet)',
        isOnline: true,
        registrationLink: 'https://meet.google.com/product-101',
        tags: ['product-management', 'webinar', 'career', 'google'],
        createdBy: user._id,
      },
      {
        title: 'Graphic Design Workshop with Canva',
        description: `Create stunning designs with Canva!

Learn to design:
- Social media posts
- Posters and flyers
- Presentations
- Infographics

No prior experience needed!

Free Canva Pro trial included!`,
        type: 'workshop',
        organizer: 'Design Club',
        organizerContact: 'design@college.edu',
        date: new Date(tomorrow.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(tomorrow.getTime() + 5 * 24 * 60 * 60 * 1000),
        location: 'Design Studio',
        isOnline: false,
        registrationLink: 'https://forms.google.com/canva-workshop',
        tags: ['design', 'canva', 'graphics', 'beginner-friendly'],
        maxAttendees: 35,
        createdBy: user._id,
      },
      {
        title: 'AWS Internship Opportunity',
        description: `Amazon Web Services is hiring interns!

Positions:
- Cloud Support Intern
- Solutions Architect Intern
- DevOps Intern

Location: Hyderabad
Duration: 6 months
Stipend: Competitive + Pre-placement offer opportunity

Requirements:
- B.Tech 3rd/4th year or M.Tech
- Cloud computing knowledge
- Problem-solving skills

Application deadline: January 20, 2025`,
        type: 'internship',
        organizer: 'Amazon Web Services',
        organizerContact: 'aws-university@amazon.com',
        date: new Date('2025-01-20'),
        location: 'Hyderabad',
        isOnline: false,
        registrationLink: 'https://amazon.jobs/aws-internships',
        tags: ['internship', 'aws', 'cloud', 'amazon'],
        createdBy: user._id,
      },
      {
        title: 'Music Club Jam Session',
        description: `Calling all musicians! Join our monthly jam session.

Bring your instruments or just come to enjoy the music!

Open mic available
All genres welcome

Free snacks and beverages!`,
        type: 'club',
        organizer: 'Music Club',
        organizerContact: 'music@college.edu',
        date: new Date(nextWeek.getTime() + 10 * 24 * 60 * 60 * 1000),
        location: 'Student Activity Center',
        isOnline: false,
        tags: ['music', 'jam-session', 'entertainment', 'club'],
        createdBy: user._id,
      },
      {
        title: 'Cybersecurity CTF Challenge',
        description: `Test your hacking skills in our Capture The Flag competition!

Categories:
- Web exploitation
- Cryptography
- Reverse engineering
- Forensics
- Binary exploitation

Prizes:
- Top 3 teams win cash prizes
- Certificates for all participants

Teams: 1-3 members`,
        type: 'competition',
        organizer: 'Cybersecurity Club',
        organizerContact: 'cybersec@college.edu',
        date: nextMonth,
        endDate: nextMonth,
        location: 'Online (CTFd Platform)',
        isOnline: true,
        registrationLink: 'https://ctf.college.edu',
        tags: ['cybersecurity', 'ctf', 'hacking', 'competition'],
        maxAttendees: 100,
        createdBy: user._id,
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Successfully seeded ${createdEvents.length} events`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
};

seedEvents();
