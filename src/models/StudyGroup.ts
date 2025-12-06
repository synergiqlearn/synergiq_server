import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyGroup extends Document {
  name: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Mobile' | 'Cybersecurity' | 'System Design' | 'General';
  tags: string[];
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  isPublic: boolean;
  rules?: string;
  pinnedMessages?: mongoose.Types.ObjectId[];
  memberLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudyGroupSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [100, 'Group name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Mobile', 'Cybersecurity', 'System Design', 'General'],
      default: 'General',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isPublic: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: String,
      maxlength: [1000, 'Rules cannot exceed 1000 characters'],
    },
    pinnedMessages: [{
      type: Schema.Types.ObjectId,
      ref: 'GroupMessage',
    }],
    memberLimit: {
      type: Number,
      default: 100,
      min: 2,
      max: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
StudyGroupSchema.index({ name: 'text', description: 'text', tags: 'text' });
StudyGroupSchema.index({ category: 1 });
StudyGroupSchema.index({ isPublic: 1 });

export default mongoose.model<IStudyGroup>('StudyGroup', StudyGroupSchema);
