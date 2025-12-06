import express from 'express';
import {
  getGroupSessions,
  getSession,
  createSession,
  updateSession,
  executeCode,
  joinSession,
  leaveSession,
  deleteSession,
} from '../controllers/codingController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Session management
router.get('/group/:groupId', getGroupSessions);
router.get('/:id', getSession);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

// Session actions
router.post('/:id/execute', executeCode);
router.post('/:id/join', joinSession);
router.post('/:id/leave', leaveSession);

export default router;
