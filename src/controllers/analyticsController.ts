import { Request, Response } from 'express';
import User from '../models/User';
import UserSkill from '../models/UserSkill';
import Project from '../models/Project';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';

// Get user analytics stats
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get all user skills
    const skills = await UserSkill.find({ user: userId }).populate('skill');

    // Calculate analytics
    const completed = skills.filter(s => s.status === 'completed').length;
    const inProgress = skills.filter(s => s.status === 'in-progress').length;
    const notStarted = skills.filter(s => s.status === 'not-started').length;
    
    const avgProgress = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.progress, 0) / skills.length)
      : 0;

    // Calculate total time spent (sum of all skill progress * estimated hours)
    const totalTimeSpent = Math.round(
      skills.reduce((acc, s) => {
        const estimatedHours = 20; // Average hours per skill
        return acc + (s.progress / 100) * estimatedHours;
      }, 0)
    );

    // Calculate streak (mock for now - would need activity tracking)
    const user = await User.findById(userId);
    const currentStreak = calculateStreak(user?.createdAt || new Date());

    // Get category distribution
    const categoryDistribution = await getCategoryDistribution(userId);

    // Get weekly progress (last 7 days)
    const weeklyProgress = await getWeeklyProgress(userId);

    // Get monthly progress (last 6 months)
    const monthlyProgress = await getMonthlyProgress(userId);

    res.json({
      stats: {
        currentStreak,
        longestStreak: currentStreak + Math.floor(Math.random() * 5),
        totalTimeSpent,
        skillsInProgress: inProgress,
        skillsCompleted: completed,
        skillsNotStarted: notStarted,
        averageProgress: avgProgress,
        totalSkills: skills.length
      },
      categoryDistribution,
      weeklyProgress,
      monthlyProgress
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Calculate user streak (days since registration)
const calculateStreak = (createdAt: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get category distribution
const getCategoryDistribution = async (userId: string) => {
  const skills = await UserSkill.find({ user: userId })
    .populate('skill');

  const categoryMap: { [key: string]: number } = {};

  skills.forEach((userSkill: any) => {
    const category = userSkill.skill?.category || 'Other';
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const colors: { [key: string]: string } = {
    'Frontend': '#3b82f6',
    'Backend': '#10b981',
    'AI/ML': '#8b5cf6',
    'DevOps': '#f59e0b',
    'Mobile': '#ec4899',
    'Cybersecurity': '#ef4444',
    'System Design': '#06b6d4',
    'Other': '#6b7280'
  };

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    color: colors[name] || '#6b7280'
  }));
};

// Get weekly progress (last 7 days)
const getWeeklyProgress = async (userId: string) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  
  // Reorder to start from Monday
  const orderedDays = [...days.slice(1), days[0]];
  
  // Mock data for now - would need activity tracking
  return orderedDays.map((day, index) => ({
    day,
    hours: Math.random() * 5 + 1, // 1-6 hours
    skills: Math.floor(Math.random() * 4) + 1 // 1-4 skills
  }));
};

// Get monthly progress (last 6 months)
const getMonthlyProgress = async (userId: string) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  const skills = await UserSkill.find({ user: userId });
  const completed = skills.filter(s => s.status === 'completed').length;
  const inProgress = skills.filter(s => s.status === 'in-progress').length;

  // Generate progression data
  return months.map((month, index) => {
    const factor = (index + 1) / months.length;
    return {
      month,
      completed: Math.floor(completed * factor),
      inProgress: Math.floor(inProgress * factor)
    };
  });
};

// Get user goals (placeholder - would need Goals model)
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    
    // Mock goals for now - would need Goals model
    const goals = [
      { 
        id: 1, 
        title: 'Complete 3 skills this month', 
        progress: 66, 
        target: 3, 
        current: 2,
        createdAt: new Date()
      },
      { 
        id: 2, 
        title: 'Spend 20 hours learning', 
        progress: 45, 
        target: 20, 
        current: 9,
        createdAt: new Date()
      }
    ];

    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Failed to fetch goals' });
  }
};

// Create a new goal
export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const { title, target } = req.body;

    // Would save to Goals model
    const goal = {
      id: Date.now(),
      title,
      target,
      current: 0,
      progress: 0,
      createdAt: new Date()
    };

    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Failed to create goal' });
  }
};

// Update goal progress
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { current } = req.body;

    // Would update Goals model
    res.json({ message: 'Goal updated successfully' });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Failed to update goal' });
  }
};
