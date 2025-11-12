import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getRecommendations } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/recommendations', getRecommendations);

export default router;

