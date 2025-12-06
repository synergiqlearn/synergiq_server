import { Schema, model, Document } from 'mongoose';

export interface ICodingSession extends Document {
  group: Schema.Types.ObjectId;
  title: string;
  language: string;
  code: string;
  input: string;
  output: string;
  creator: Schema.Types.ObjectId;
  activeUsers: Schema.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CodingSessionSchema = new Schema<ICodingSession>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'StudyGroup',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
      default: 'Untitled Session',
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp', 'c', 'typescript', 'go', 'rust'],
      default: 'javascript',
    },
    code: {
      type: String,
      default: '',
      maxlength: 50000, // 50KB max
    },
    input: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    output: {
      type: String,
      default: '',
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    activeUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CodingSessionSchema.index({ group: 1, isActive: 1 });
CodingSessionSchema.index({ creator: 1 });

export default model<ICodingSession>('CodingSession', CodingSessionSchema);
