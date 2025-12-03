import express from 'express';
import {
  getQuestions,
  submitQuestionnaire,
  getResults,
  getAdaptiveStart,
  getAdaptiveNext,
  submitAdaptiveQuestionnaire,
} from '../controllers/profileController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Legacy questionnaire routes
router.get('/questions', protect, getQuestions);
router.post('/questionnaire', protect, submitQuestionnaire);
router.get('/results', protect, getResults);

// Adaptive questionnaire routes
router.get('/adaptive/start', protect, getAdaptiveStart);
router.post('/adaptive/next', protect, getAdaptiveNext);
router.post('/adaptive/submit', protect, submitAdaptiveQuestionnaire);

export default router;
