import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  generateCareerRoadmap,
  getCurrentRoadmap,
  updateRoadmapProgress,
  downloadRoadmapPDF
} from '../controllers/roadmapController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /api/roadmap/generate
 * Generate a new career roadmap
 */
router.post('/generate', generateCareerRoadmap);

/**
 * GET /api/roadmap/current
 * Get user's current roadmap
 */
router.get('/current', getCurrentRoadmap);

/**
 * PUT /api/roadmap/:id/progress
 * Update roadmap progress
 */
router.put('/:id/progress', updateRoadmapProgress);

/**
 * GET /api/roadmap/:id/pdf
 * Download roadmap as PDF
 */
router.get('/:id/pdf', downloadRoadmapPDF);

export default router;

