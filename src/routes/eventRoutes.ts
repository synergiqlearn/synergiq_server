import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  getMyEvents,
  searchEvents,
} from '../controllers/eventController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, getAllEvents).post(protect, createEvent);

router.route('/my-events').get(protect, getMyEvents);
router.route('/search').get(protect, searchEvents);

router
  .route('/:id')
  .get(protect, getEventById)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

router.route('/:id/attend').put(protect, attendEvent);

export default router;
