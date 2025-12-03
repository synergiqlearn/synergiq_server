import mongoose, { Document, Schema } from 'mongoose';

export interface ITask {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  completedAt?: Date;
}

export interface IProject extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'archived';
  category: string;
  tags: string[];
  tasks: ITask[];
  deadline?: Date;
  githubRepo?: string;
  liveDemo?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    maxlength: [200, 'Task title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Task description cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo',
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'on-hold', 'archived'],
      default: 'planning',
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: [
        'Web Development',
        'Mobile App',
        'Machine Learning',
        'Data Science',
        'Game Development',
        'IoT',
        'Blockchain',
        'Cybersecurity',
        'Cloud Computing',
        'Other',
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    tasks: [TaskSchema],
    deadline: {
      type: Date,
    },
    githubRepo: {
      type: String,
      trim: true,
    },
    liveDemo: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });
ProjectSchema.index({ owner: 1, createdAt: -1 });
ProjectSchema.index({ members: 1, createdAt: -1 });
ProjectSchema.index({ status: 1, createdAt: -1 });
ProjectSchema.index({ category: 1, status: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
