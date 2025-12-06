import { Response } from 'express';
import CodingSession from '../models/CodingSession';
import StudyGroup from '../models/StudyGroup';
import { AuthRequest } from '../middleware/auth';
import { io } from '../server';
import axios from 'axios';

// Piston API configuration
const PISTON_API = 'https://emkc.org/api/v2/piston';

// Language version mapping
const languageVersions: { [key: string]: string } = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '10.2.0',
  c: '10.2.0',
  typescript: '5.0.3',
  go: '1.16.2',
  rust: '1.68.2',
};

// @desc    Get coding sessions for a group
// @route   GET /api/coding-sessions/group/:groupId
// @access  Private
export const getGroupSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    // Check if user is a member
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const isMember = userId ? group.members.some((m: any) => m.toString() === userId) : false;
    if (!isMember && !group.isPublic) {
      res.status(403).json({ message: 'You must be a member to view sessions' });
      return;
    }

    const sessions = await CodingSession.find({ group: groupId })
      .populate('creator', 'name email')
      .populate('activeUsers', 'name email')
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

// @desc    Get single coding session
// @route   GET /api/coding-sessions/:id
// @access  Private
export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await CodingSession.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('activeUsers', 'name email')
      .populate('group', 'name');

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Failed to fetch session' });
  }
};

// @desc    Create new coding session
// @route   POST /api/coding-sessions
// @access  Private
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { groupId, title, language } = req.body;

    // Check if user is a member
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const isMember = group.members.some((m: any) => m.toString() === userId);
    if (!isMember) {
      res.status(403).json({ message: 'You must be a member to create sessions' });
      return;
    }

    // Default code templates
    const defaultCode: { [key: string]: string } = {
      javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
      python: '# Write your Python code here\nprint("Hello, World!")',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
      c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
      typescript: '// Write your TypeScript code here\nconsole.log("Hello, World!");',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      rust: 'fn main() {\n    println!("Hello, World!");\n}',
    };

    const session = await CodingSession.create({
      group: groupId,
      title: title || 'Untitled Session',
      language: language || 'javascript',
      code: defaultCode[language || 'javascript'] || '',
      creator: userId,
      activeUsers: [userId],
    });

    await session.populate('creator', 'name email');
    await session.populate('activeUsers', 'name email');

    // Emit to group members
    io.to(`group-${groupId}`).emit('new-coding-session', session);

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

// @desc    Update session code (real-time handled by Socket.io)
// @route   PUT /api/coding-sessions/:id
// @access  Private
export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { code, input, title, language } = req.body;

    const session = await CodingSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // Update fields
    if (code !== undefined) session.code = code;
    if (input !== undefined) session.input = input;
    if (title) session.title = title;
    if (language) session.language = language;

    await session.save();

    // Emit to all session participants
    io.to(`session-${session._id}`).emit('session-updated', session);

    res.json(session);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
};

// @desc    Execute code using Piston API
// @route   POST /api/coding-sessions/:id/execute
// @access  Private
export const executeCode = async (req: AuthRequest, res: Response) => {
  try {
    const session = await CodingSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    const { code, input } = req.body;

    // Prepare Piston API request
    const pistonRequest = {
      language: session.language,
      version: languageVersions[session.language] || '*',
      files: [
        {
          name: session.language === 'python' ? 'main.py' : 
                session.language === 'java' ? 'Main.java' : 
                session.language === 'cpp' ? 'main.cpp' : 
                session.language === 'c' ? 'main.c' :
                session.language === 'go' ? 'main.go' :
                session.language === 'rust' ? 'main.rs' : 'main.js',
          content: code || session.code,
        },
      ],
      stdin: input || session.input || '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    // Execute code via Piston API
    const response = await axios.post(`${PISTON_API}/execute`, pistonRequest, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    const output = response.data.run.output || response.data.run.stdout || '';
    const error = response.data.run.stderr || '';
    const exitCode = response.data.run.code;

    // Save output to session
    session.output = output || error;
    await session.save();

    // Emit output to all session participants
    io.to(`session-${session._id}`).emit('code-output', {
      output: output || error,
      exitCode,
      error: error ? true : false,
    });

    res.json({
      output: output || error,
      exitCode,
      error: error ? true : false,
    });
  } catch (error: any) {
    console.error('Error executing code:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to execute code';
    res.status(500).json({ 
      message: errorMessage,
      output: `Error: ${errorMessage}`,
      error: true,
    });
  }
};

// @desc    Join coding session (add to active users)
// @route   POST /api/coding-sessions/:id/join
// @access  Private
export const joinSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await CodingSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // Add user to active users if not already present
    if (!session.activeUsers.some((u: any) => u.toString() === userId)) {
      session.activeUsers.push(userId as any);
      await session.save();
    }

    await session.populate('activeUsers', 'name email');

    // Emit to session participants
    io.to(`session-${session._id}`).emit('user-joined', {
      userId,
      activeUsers: session.activeUsers,
    });

    res.json(session);
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ message: 'Failed to join session' });
  }
};

// @desc    Leave coding session
// @route   POST /api/coding-sessions/:id/leave
// @access  Private
export const leaveSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const session = await CodingSession.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // Remove user from active users
    session.activeUsers = session.activeUsers.filter((u: any) => u.toString() !== userId);
    
    // Mark session as inactive if no active users
    if (session.activeUsers.length === 0) {
      session.isActive = false;
    }

    await session.save();
    await session.populate('activeUsers', 'name email');

    // Emit to session participants
    io.to(`session-${session._id}`).emit('user-left', {
      userId,
      activeUsers: session.activeUsers,
    });

    res.json({ message: 'Left session successfully' });
  } catch (error) {
    console.error('Error leaving session:', error);
    res.status(500).json({ message: 'Failed to leave session' });
  }
};

// @desc    Delete coding session
// @route   DELETE /api/coding-sessions/:id
// @access  Private (creator only)
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const session = await CodingSession.findById(req.params.id);

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // Only creator can delete
    if (session.creator.toString() !== userId) {
      res.status(403).json({ message: 'Only the creator can delete this session' });
      return;
    }

    await CodingSession.findByIdAndDelete(req.params.id);

    // Emit deletion event
    io.to(`session-${session._id}`).emit('session-deleted', { sessionId: session._id });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
};
