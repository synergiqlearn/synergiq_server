import { Response } from 'express';
import Resource from '../models/Resource';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all resources with filters
// @route   GET /api/resources
// @access  Private
export const getAllResources = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      difficulty,
      category,
      tags,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {};

    // Apply filters
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (category && category !== 'All') query.category = { $in: [category, 'All'] };
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };

    // Search in title, description, tags
    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      resources,
    });
  } catch (error: any) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Private
export const getResourceById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Increment views
    resource.views = (resource.views || 0) + 1;
    await resource.save();

    res.status(200).json({
      success: true,
      resource,
    });
  } catch (error: any) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private
export const createResource = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      type,
      url,
      description,
      thumbnail,
      tags,
      difficulty,
      category,
      author,
      duration,
    } = req.body;

    const resource = await Resource.create({
      title,
      type,
      url,
      description,
      thumbnail,
      tags: Array.isArray(tags) ? tags : [],
      difficulty,
      category,
      author,
      duration,
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource,
    });
  } catch (error: any) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private
export const updateResource = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource',
      });
      return;
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource: updatedResource,
    });
  } catch (error: any) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
export const deleteResource = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
      return;
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user?._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource',
      });
      return;
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get recommended resources based on user category
// @route   GET /api/resources/recommended
// @access  Private
export const getRecommendedResources = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userCategory = req.user?.category;

    if (!userCategory) {
      res.status(400).json({
        success: false,
        message: 'Please complete the questionnaire first',
      });
      return;
    }

    const { type, difficulty, page = 1, limit = 12 } = req.query;

    const query: any = {
      category: { $in: [userCategory, 'All'] },
    };

    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      category: userCategory,
      count: resources.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      resources,
    });
  } catch (error: any) {
    console.error('Get recommended resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Search resources
// @route   GET /api/resources/search
// @access  Private
export const searchResources = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
      return;
    }

    const resources = await Resource.find({
      $text: { $search: q as string },
    })
      .populate('createdBy', 'name email')
      .limit(20);

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });
  } catch (error: any) {
    console.error('Search resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
