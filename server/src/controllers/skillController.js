/**
 * Skill Extraction Controller
 */
import User from '../models/User.js';
import { parseResume, parsePDF } from '../services/ai/resumeParser.js';
import { extractSkills } from '../services/ai/skillExtractor.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract skills from CV text or uploaded file
 * POST /api/skills/extract
 */
export const extractSkillsFromCV = async (req, res) => {
  try {
    const { cvText } = req.body;
    const file = req.file;

    let textToParse = cvText || '';

    // If file is uploaded, parse it
    if (file) {
      if (file.mimetype === 'application/pdf') {
        const filePath = file.path;
        try {
          const pdfText = await parsePDF(filePath);
          textToParse = pdfText;
          // Clean up uploaded file
          await fs.unlink(filePath).catch(() => {});
        } catch (error) {
          return res.status(400).json({ error: 'Failed to parse PDF file' });
        }
      } else if (file.mimetype === 'text/plain') {
        textToParse = await fs.readFile(file.path, 'utf-8');
        await fs.unlink(file.path).catch(() => {});
      } else {
        await fs.unlink(file.path).catch(() => {});
        return res.status(400).json({ error: 'Unsupported file type. Please upload PDF or TXT file.' });
      }
    }

    if (!textToParse || textToParse.trim().length === 0) {
      return res.status(400).json({ error: 'CV text or file is required' });
    }

    // Parse resume and extract skills
    const parsedData = await parseResume(textToParse);
    
    res.json({
      success: true,
      data: {
        skills: parsedData.skills,
        experienceLevel: parsedData.experienceLevel,
        education: parsedData.education,
        relevantRoles: parsedData.relevantRoles,
        extractedText: parsedData.extractedText.substring(0, 500) // Preview
      }
    });
  } catch (error) {
    console.error('Extract skills error:', error);
    res.status(500).json({ error: 'Failed to extract skills from CV' });
  }
};

/**
 * Update user skills
 * PUT /api/skills/update
 */
export const updateUserSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { skills: skills.map(s => s.trim()).filter(s => s.length > 0) },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Skills updated successfully',
      user: {
        skills: user.skills
      }
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({ error: 'Failed to update skills' });
  }
};

