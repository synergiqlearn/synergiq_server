import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  author: mongoose.Types.ObjectId;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDoubtQuestion extends Document {
  author: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Mobile' | 'Cybersecurity' | 'Database' | 'Other';
  codeSnippet?: string;
  codeLanguage?: string;
  answers: IAnswer[];
  acceptedAnswer?: mongoose.Types.ObjectId;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  views: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Answer content is required'],
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    },
    codeSnippet: {
      type: String,
      maxlength: [10000, 'Code snippet cannot exceed 10000 characters'],
    },
    codeLanguage: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'other'],
    },
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    downvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const DoubtQuestionSchema: Schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Question title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Question content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'AI/ML', 'DevOps', 'Mobile', 'Cybersecurity', 'Database', 'Other'],
      default: 'Other',
    },
    codeSnippet: {
      type: String,
      maxlength: [10000, 'Code snippet cannot exceed 10000 characters'],
    },
    codeLanguage: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'other'],
    },
    answers: [AnswerSchema],
    acceptedAnswer: {
      type: Schema.Types.ObjectId,
    },
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    downvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    views: {
      type: Number,
      default: 0,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DoubtQuestionSchema.index({ title: 'text', content: 'text', tags: 'text' });
DoubtQuestionSchema.index({ category: 1 });
DoubtQuestionSchema.index({ tags: 1 });
DoubtQuestionSchema.index({ isResolved: 1 });
DoubtQuestionSchema.index({ createdAt: -1 });

export default mongoose.model<IDoubtQuestion>('DoubtQuestion', DoubtQuestionSchema);
