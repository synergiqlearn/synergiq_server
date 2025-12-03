import { Response } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all posts with filters
// @route   GET /api/posts
// @access  Private
export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      category,
      tags,
      search,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query: any = {};

    // Apply filters
    if (category && category !== 'All') {
      query.category = category;
    }

    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: any = {};
    
    // Pinned posts always come first
    sort.isPinned = -1;
    sort[sortBy as string] = sortOrder;

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: [
          { path: 'author', select: 'name email' },
          {
            path: 'replies',
            populate: { path: 'author', select: 'name email' },
          },
        ],
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content',
      });
    }

    const post = await Post.create({
      title,
      content,
      category: category || 'General',
      tags: tags || [],
      author: req.user?._id,
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, content, category, tags } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user?._id;
    const hasLiked = post.likes.some((id) => id.toString() === userId?.toString());

    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId?.toString());
    } else {
      // Like
      post.likes.push(userId!);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      hasLiked: !hasLiked,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
