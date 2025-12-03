import express from 'express';
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likeComment,
} from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').post(protect, createComment);

router.route('/post/:postId').get(protect, getPostComments);

router
  .route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route('/:id/like').put(protect, likeComment);

export default router;
