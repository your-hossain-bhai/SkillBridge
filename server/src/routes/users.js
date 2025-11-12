import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getProfile, updateProfile, validateUpdateProfile } from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/me', getProfile);
router.put('/me', validateUpdateProfile, updateProfile);

export default router;

