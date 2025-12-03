import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  type: 'video' | 'article' | 'tutorial' | 'course' | 'documentation' | 'book';
  url: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Explorer' | 'Achiever' | 'Strategist' | 'Practitioner' | 'All';
  author?: string;
  duration?: string; // e.g., "45 mins", "2 hours", "10 articles"
  rating?: number;
  views?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify resource type'],
      enum: ['video', 'article', 'tutorial', 'course', 'documentation', 'book'],
    },
    url: {
      type: String,
      required: [true, 'Please provide a URL'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      required: [true, 'Please specify difficulty level'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Explorer', 'Achiever', 'Strategist', 'Practitioner', 'All'],
      default: 'All',
    },
    author: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
ResourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ResourceSchema.index({ category: 1, difficulty: 1, type: 1 });

export default mongoose.model<IResource>('Resource', ResourceSchema);
