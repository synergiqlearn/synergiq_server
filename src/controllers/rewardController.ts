import { Response } from 'express';
import Reward, { ActivityType, CouponStatus, IActivity } from '../models/Reward';
import { AuthRequest } from '../middleware/auth';

// Coupon earning rules (how many coupons per activity)
const COUPON_RULES = {
  [ActivityType.COURSE_COMPLETED]: 10,
  [ActivityType.SKILL_LEARNED]: 5,
  [ActivityType.PROJECT_COMPLETED]: 20,
  [ActivityType.PROJECT_MENTORED]: 15,
  [ActivityType.EVENT_PARTICIPATED]: 5,
  [ActivityType.EVENT_WON]: 25,
};

// Coupon value rules (rupee value per coupon type)
const COUPON_VALUES = {
  small: 25,   // ₹25
  medium: 50,  // ₹50
  large: 100,  // ₹100
};

// Monetary value per 1 coupon point.
// Keep this aligned with COUPON_VALUES so coupon redemption can correctly deduct points.
const RUPEES_PER_COUPON_POINT = 5;

const generateUniqueCouponCode = async (rewardDoc: any): Promise<string> => {
  // RewardSchema has a generateCouponCode() method.
  // We also need global uniqueness because `coupons.code` is indexed as unique.
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = String(rewardDoc.generateCouponCode()).toUpperCase();

    if (rewardDoc.coupons?.some((c: any) => c.code === code)) {
      continue;
    }

    const exists = await Reward.exists({ 'coupons.code': code });
    if (!exists) {
      return code;
    }
  }

  throw new Error('Failed to generate a unique coupon code');
};

