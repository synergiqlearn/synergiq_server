import { Request, Response } from 'express';
import Skill from '../models/Skill';
import UserSkill from '../models/UserSkill';
import Reward, { ActivityType } from '../models/Reward';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, difficulty, search } = req.query;

    const filter: any = { isActive: true };

    if (category && category !== 'All') {
      filter.$or = [{ category }, { category: 'All' }];
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const skills = await Skill.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error: any) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get recommended skills based on user category
// @route   GET /api/skills/recommended
// @access  Private
export const getRecommendedSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userCategory = req.user?.category;

    if (!userCategory) {
      res.status(400).json({
        success: false,
        message: 'Please complete the questionnaire first',
      });
      return;
    }

    // Get skills matching user's category or marked as "All"
    const skills = await Skill.find({
      $or: [{ category: userCategory }, { category: 'All' }],
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      category: userCategory,
      count: skills.length,
      skills,
    });
  } catch (error: any) {
    console.error('Get recommended skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Add skill to user's learning path
// @route   POST /api/skills/select
// @access  Private
export const selectSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { skillId } = req.body;

    if (!skillId) {
      res.status(400).json({
        success: false,
        message: 'Please provide a skill ID',
      });
      return;
    }

    // Check if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
      return;
    }

    // Check if user already has this skill
    const existingUserSkill = await UserSkill.findOne({
      userId: req.user?._id,
      skillId,
    });

    if (existingUserSkill) {
      res.status(400).json({
        success: false,
        message: 'Skill already added to your learning path',
      });
      return;
    }

    // Add skill to user's learning path
    const userSkill = await UserSkill.create({
      userId: req.user?._id,
      skillId,
      status: 'not-started',
    });

    await userSkill.populate('skillId');

    // Award reward for learning new skill
    try {
      const reward = await Reward.findOne({ user: req.user?._id }) || await Reward.create({
        user: req.user?._id,
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

      const couponsEarned = 5; // 5 coupons for learning a skill
      
      reward.activities.push({
        type: ActivityType.SKILL_LEARNED,
        description: `Started learning ${skill.name}`,
        couponsEarned,
        metadata: { skillId: skill._id },
        createdAt: new Date(),
      } as any);

      reward.stats.skillsLearned += 1;
      reward.totalCouponsEarned += couponsEarned;
      reward.availableCoupons += couponsEarned;

      // Generate coupons
      const couponValue = 50; // ₹50 per skill learned
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
      console.error('Error awarding skill reward:', rewardError);
      // Don't fail the request if reward fails
    }

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      userSkill,
    });
  } catch (error: any) {
    console.error('Select skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get user's selected skills
// @route   GET /api/skills/my-skills
// @access  Private
export const getMySkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userSkills = await UserSkill.find({
      userId: req.user?._id,
    })
      .populate('skillId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: userSkills.length,
      skills: userSkills,
    });
  } catch (error: any) {
    console.error('Get my skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update skill progress
// @route   PUT /api/skills/progress/:id
// @access  Private
export const updateProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { progress, status, timeSpent, notes } = req.body;

    const userSkill = await UserSkill.findOne({
      _id: id,
      userId: req.user?._id,
    });

    if (!userSkill) {
      res.status(404).json({
        success: false,
        message: 'Skill not found in your learning path',
      });
      return;
    }

    if (progress !== undefined) userSkill.progress = progress;
    if (status) userSkill.status = status;
    if (timeSpent !== undefined)
      userSkill.timeSpent = userSkill.timeSpent + timeSpent;
    if (notes) userSkill.notes = notes;

    if (status === 'completed' && !userSkill.completedAt) {
      userSkill.completedAt = new Date();
      userSkill.progress = 100;
    }

    await userSkill.save();
    await userSkill.populate('skillId');

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      userSkill,
    });
  } catch (error: any) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Remove skill from user's learning path
// @route   DELETE /api/skills/remove/:id
// @access  Private
export const removeSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userSkill = await UserSkill.findOneAndDelete({
      _id: id,
      userId: req.user?._id,
    });

    if (!userSkill) {
      res.status(404).json({
        success: false,
        message: 'Skill not found in your learning path',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
    });
  } catch (error: any) {
    console.error('Remove skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
