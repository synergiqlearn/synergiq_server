import express from 'express';
import { getAnalytics, getGoals, createGoal, updateGoal } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Analytics routes
router.get('/stats', getAnalytics);
router.get('/goals', getGoals);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);

export default router;
