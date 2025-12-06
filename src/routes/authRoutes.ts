import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateQuestionnaireProfile,
  updateProfile,
  changePassword,
  updateNotifications
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/questionnaire', protect, updateQuestionnaireProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/notifications', protect, updateNotifications);

export default router;
