import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getJobs, getJobById, getMatchedJobs, getJobMatchDetails } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/match/:userId?', authMiddleware, getMatchedJobs);
router.get('/:id', getJobById);
router.get('/:id/match', authMiddleware, getJobMatchDetails);

export default router;