// Get user's reward summary
export const getMyRewards = async (req: AuthRequest, res: Response) => {
  try {
    let reward = await Reward.findOne({ user: req.user!._id });

    // Create reward document if doesn't exist
    if (!reward) {
      reward = await Reward.create({
        user: req.user!._id,
        activities: [],
        coupons: [],
        blockchainCredits: [],
        stats: {
          coursesCompleted: 0,
          skillsLearned: 0,
          projectsCompleted: 0,
          projectsMentored: 0,
          eventsParticipated: 0,
          eventsWon: 0,
        },
      });
    }

    // Calculate active coupons
    const activeCoupons = reward.coupons.filter(c => c.status === CouponStatus.ACTIVE);
    const totalCouponValue = activeCoupons.reduce((sum, c) => sum + c.amount, 0);

    res.json({
      success: true,
      data: {
        totalCouponsEarned: reward.totalCouponsEarned,
        totalCouponsRedeemed: reward.totalCouponsRedeemed,
        availableCoupons: reward.availableCoupons,
        activeCoupons: activeCoupons.length,
        totalCouponValue,
        totalBlockchainCredits: reward.totalBlockchainCredits,
        stats: reward.stats,
        recentActivities: reward.activities.slice(-10).reverse(), // Last 10 activities
      },
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({
      success: false,
      message: 'Server error',
      ...(process.env.NODE_ENV !== 'production' ? { debug: message } : {}),
    });
  }
};

// Add activity and earn coupons
export const addActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { type, description, metadata } = req.body;

    // Validate activity type
    if (!Object.values(ActivityType).includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid activity type' });
    }

    let reward = await Reward.findOne({ user: req.user!._id });

    // Create reward document if doesn't exist
    if (!reward) {
      reward = await Reward.create({
        user: req.user!._id,
        activities: [],
        coupons: [],
        blockchainCredits: [],
        stats: {
          coursesCompleted: 0,
          skillsLearned: 0,
          projectsCompleted: 0,
          projectsMentored: 0,
          eventsParticipated: 0,
          eventsWon: 0,
        },
      });
    }

    // Calculate coupons earned for this activity
    const couponsEarned = COUPON_RULES[type as ActivityType] || 0;

    // Add activity
    const activity: Partial<IActivity> = {
      type: type as ActivityType,
      description,
      couponsEarned,
      metadata,
      createdAt: new Date(),
    };
    reward.activities.push(activity as IActivity);

    // Update stats
    switch (type) {
      case ActivityType.COURSE_COMPLETED:
        reward.stats.coursesCompleted += 1;
        break;
      case ActivityType.SKILL_LEARNED:
        reward.stats.skillsLearned += 1;
        break;
      case ActivityType.PROJECT_COMPLETED:
        reward.stats.projectsCompleted += 1;
        break;
      case ActivityType.PROJECT_MENTORED:
        reward.stats.projectsMentored += 1;
        break;
      case ActivityType.EVENT_PARTICIPATED:
        reward.stats.eventsParticipated += 1;
        break;
      case ActivityType.EVENT_WON:
        reward.stats.eventsWon += 1;
        break;
    }

    // Update coupon counts
    reward.totalCouponsEarned += couponsEarned;
    reward.availableCoupons += couponsEarned;

    // Auto-generate redeemable coupon codes based on earned coupon points
    // Generate coupons in denominations (₹100, ₹50, ₹25)
    let remainingValue = couponsEarned * RUPEES_PER_COUPON_POINT;
    
    while (remainingValue >= COUPON_VALUES.small) {
      let couponValue: number;
      if (remainingValue >= COUPON_VALUES.large) {
        couponValue = COUPON_VALUES.large;
      } else if (remainingValue >= COUPON_VALUES.medium) {
        couponValue = COUPON_VALUES.medium;
      } else {
        couponValue = COUPON_VALUES.small;
      }

      // Generate globally-unique coupon code
      const couponCode = await generateUniqueCouponCode(reward);

      // Add coupon
      reward.coupons.push({
        code: couponCode!,
        amount: couponValue,
        status: CouponStatus.ACTIVE,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
      });

      remainingValue -= couponValue;
    }

    await reward.save();

    res.status(201).json({
      success: true,
      message: `Activity recorded! You earned ${couponsEarned} reward coupons.`,
      data: {
        couponsEarned,
        totalCoupons: reward.availableCoupons,
      },
    });
  } catch (error) {
    console.error('Error adding activity:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({
      success: false,
      message: 'Server error',
      ...(process.env.NODE_ENV !== 'production' ? { debug: message } : {}),
    });
  }
};

