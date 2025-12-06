import mongoose, { Document, Schema } from 'mongoose';

export interface IGroupMessage extends Document {
  group: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'code';
  fileUrl?: string;
  fileName?: string;
  codeLanguage?: string;
  mentions?: mongoose.Types.ObjectId[];
  reactions?: {
    emoji: string;
    users: mongoose.Types.ObjectId[];
  }[];
  isPinned: boolean;
  isEdited: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GroupMessageSchema: Schema = new Schema(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'code'],
      default: 'text',
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    codeLanguage: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'html', 'css', 'sql', 'other'],
    },
    mentions: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    reactions: [{
      emoji: String,
      users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
GroupMessageSchema.index({ group: 1, createdAt: -1 });
GroupMessageSchema.index({ sender: 1 });

export default mongoose.model<IGroupMessage>('GroupMessage', GroupMessageSchema);
