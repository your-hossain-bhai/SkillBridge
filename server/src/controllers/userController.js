import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

/**
 * Get current user profile
 * GET /api/users/me
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Update user profile
 * PUT /api/users/me
 */
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      education,
      department,
      experienceLevel,
      preferredTrack,
      skills,
      cvText
    } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (education !== undefined) updateData.education = education;
    if (department !== undefined) updateData.department = department;
    if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
    if (preferredTrack !== undefined) updateData.preferredTrack = preferredTrack;
    if (skills !== undefined) updateData.skills = skills;
    if (cvText !== undefined) updateData.cvText = cvText;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Validation rules
export const validateUpdateProfile = [
  body('fullName').optional().trim(),
  body('education').optional().trim(),
  body('department').optional().trim(),
  body('experienceLevel').optional().isIn(['Fresher', 'Junior', 'Mid', 'Senior']),
  body('preferredTrack').optional().trim(),
  body('skills').optional().isArray(),
  body('cvText').optional().trim()
];

