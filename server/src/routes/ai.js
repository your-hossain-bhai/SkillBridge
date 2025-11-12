import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { parseResume } from '../services/ai/resumeParser.js';

const router = express.Router();

// All AI routes require authentication
router.use(authMiddleware);

/**
 * POST /api/ai/parse-resume
 * Placeholder for AI resume parsing (Part 2)
 */
router.post('/parse-resume', async (req, res) => {
  try {
    const { cvText } = req.body;
    
    if (!cvText) {
      return res.status(400).json({ error: 'cvText is required' });
    }

    // TODO: Part 2 - Implement actual AI parsing
    // For now, return mock response
    const result = await parseResume(cvText);
    
    res.json({
      success: true,
      message: 'Resume parsing (mock - Part 2: implement AI)',
      data: result
    });
  } catch (error) {
    console.error('Parse resume error:', error);
    res.status(501).json({ 
      error: 'Resume parsing not yet implemented',
      message: 'This feature will be available in Part 2'
    });
  }
});

export default router;

