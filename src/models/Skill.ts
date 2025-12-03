import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'Explorer' | 'Achiever' | 'Strategist' | 'Practitioner' | 'All';
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  roadmap: {
    title: string;
    description: string;
    steps: string[];
    estimatedTime: string;
  };
  resources: {
    type: 'video' | 'article' | 'course' | 'book';
    title: string;
    url: string;
    provider?: string;
  }[];
  tags: string[];
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Explorer', 'Achiever', 'Strategist', 'Practitioner', 'All'],
      default: 'All',
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    roadmap: {
      title: String,
      description: String,
      steps: [String],
      estimatedTime: String,
    },
    resources: [
      {
        type: {
          type: String,
          enum: ['video', 'article', 'course', 'book'],
        },
        title: String,
        url: String,
        provider: String,
      },
    ],
    tags: [String],
    icon: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISkill>('Skill', SkillSchema);
