import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, getAllPosts).post(protect, createPost);

router.route('/user/:userId').get(protect, getUserPosts);

router
  .route('/:id')
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/like').put(protect, likePost);

export default router;
