import { Response } from 'express';
import Event from '../models/Event';
import Reward, { ActivityType } from '../models/Reward';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Private
export const getAllEvents = async (req: AuthRequest, res: Response) => {
  try {
    const {
      type,
      tags,
      search,
      startDate,
      endDate,
      showPast = 'false',
      page = '1',
      limit = '12',
      sortBy = 'date',
      order = 'asc',
    } = req.query;

    const query: any = {};

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',');
      query.tags = { $in: tagArray };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }

    // Filter past events
    if (showPast === 'false') {
      query.date = { ...query.date, $gte: new Date() };
    }

    // Text search
    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort: any = {};
    sort[sortBy as string] = sortOrder;

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      type,
      organizer,
      organizerContact,
      date,
      endDate,
      location,
      isOnline,
      registrationLink,
      tags,
      maxAttendees,
      requirements,
    } = req.body;

    if (!title || !description || !type || !organizer || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const event = await Event.create({
      title,
      description,
      type,
      organizer,
      organizerContact,
      date,
      endDate,
      location,
      isOnline: isOnline || false,
      registrationLink,
      tags: tags || [],
      maxAttendees,
      requirements,
      createdBy: req.user?._id,
    });

    const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: populatedEvent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const {
      title,
      description,
      type,
      organizer,
      organizerContact,
      date,
      endDate,
      location,
      isOnline,
      registrationLink,
      tags,
      maxAttendees,
      requirements,
    } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.type = type || event.type;
    event.organizer = organizer || event.organizer;
    event.organizerContact = organizerContact || event.organizerContact;
    event.date = date || event.date;
    event.endDate = endDate || event.endDate;
    event.location = location || event.location;
    event.isOnline = isOnline !== undefined ? isOnline : event.isOnline;
    event.registrationLink = registrationLink || event.registrationLink;
    event.tags = tags || event.tags;
    event.maxAttendees = maxAttendees || event.maxAttendees;
    event.requirements = requirements || event.requirements;

    await event.save();

    const updatedEvent = await Event.findById(event._id).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Attend/Unattend event (RSVP)
// @route   PUT /api/events/:id/attend
// @access  Private
export const attendEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const userId = req.user?._id;
    const isAttending = event.attendees.some((id) => id.toString() === userId?.toString());

    if (isAttending) {
      // Unattend
      event.attendees = event.attendees.filter((id) => id.toString() !== userId?.toString());
    } else {
      // Check if event is full
      if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
        return res.status(400).json({
          success: false,
          message: 'Event is full',
        });
      }
      // Attend
      event.attendees.push(userId!);
      
      // Award reward for event participation
      try {
        const reward = await Reward.findOne({ user: userId }) || await Reward.create({
          user: userId,
          activities: [],
          coupons: [],
          blockchainCredits: [],
          stats: {
            coursesCompleted: 0,
            skillsLearned: 0,
            projectsCompleted: 0,
            projectsMentored: 0,
            eventsParticipated: 0,
            eventsWon: 0,
          },
        });

        const couponsEarned = 5; // 5 coupons for event participation
        
        reward.activities.push({
          type: ActivityType.EVENT_PARTICIPATED,
          description: `Registered for ${event.title}`,
          couponsEarned,
          metadata: { eventId: event._id },
          createdAt: new Date(),
        } as any);

        reward.stats.eventsParticipated += 1;
        reward.totalCouponsEarned += couponsEarned;
        reward.availableCoupons += couponsEarned;

        // Generate coupon
        const couponValue = 50; // ₹50 per event
        const couponCode = reward.generateCouponCode();
        reward.coupons.push({
          code: couponCode,
          amount: couponValue,
          status: 'active' as any,
          issuedAt: new Date(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });

        await reward.save();
      } catch (rewardError) {
        console.error('Error awarding event reward:', rewardError);
      }
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: isAttending ? 'Unregistered from event' : 'Registered for event',
      attendees: event.attendees.length,
      isAttending: !isAttending,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get user's attended events
// @route   GET /api/events/my-events
// @access  Private
export const getMyEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ attendees: req.user?._id })
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
