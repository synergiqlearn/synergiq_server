import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  addTask,
  updateTask,
  deleteTask,
  getRecommendedProjects,
  searchProjects,
} from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Special routes (must be before /:id)
router.get('/recommended', getRecommendedProjects);
router.get('/search', searchProjects);

// Project routes
router.route('/').get(getAllProjects).post(createProject);

router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

// Member management
router.route('/:id/members').put(addMember);
router.route('/:id/members/:userId').delete(removeMember);

// Task management
router.route('/:id/tasks').post(addTask);
router.route('/:id/tasks/:taskId').put(updateTask).delete(deleteTask);

export default router;
