import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'club' | 'internship' | 'hackathon' | 'workshop' | 'competition' | 'webinar' | 'other';
  organizer: string;
  organizerContact?: string;
  date: Date;
  endDate?: Date;
  location: string;
  isOnline: boolean;
  registrationLink?: string;
  tags: string[];
  attendees: mongoose.Types.ObjectId[];
  maxAttendees?: number;
  requirements?: string;
  createdBy: mongoose.Types.ObjectId;
  isPast: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      enum: ['club', 'internship', 'hackathon', 'workshop', 'competition', 'webinar', 'other'],
      required: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    organizerContact: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxAttendees: {
      type: Number,
      min: 1,
    },
    requirements: {
      type: String,
      trim: true,
      maxlength: [500, 'Requirements cannot exceed 500 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPast: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
eventSchema.index({ title: 'text', description: 'text', tags: 'text', organizer: 'text' });

// Compound indexes for filtering and sorting
eventSchema.index({ type: 1, date: 1 });
eventSchema.index({ date: 1, isPast: 1 });
eventSchema.index({ createdBy: 1, date: -1 });

// Virtual to check if event is past
eventSchema.pre('save', function (next) {
  this.isPast = this.date < new Date();
  next();
});

const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
