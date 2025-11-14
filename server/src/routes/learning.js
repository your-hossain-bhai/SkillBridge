import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getLearningRecommendationsForUser } from '../controllers/learningController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/learning/recommendations/:userId
 * Get learning recommendations for user based on skill gaps
 */
router.get('/recommendations/:userId?', getLearningRecommendationsForUser);

export default router;

