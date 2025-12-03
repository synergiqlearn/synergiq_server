import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSkill extends Document {
  userId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
  timeSpent: number; // in minutes
}

const UserSkillSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillId: {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    notes: String,
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate user-skill entries
UserSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

export default mongoose.model<IUserSkill>('UserSkill', UserSkillSchema);
