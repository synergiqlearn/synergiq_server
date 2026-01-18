import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: string;
  text: string;
  category: 'behavior' | 'learning' | 'interests' | 'goals';
  options: {
    text: string;
    value: number;
    type: 'Explorer' | 'Achiever' | 'Strategist' | 'Practitioner';
  }[];
}

export interface IQuestionnaireResponse extends Document {
  userId: mongoose.Types.ObjectId;
  kind?: 'legacy' | 'adaptive';
  category?: 'Explorer' | 'Achiever' | 'Strategist' | 'Practitioner';
  responses: {
    questionId: string;
    answer: string;
    score: number;
  }[];
  scores: {
    Explorer: number;
    Achiever: number;
    Strategist: number;
    Practitioner: number;
  };
  traits?: Record<string, number>;
  analysis?: any;
  aiInsights?: any;
  completedAt: Date;
}

const QuestionnaireResponseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    kind: {
      type: String,
      enum: ['legacy', 'adaptive'],
      default: 'legacy',
      index: true,
    },
    category: {
      type: String,
      enum: ['Explorer', 'Achiever', 'Strategist', 'Practitioner'],
      index: true,
    },
    responses: [
      {
        questionId: String,
        answer: String,
        score: Number,
      },
    ],
    scores: {
      Explorer: { type: Number, default: 0 },
      Achiever: { type: Number, default: 0 },
      Strategist: { type: Number, default: 0 },
      Practitioner: { type: Number, default: 0 },
    },
    traits: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
    analysis: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
    aiInsights: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuestionnaireResponse>(
  'QuestionnaireResponse',
  QuestionnaireResponseSchema
);
