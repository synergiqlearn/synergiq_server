import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import skillRoutes from './routes/skillRoutes';
import resourceRoutes from './routes/resourceRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import eventRoutes from './routes/eventRoutes';
import projectRoutes from './routes/projectRoutes';
import rewardRoutes from './routes/rewardRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import groupRoutes from './routes/groupRoutes';
import doubtRoutes from './routes/doubtRoutes';
import codingRoutes from './routes/codingRoutes';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/coding-sessions', codingRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SynergiQ API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join a study group room
  socket.on('join-group', (groupId: string) => {
    socket.join(`group-${groupId}`);
    console.log(`User ${socket.id} joined group-${groupId}`);
  });

  // Leave a study group room
  socket.on('leave-group', (groupId: string) => {
    socket.leave(`group-${groupId}`);
    console.log(`User ${socket.id} left group-${groupId}`);
  });

  // Typing indicator
  socket.on('typing', ({ groupId, user }: { groupId: string; user: any }) => {
    socket.to(`group-${groupId}`).emit('user-typing', { user });
  });

  socket.on('stop-typing', ({ groupId }: { groupId: string }) => {
    socket.to(`group-${groupId}`).emit('user-stop-typing');
  });

  // Coding session room management
  socket.on('join-session', (sessionId: string) => {
    socket.join(`session-${sessionId}`);
    console.log(`User ${socket.id} joined coding session-${sessionId}`);
  });

  socket.on('leave-session', (sessionId: string) => {
    socket.leave(`session-${sessionId}`);
    console.log(`User ${socket.id} left coding session-${sessionId}`);
  });

  // Real-time code synchronization
  socket.on('code-change', ({ sessionId, code, language }: { sessionId: string; code: string; language: string }) => {
    socket.to(`session-${sessionId}`).emit('code-updated', { code, language });
  });

  // Cursor position synchronization
  socket.on('cursor-position', ({ sessionId, userId, position }: { sessionId: string; userId: string; position: any }) => {
    socket.to(`session-${sessionId}`).emit('cursor-moved', { userId, position });
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io accessible to routes
export { io };

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`🔌 Socket.io enabled`);
});
