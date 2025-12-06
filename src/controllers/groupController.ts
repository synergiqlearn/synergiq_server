import { Response } from 'express';
import StudyGroup from '../models/StudyGroup';
import GroupMessage from '../models/GroupMessage';
import { AuthRequest } from '../middleware/auth';
import { io } from '../server';

// @desc    Get all study groups
// @route   GET /api/groups
// @access  Private
export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search, myGroups } = req.query;
    const userId = req.user?.id;

    let query: any = { isPublic: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter user's groups
    if (myGroups === 'true' && userId) {
      query.members = userId;
    }

    // Search
    if (search) {
      query.$text = { $search: search as string };
    }

    const groups = await StudyGroup.find(query)
      .populate('admin', 'name email category')
      .populate('members', 'name email category')
      .sort({ createdAt: -1 });

    // Add member count and current user membership status
    const groupsWithStats = groups.map(group => ({
      ...group.toObject(),
      memberCount: group.members.length,
      isMember: userId ? group.members.some((m: any) => m._id.toString() === userId) : false,
      isAdmin: userId ? group.admin._id.toString() === userId : false,
    }));

    res.json({ groups: groupsWithStats });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

// @desc    Get single study group
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (req: AuthRequest, res: Response) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('admin', 'name email category')
      .populate('members', 'name email category');

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const userId = req.user?.id;
    const isMember = userId ? group.members.some((m: any) => m._id.toString() === userId) : false;

    if (!group.isPublic && !isMember) {
      res.status(403).json({ message: 'This group is private' });
      return;
    }

    res.json({
      ...group.toObject(),
      memberCount: group.members.length,
      isMember,
      isAdmin: userId ? group.admin._id.toString() === userId : false,
    });
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Failed to fetch group' });
  }
};

// @desc    Create study group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, description, category, tags, isPublic, rules, memberLimit } = req.body;

    // Validate
    if (!name || !description) {
      res.status(400).json({ message: 'Name and description are required' });
      return;
    }

    const group = await StudyGroup.create({
      name,
      description,
      category: category || 'General',
      tags: tags || [],
      admin: userId,
      members: [userId], // Creator is first member
      isPublic: isPublic !== undefined ? isPublic : true,
      rules,
      memberLimit: memberLimit || 100,
    });

    await group.populate('admin', 'name email category');
    await group.populate('members', 'name email category');

    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Failed to create group' });
  }
};

// @desc    Join study group
// @route   POST /api/groups/:id/join
// @access  Private
export const joinGroup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if already a member
    if (group.members.includes(userId as any)) {
      res.status(400).json({ message: 'Already a member of this group' });
      return;
    }

    // Check member limit
    if (group.memberLimit && group.members.length >= group.memberLimit) {
      res.status(400).json({ message: 'Group is full' });
      return;
    }

    group.members.push(userId as any);
    await group.save();

    await group.populate('admin', 'name email category');
    await group.populate('members', 'name email category');

    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    console.error('Error joining group:', error);
    res.status(500).json({ message: 'Failed to join group' });
  }
};

// @desc    Leave study group
// @route   POST /api/groups/:id/leave
// @access  Private
export const leaveGroup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Can't leave if you're the admin
    if (group.admin.toString() === userId) {
      res.status(400).json({ message: 'Admin cannot leave the group. Transfer ownership first or delete the group.' });
      return;
    }

    group.members = group.members.filter(m => m.toString() !== userId);
    await group.save();

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ message: 'Failed to leave group' });
  }
};

// @desc    Get group messages
// @route   GET /api/groups/:id/messages
// @access  Private
export const getGroupMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { limit = 50, before } = req.query;

    // Check if user is a member
    const group = await StudyGroup.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const isMember = userId ? group.members.some((m: any) => m.toString() === userId) : false;
    if (!isMember && !group.isPublic) {
      res.status(403).json({ message: 'You must be a member to view messages' });
      return;
    }

    let query: any = { 
      group: id,
      deletedAt: { $exists: false }
    };

    if (before) {
      query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await GroupMessage.find(query)
      .populate('sender', 'name email category')
      .populate('mentions', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// @desc    Send group message
// @route   POST /api/groups/:id/messages
// @access  Private
export const sendGroupMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { content, type, fileUrl, fileName, codeLanguage, mentions } = req.body;

    // Check if user is a member
    const group = await StudyGroup.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const isMember = group.members.some((m: any) => m.toString() === userId);
    if (!isMember) {
      res.status(403).json({ message: 'You must be a member to send messages' });
      return;
    }

    const message = await GroupMessage.create({
      group: id,
      sender: userId,
      content,
      type: type || 'text',
      fileUrl,
      fileName,
      codeLanguage,
      mentions: mentions || [],
    });

    await message.populate('sender', 'name email category');
    await message.populate('mentions', 'name email');

    // Emit Socket.io event for real-time update
    io.to(`group-${id}`).emit('new-message', message);

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// @desc    React to message
// @route   POST /api/groups/messages/:messageId/react
// @access  Private
export const reactToMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { messageId } = req.params;
    const { emoji } = req.body;

    const message = await GroupMessage.findById(messageId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    // Find existing reaction
    const reactionIndex = message.reactions?.findIndex(r => r.emoji === emoji);

    if (reactionIndex !== undefined && reactionIndex >= 0 && message.reactions) {
      // Toggle reaction
      const userIndex = message.reactions[reactionIndex].users.findIndex(
        (u: any) => u.toString() === userId
      );

      if (userIndex >= 0) {
        // Remove reaction
        message.reactions[reactionIndex].users.splice(userIndex, 1);
        if (message.reactions[reactionIndex].users.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      } else {
        // Add reaction
        message.reactions[reactionIndex].users.push(userId as any);
      }
    } else {
      // New reaction
      if (!message.reactions) message.reactions = [];
      message.reactions.push({
        emoji,
        users: [userId as any],
      });
    }

    await message.save();
    
    // Emit Socket.io event for real-time reaction update
    io.to(`group-${message.group}`).emit('message-reaction', message);
    
    res.json(message);
  } catch (error) {
    console.error('Error reacting to message:', error);
    res.status(500).json({ message: 'Failed to react to message' });
  }
};

// @desc    Delete message (admin only or own message)
// @route   DELETE /api/groups/messages/:messageId
// @access  Private
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const message = await GroupMessage.findById(req.params.messageId);
    if (!message) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    const group = await StudyGroup.findById(message.group);
    const isAdmin = group?.admin.toString() === userId;
    const isOwner = message.sender.toString() === userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({ message: 'Not authorized to delete this message' });
      return;
    }

    message.deletedAt = new Date();
    await message.save();

    // Emit Socket.io event for real-time deletion
    io.to(`group-${message.group}`).emit('message-deleted', { messageId: message._id });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};
