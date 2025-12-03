import { Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide content and postId',
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post is locked
    if (post.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This post is locked and cannot receive new comments',
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user?._id,
      post: postId,
      parentComment: parentCommentId || null,
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    // If it's a reply, add to parent comment's replies
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        parentComment.replies.push(comment._id);
        await parentComment.save();
      }
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email')
      .populate('parentComment');

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      comment: populatedComment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Private
export const getPostComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get top-level comments only (no parent)
    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'name email')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Comment.countDocuments({ post: postId, parentComment: null });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      comments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide content',
      });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate('author', 'name email');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    // Remove comment from parent comment's replies if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Like/Unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
export const likeComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    const userId = req.user?._id;
    const hasLiked = comment.likes.some((id) => id.toString() === userId?.toString());

    if (hasLiked) {
      // Unlike
      comment.likes = comment.likes.filter((id) => id.toString() !== userId?.toString());
    } else {
      // Like
      comment.likes.push(userId!);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: hasLiked ? 'Comment unliked' : 'Comment liked',
      likes: comment.likes.length,
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
