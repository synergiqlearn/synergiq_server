import express from 'express';
import {
  getSkills,
  getRecommendedSkills,
  selectSkill,
  getMySkills,
  updateProgress,
  removeSkill,
  searchSkills,
} from '../controllers/skillController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getSkills);
router.get('/search', protect, searchSkills);

// Protected routes
router.get('/recommended', protect, getRecommendedSkills);
router.post('/select', protect, selectSkill);
router.get('/my-skills', protect, getMySkills);
router.put('/progress/:id', protect, updateProgress);
router.delete('/remove/:id', protect, removeSkill);

export default router;
