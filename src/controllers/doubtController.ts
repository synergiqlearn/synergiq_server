import { Response } from 'express';
import DoubtQuestion from '../models/DoubtQuestion';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all doubt questions
// @route   GET /api/doubts
// @access  Private
export const getDoubts = async (req: AuthRequest, res: Response) => {
  try {
    const { category, tags, search, resolved, sortBy = 'recent' } = req.query;

    let query: any = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }

    // Filter by resolved status
    if (resolved !== undefined) {
      query.isResolved = resolved === 'true';
    }

    // Search
    if (search) {
      query.$text = { $search: search as string };
    }

    // Sorting
    let sort: any = {};
    switch (sortBy) {
      case 'recent':
        sort = { createdAt: -1 };
        break;
      case 'popular':
        sort = { views: -1 };
        break;
      case 'unanswered':
        query['answers.0'] = { $exists: false };
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const doubts = await DoubtQuestion.find(query)
      .populate('author', 'name email category')
      .populate('answers.author', 'name email category')
      .sort(sort)
      .limit(50);

    // Add stats
    const doubtsWithStats = doubts.map(doubt => ({
      ...doubt.toObject(),
      answerCount: doubt.answers.length,
      score: doubt.upvotes.length - doubt.downvotes.length,
    }));

    res.json({ doubts: doubtsWithStats });
  } catch (error) {
    console.error('Error fetching doubts:', error);
    res.status(500).json({ message: 'Failed to fetch doubts' });
  }
};

// @desc    Get single doubt question
// @route   GET /api/doubts/:id
// @access  Private
export const getDoubtById = async (req: AuthRequest, res: Response) => {
  try {
    const doubt = await DoubtQuestion.findById(req.params.id)
      .populate('author', 'name email category')
      .populate('answers.author', 'name email category');

    if (!doubt) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Increment views
    doubt.views += 1;
    await doubt.save();

    const userId = req.user?.id;
    res.json({
      ...doubt.toObject(),
      answerCount: doubt.answers.length,
      score: doubt.upvotes.length - doubt.downvotes.length,
      hasUpvoted: userId ? doubt.upvotes.includes(userId as any) : false,
      hasDownvoted: userId ? doubt.downvotes.includes(userId as any) : false,
    });
  } catch (error) {
    console.error('Error fetching doubt:', error);
    res.status(500).json({ message: 'Failed to fetch doubt' });
  }
};

// @desc    Ask a new question
// @route   POST /api/doubts
// @access  Private
export const askDoubt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, content, tags, category, codeSnippet, codeLanguage } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    const doubt = await DoubtQuestion.create({
      author: userId,
      title,
      content,
      tags: tags || [],
      category: category || 'Other',
      codeSnippet,
      codeLanguage,
    });

    await doubt.populate('author', 'name email category');

    res.status(201).json(doubt);
  } catch (error) {
    console.error('Error creating doubt:', error);
    res.status(500).json({ message: 'Failed to create question' });
  }
};

// @desc    Answer a question
// @route   POST /api/doubts/:id/answers
// @access  Private
export const answerDoubt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { content, codeSnippet, codeLanguage } = req.body;

    if (!content) {
      res.status(400).json({ message: 'Answer content is required' });
      return;
    }

    const doubt = await DoubtQuestion.findById(req.params.id);
    if (!doubt) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    doubt.answers.push({
      author: userId as any,
      content,
      codeSnippet,
      codeLanguage,
      upvotes: [],
      downvotes: [],
      isAccepted: false,
    } as any);

    await doubt.save();
    await doubt.populate('answers.author', 'name email category');

    res.status(201).json(doubt);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ message: 'Failed to add answer' });
  }
};

// @desc    Upvote/downvote question
// @route   POST /api/doubts/:id/vote
// @access  Private
export const voteDoubt = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { voteType } = req.body; // 'up' or 'down'
    const doubt = await DoubtQuestion.findById(req.params.id);

    if (!doubt) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Remove existing votes
    doubt.upvotes = doubt.upvotes.filter(id => id.toString() !== userId);
    doubt.downvotes = doubt.downvotes.filter(id => id.toString() !== userId);

    // Add new vote
    if (voteType === 'up') {
      doubt.upvotes.push(userId as any);
    } else if (voteType === 'down') {
      doubt.downvotes.push(userId as any);
    }

    await doubt.save();
    res.json({ 
      score: doubt.upvotes.length - doubt.downvotes.length,
      hasUpvoted: doubt.upvotes.includes(userId as any),
      hasDownvoted: doubt.downvotes.includes(userId as any),
    });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
};

// @desc    Upvote/downvote answer
// @route   POST /api/doubts/:id/answers/:answerId/vote
// @access  Private
export const voteAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id, answerId } = req.params;
    const { voteType } = req.body;

    const doubt = await DoubtQuestion.findById(id);
    if (!doubt) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    const answer = doubt.answers.find((a: any) => a._id.toString() === answerId);
    if (!answer) {
      res.status(404).json({ message: 'Answer not found' });
      return;
    }

    // Remove existing votes
    answer.upvotes = answer.upvotes.filter((id: any) => id.toString() !== userId);
    answer.downvotes = answer.downvotes.filter((id: any) => id.toString() !== userId);

    // Add new vote
    if (voteType === 'up') {
      answer.upvotes.push(userId as any);
    } else if (voteType === 'down') {
      answer.downvotes.push(userId as any);
    }

    await doubt.save();
    res.json({
      score: answer.upvotes.length - answer.downvotes.length,
      hasUpvoted: answer.upvotes.includes(userId as any),
      hasDownvoted: answer.downvotes.includes(userId as any),
    });
  } catch (error) {
    console.error('Error voting answer:', error);
    res.status(500).json({ message: 'Failed to vote on answer' });
  }
};

// @desc    Accept an answer
// @route   POST /api/doubts/:id/answers/:answerId/accept
// @access  Private (question author only)
export const acceptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id, answerId } = req.params;
    const doubt = await DoubtQuestion.findById(id);

    if (!doubt) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    // Only question author can accept
    if (doubt.author.toString() !== userId) {
      res.status(403).json({ message: 'Only the question author can accept answers' });
      return;
    }

    const answer = doubt.answers.find((a: any) => a._id.toString() === answerId);
    if (!answer) {
      res.status(404).json({ message: 'Answer not found' });
      return;
    }

    // Remove previous acceptance
    doubt.answers.forEach((ans: any) => {
      ans.isAccepted = false;
    });

    // Accept this answer
    answer.isAccepted = true;
    doubt.acceptedAnswer = answerId as any;
    doubt.isResolved = true;

    await doubt.save();
    res.json({ message: 'Answer accepted', doubt });
  } catch (error) {
    console.error('Error accepting answer:', error);
    res.status(500).json({ message: 'Failed to accept answer' });
  }
};

// @desc    Get popular tags
// @route   GET /api/doubts/tags/popular
// @access  Private
export const getPopularTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await DoubtQuestion.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    res.json({ tags: tags.map(t => ({ name: t._id, count: t.count })) });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
};
