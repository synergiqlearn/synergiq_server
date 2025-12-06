import express from 'express';
import {
  getGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendGroupMessage,
  reactToMessage,
  deleteMessage,
} from '../controllers/groupController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Group routes
router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroupById);
router.post('/:id/join', joinGroup);
router.post('/:id/leave', leaveGroup);

// Message routes
router.get('/:id/messages', getGroupMessages);
router.post('/:id/messages', sendGroupMessage);
router.post('/messages/:messageId/react', reactToMessage);
router.delete('/messages/:messageId', deleteMessage);

export default router;
