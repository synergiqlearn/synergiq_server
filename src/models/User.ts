import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  category?: 'Explorer' | 'Achiever' | 'Strategist' | 'Practitioner';
  preferences?: {
    learningStyle?: string;
    interests?: string[];
    goals?: string[];
  };
  traits?: Record<string, number>;
  aiInsights?: string;
  notificationPreferences?: {
    emailNotifications?: boolean;
    projectUpdates?: boolean;
    skillReminders?: boolean;
    eventAlerts?: boolean;
    weeklyDigest?: boolean;
  };
  skills?: mongoose.Types.ObjectId[];
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  matchPassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    bio: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Explorer', 'Achiever', 'Strategist', 'Practitioner'],
    },
    preferences: {
      learningStyle: String,
      interests: [String],
      goals: [String],
    },
    traits: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
    aiInsights: {
      type: String,
      default: '',
    },
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      skillReminders: { type: Boolean, default: true },
      eventAlerts: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: false },
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Match password method (alias for comparePassword)
UserSchema.methods.matchPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
