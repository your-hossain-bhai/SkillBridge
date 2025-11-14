import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { chatWithCareerBot } from '../controllers/careerBotController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /api/careerbot/chat
 * Chat with CareerBot
 */
router.post('/chat', chatWithCareerBot);

export default router;

