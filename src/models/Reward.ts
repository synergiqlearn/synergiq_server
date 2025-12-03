import mongoose, { Document, Schema } from 'mongoose';

// Activity types for reward tracking
export enum ActivityType {
  COURSE_COMPLETED = 'course_completed',
  SKILL_LEARNED = 'skill_learned',
  PROJECT_COMPLETED = 'project_completed',
  PROJECT_MENTORED = 'project_mentored',
  EVENT_PARTICIPATED = 'event_participated',
  EVENT_WON = 'event_won',
}

// Coupon status
export enum CouponStatus {
  ACTIVE = 'active',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
}

// Interface for Activity subdocument
export interface IActivity {
  type: ActivityType;
  description: string;
  couponsEarned: number;
  createdAt: Date;
  metadata?: {
    resourceId?: mongoose.Types.ObjectId;
    skillId?: mongoose.Types.ObjectId;
    projectId?: mongoose.Types.ObjectId;
    eventId?: mongoose.Types.ObjectId;
  };
}

// Interface for Coupon subdocument
export interface ICoupon {
  code: string;
  amount: number; // in rupees
  status: CouponStatus;
  issuedAt: Date;
  redeemedAt?: Date;
  expiresAt: Date;
}

// Interface for Blockchain Credit subdocument
export interface IBlockchainCredit {
  transactionId: string;
  amount: number; // number of credits
  couponsConverted: number; // how many coupons were converted
  walletAddress?: string;
  createdAt: Date;
}

// Interface for Reward document
export interface IReward extends Document {
  user: mongoose.Types.ObjectId;
  
  // Activity tracking
  activities: IActivity[];
  
  // Coupon management
  coupons: ICoupon[];
  totalCouponsEarned: number;
  totalCouponsRedeemed: number;
  availableCoupons: number;
  
  // Blockchain credits
  blockchainCredits: IBlockchainCredit[];
  totalBlockchainCredits: number;
  
  // Statistics
  stats: {
    coursesCompleted: number;
    skillsLearned: number;
    projectsCompleted: number;
    projectsMentored: number;
    eventsParticipated: number;
    eventsWon: number;
  };
  
  // Methods
  generateCouponCode(): string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Activity Schema
const ActivitySchema = new Schema<IActivity>({
  type: {
    type: String,
    enum: Object.values(ActivityType),
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  couponsEarned: {
    type: Number,
    required: true,
    min: 0,
  },
  metadata: {
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource' },
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
  },
}, { timestamps: true });

// Coupon Schema
const CouponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: Object.values(CouponStatus),
    default: CouponStatus.ACTIVE,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  redeemedAt: Date,
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Blockchain Credit Schema
const BlockchainCreditSchema = new Schema<IBlockchainCredit>({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  couponsConverted: {
    type: Number,
    required: true,
    min: 5, // minimum 5 coupons to convert
  },
  walletAddress: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Reward Schema
const RewardSchema = new Schema<IReward>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  activities: [ActivitySchema],
  coupons: [CouponSchema],
  totalCouponsEarned: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalCouponsRedeemed: {
    type: Number,
    default: 0,
    min: 0,
  },
  availableCoupons: {
    type: Number,
    default: 0,
    min: 0,
  },
  blockchainCredits: [BlockchainCreditSchema],
  totalBlockchainCredits: {
    type: Number,
    default: 0,
    min: 0,
  },
  stats: {
    coursesCompleted: { type: Number, default: 0, min: 0 },
    skillsLearned: { type: Number, default: 0, min: 0 },
    projectsCompleted: { type: Number, default: 0, min: 0 },
    projectsMentored: { type: Number, default: 0, min: 0 },
    eventsParticipated: { type: Number, default: 0, min: 0 },
    eventsWon: { type: Number, default: 0, min: 0 },
  },
}, { timestamps: true });

// Indexes for performance
RewardSchema.index({ 'coupons.status': 1 });
RewardSchema.index({ 'coupons.expiresAt': 1 });

// Helper method to generate coupon code
RewardSchema.methods.generateCouponCode = function(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'REC-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default mongoose.model<IReward>('Reward', RewardSchema);
