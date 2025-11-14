import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import jobRoutes from './routes/jobs.js';
import resourceRoutes from './routes/resources.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import webhookRoutes from './routes/webhooks.js';
import seedRoutes from './routes/seed.js';
import skillsRoutes from './routes/skills.js';
import roadmapRoutes from './routes/roadmap.js';
import careerbotRoutes from './routes/careerbot.js';
import learningRoutes from './routes/learning.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Check for required environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillbridge';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_change_in_production';

if (!process.env.MONGO_URI) {
  console.warn('⚠️  MONGO_URI not set in .env, using default: mongodb://localhost:27017/skillbridge');
  console.warn('⚠️  Create server/.env file with your MongoDB connection string');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in .env, using default (not secure for production)');
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for dev
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/careerbot', careerbotRoutes);
app.use('/api/learning', learningRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    })
    .on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('\n💡 Solutions:');
        console.error(`   1. Kill the process using port ${PORT}:`);
        console.error(`      Windows: netstat -ano | findstr :${PORT}`);
        console.error(`      Then: taskkill /F /PID <PID>`);
        console.error(`   2. Change PORT in server/.env to a different port (e.g., 4001)`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n💡 Make sure MongoDB is running:');
    console.error('   - Local: mongod (or start MongoDB service)');
    console.error('   - Or update MONGO_URI in server/.env to your MongoDB Atlas connection string');
    process.exit(1);
  });

export default app;

