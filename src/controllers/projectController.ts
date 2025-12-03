import { Response } from 'express';
import Project from '../models/Project';
import { AuthRequest } from '../middleware/auth';

// @desc    Get recommended projects based on user category
// @route   GET /api/projects/recommended
// @access  Private
export const getRecommendedProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userCategory = req.user?.category;

    if (!userCategory) {
      res.status(400).json({
        success: false,
        message: 'Please complete the questionnaire first',
      });
      return;
    }

    const { page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Recommend public projects or projects user can collaborate on
    // Filter by user's learning category for better matches
    const query: any = {
      isPublic: true,
      status: { $in: ['planning', 'in-progress'] }, // Active projects
    };

    const projects = await Project.find(query)
      .populate('owner', 'name email category')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Prioritize projects from users with same category
    const sortedProjects = projects.sort((a: any, b: any) => {
      const aMatch = a.owner?.category === userCategory ? 1 : 0;
      const bMatch = b.owner?.category === userCategory ? 1 : 0;
      return bMatch - aMatch;
    });

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      category: userCategory,
      count: sortedProjects.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      projects: sortedProjects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get all projects with filters
// @route   GET /api/projects
// @access  Private
export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const {
      status,
      category,
      tags,
      search,
      myProjects,
      page = '1',
      limit = '12',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query: any = {};

    // Show only public projects or projects user is part of
    if (myProjects === 'true') {
      query.$or = [
        { owner: req.user?._id },
        { members: req.user?._id },
      ];
    } else {
      query.$or = [
        { isPublic: true },
        { owner: req.user?._id },
        { members: req.user?._id },
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }

    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: any = {};
    sort[sortBy as string] = sortOrder;

    const projects = await Project.find(query)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user has access to this project
    const userId = req.user?._id.toString();
    const isOwner = project.owner._id.toString() === userId;
    const isMember = project.members.some((member: any) => member._id.toString() === userId);

    if (!project.isPublic && !isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      deadline,
      githubRepo,
      liveDemo,
      isPublic,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category',
      });
    }

    const project = await Project.create({
      title,
      description,
      owner: req.user?._id,
      members: [req.user?._id], // Owner is automatically a member
      category,
      tags: tags || [],
      deadline,
      githubRepo,
      liveDemo,
      isPublic: isPublic !== undefined ? isPublic : true,
      tasks: [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can update this project',
      });
    }

    const {
      title,
      description,
      status,
      category,
      tags,
      deadline,
      githubRepo,
      liveDemo,
      isPublic,
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (status) project.status = status;
    if (category) project.category = category;
    if (tags) project.tags = tags;
    if (deadline !== undefined) project.deadline = deadline;
    if (githubRepo !== undefined) project.githubRepo = githubRepo;
    if (liveDemo !== undefined) project.liveDemo = liveDemo;
    if (isPublic !== undefined) project.isPublic = isPublic;

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete this project',
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private (Owner and members)
export const addMember = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or member
    const requesterId = req.user?._id.toString();
    const isOwner = project.owner.toString() === requesterId;
    const isMember = project.members.some((member) => member.toString() === requesterId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or members can add new members',
      });
    }

    // Check if user is already a member
    if (project.members.some((member) => member.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member',
      });
    }

    project.members.push(userId);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Owner only)
export const removeMember = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can remove members',
      });
    }

    // Cannot remove the owner
    if (userId === project.owner.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner',
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Add task to project
// @route   POST /api/projects/:id/tasks
// @access  Private (Owner and members)
export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or member
    const userId = req.user?._id.toString();
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or members can add tasks',
      });
    }

    project.tasks.push({
      title,
      description,
      status: 'todo',
      assignedTo,
      createdAt: new Date(),
    } as any);

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update task status
// @route   PUT /api/projects/:id/tasks/:taskId
// @access  Private (Owner and members)
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or member
    const userId = req.user?._id.toString();
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or members can update tasks',
      });
    }

    const task = project.tasks.find((t: any) => t._id.toString() === taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/projects/:id/tasks/:taskId
// @access  Private (Owner and members)
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is owner or member
    const userId = req.user?._id.toString();
    const isOwner = project.owner.toString() === userId;
    const isMember = project.members.some((member) => member.toString() === userId);

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or members can delete tasks',
      });
    }

    project.tasks = project.tasks.filter((t: any) => t._id.toString() !== taskId);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .populate('tasks.assignedTo', 'name email');

    res.status(200).json({
      success: true,
      project: populatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
