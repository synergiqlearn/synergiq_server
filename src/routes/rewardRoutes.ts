import express from 'express';
import { protect } from '../middleware/auth';
import {
  getMyRewards,
  addActivity,
  getMyCoupons,
  redeemCoupon,
  getRedemptionHistory,
  convertToBlockchain,
  getBlockchainCredits,
} from '../controllers/rewardController';

const router = express.Router();

// Protect all routes
router.use(protect);

// Reward summary
router.get('/summary', getMyRewards);

// Activity tracking
router.post('/activity', addActivity);

// Coupon management
router.get('/coupons', getMyCoupons);
router.post('/coupons/redeem', redeemCoupon);
router.get('/history', getRedemptionHistory);

// Blockchain conversion
router.post('/blockchain/convert', convertToBlockchain);
router.get('/blockchain', getBlockchainCredits);

export default router;