// Get all coupons (active, redeemed, expired)
export const getMyCoupons = async (req: AuthRequest, res: Response) => {
  try {
    const reward = await Reward.findOne({ user: req.user!._id });

    if (!reward) {
      return res.json({
        success: true,
        data: {
          coupons: [],
          activeCoupons: [],
          redeemedCoupons: [],
        },
      });
    }

    const now = new Date();
    
    // Update expired coupons
    reward.coupons.forEach(coupon => {
      if (coupon.status === CouponStatus.ACTIVE && coupon.expiresAt < now) {
        coupon.status = CouponStatus.EXPIRED;
      }
    });
    await reward.save();

    const activeCoupons = reward.coupons.filter(c => c.status === CouponStatus.ACTIVE);
    const redeemedCoupons = reward.coupons.filter(c => c.status === CouponStatus.REDEEMED);
    const expiredCoupons = reward.coupons.filter(c => c.status === CouponStatus.EXPIRED);

    res.json({
      success: true,
      data: {
        coupons: reward.coupons,
        activeCoupons,
        redeemedCoupons,
        expiredCoupons,
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Redeem a coupon
export const redeemCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const reward = await Reward.findOne({ user: req.user!._id });

    if (!reward) {
      return res.status(404).json({ success: false, message: 'No rewards found' });
    }

    // Find the coupon
    const coupon = reward.coupons.find(c => c.code === couponCode.toUpperCase());

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    if (coupon.status === CouponStatus.REDEEMED) {
      return res.status(400).json({ success: false, message: 'Coupon already redeemed' });
    }

    if (coupon.status === CouponStatus.EXPIRED) {
      return res.status(400).json({ success: false, message: 'Coupon expired' });
    }

    if (new Date() > coupon.expiresAt) {
      coupon.status = CouponStatus.EXPIRED;
      await reward.save();
      return res.status(400).json({ success: false, message: 'Coupon expired' });
    }

    // Redeem coupon
    coupon.status = CouponStatus.REDEEMED;
    coupon.redeemedAt = new Date();
    reward.totalCouponsRedeemed += 1;

    // Deduct coupon points based on redeemed rupee value.
    // With RUPEES_PER_COUPON_POINT=5 and denominations 25/50/100, this is always an integer.
    const pointsSpent = Math.max(1, Math.round(coupon.amount / RUPEES_PER_COUPON_POINT));
    reward.availableCoupons = Math.max(0, reward.availableCoupons - pointsSpent);

    await reward.save();

    res.json({
      success: true,
      message: `Coupon redeemed successfully! Value: ₹${coupon.amount}`,
      data: {
        coupon: {
          code: coupon.code,
          amount: coupon.amount,
          redeemedAt: coupon.redeemedAt,
        },
      },
    });
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get redemption history
export const getRedemptionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const reward = await Reward.findOne({ user: req.user!._id });

    if (!reward) {
      return res.json({
        success: true,
        data: {
          history: [],
        },
      });
    }

    const redeemedCoupons = reward.coupons
      .filter(c => c.status === CouponStatus.REDEEMED)
      .sort((a, b) => {
        const dateA = a.redeemedAt ? new Date(a.redeemedAt).getTime() : 0;
        const dateB = b.redeemedAt ? new Date(b.redeemedAt).getTime() : 0;
        return dateB - dateA; // Most recent first
      });

    res.json({
      success: true,
      data: {
        history: redeemedCoupons,
        totalRedeemed: redeemedCoupons.length,
        totalValue: redeemedCoupons.reduce((sum, c) => sum + c.amount, 0),
      },
    });
  } catch (error) {
    console.error('Error fetching redemption history:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Convert 5 coupons to 1 blockchain credit
export const convertToBlockchain = async (req: AuthRequest, res: Response) => {
  try {
    const { walletAddress } = req.body;

    const reward = await Reward.findOne({ user: req.user!._id });

    if (!reward) {
      return res.status(404).json({ success: false, message: 'No rewards found' });
    }

    // Check if user has at least 5 available coupons
    if (reward.availableCoupons < 5) {
      return res.status(400).json({
        success: false,
        message: `Insufficient coupons. You need 5 coupons to convert to 1 blockchain credit. You have ${reward.availableCoupons}.`,
      });
    }

    // Generate transaction ID (in real app, this would be actual blockchain transaction)
    const transactionId = `BLK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Add blockchain credit
    reward.blockchainCredits.push({
      transactionId,
      amount: 1,
      couponsConverted: 5,
      walletAddress: walletAddress || undefined,
      createdAt: new Date(),
    });

    // Update counts
    reward.totalBlockchainCredits += 1;
    reward.availableCoupons -= 5;

    await reward.save();

    res.json({
      success: true,
      message: 'Successfully converted 5 coupons to 1 blockchain credit!',
      data: {
        transactionId,
        blockchainCredits: reward.totalBlockchainCredits,
        remainingCoupons: reward.availableCoupons,
      },
    });
  } catch (error) {
    console.error('Error converting to blockchain:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get blockchain credits history
export const getBlockchainCredits = async (req: AuthRequest, res: Response) => {
  try {
    const reward = await Reward.findOne({ user: req.user!._id });

    if (!reward) {
      return res.json({
        success: true,
        data: {
          credits: [],
          totalCredits: 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        credits: reward.blockchainCredits.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        totalCredits: reward.totalBlockchainCredits,
      },
    });
  } catch (error) {
    console.error('Error fetching blockchain credits:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
