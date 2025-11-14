import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { extractSkillsFromCV, updateUserSkills } from '../controllers/skillController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /api/skills/extract
 * Extract skills from CV text or uploaded file
 */
router.post('/extract', upload.single('cvFile'), extractSkillsFromCV);

/**
 * PUT /api/skills/update
 * Update user skills
 */
router.put('/update', updateUserSkills);

export default router;

