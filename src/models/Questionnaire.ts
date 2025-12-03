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
  completedAt: Date;
}

const QuestionnaireResponseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
