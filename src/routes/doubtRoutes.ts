import express from 'express';
import {
  getDoubts,
  getDoubtById,
  askDoubt,
  answerDoubt,
  voteDoubt,
  voteAnswer,
  acceptAnswer,
  getPopularTags,
} from '../controllers/doubtController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(protect);

// Question routes
router.get('/', getDoubts);
router.post('/', askDoubt);
router.get('/tags/popular', getPopularTags);
router.get('/:id', getDoubtById);
router.post('/:id/vote', voteDoubt);

// Answer routes
router.post('/:id/answers', answerDoubt);
router.post('/:id/answers/:answerId/vote', voteAnswer);
router.post('/:id/answers/:answerId/accept', acceptAnswer);

export default router;
