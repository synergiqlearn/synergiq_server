import express from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  searchResources,
  getRecommendedResources,
} from '../controllers/resourceController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Special routes (must be before /:id)
router.get('/recommended', getRecommendedResources);
router.get('/search', searchResources);

// Main CRUD routes
router.route('/').get(getAllResources).post(createResource);

router
  .route('/:id')
  .get(getResourceById)
  .put(updateResource)
  .delete(deleteResource);

export default router;
