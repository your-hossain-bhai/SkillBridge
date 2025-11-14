/**
 * Career Roadmap Controller
 */
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { generateRoadmap } from '../services/ai/roadmapGenerator.js';

/**
 * Generate career roadmap
 * POST /api/roadmap/generate
 */
export const generateCareerRoadmap = async (req, res) => {
  try {
    const { targetRole, timeframe, learningHoursPerWeek } = req.body;
    const userId = req.user._id;

    if (!targetRole || !timeframe) {
      return res.status(400).json({ 
        error: 'targetRole and timeframe are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate roadmap
    const roadmapData = await generateRoadmap(
      user,
      targetRole,
      timeframe,
      learningHoursPerWeek || 10
    );

    // Save roadmap to database
    const roadmap = new Roadmap({
      userId,
      targetRole,
      timeframe,
      learningHoursPerWeek: learningHoursPerWeek || 10,
      phases: roadmapData.phases,
      currentPhase: 1,
      progress: 0
    });

    await roadmap.save();

    // Update user's current roadmap
    user.currentRoadmap = roadmap._id;
    await user.save();

    res.json({
      success: true,
      message: 'Career roadmap generated successfully',
      roadmap
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate career roadmap' });
  }
};

/**
 * Get user's current roadmap
 * GET /api/roadmap/current
 */
export const getCurrentRoadmap = async (req, res) => {
  try {
    const userId = req.user._id;

    const roadmap = await Roadmap.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'fullName email');

    if (!roadmap) {
      return res.status(404).json({ 
        error: 'No roadmap found. Generate one first.' 
      });
    }

    res.json({
      success: true,
      roadmap
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
};

/**
 * Update roadmap progress
 * PUT /api/roadmap/:id/progress
 */
export const updateRoadmapProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPhase, progress } = req.body;
    const userId = req.user._id;

    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    if (currentPhase !== undefined) {
      roadmap.currentPhase = currentPhase;
    }
    if (progress !== undefined) {
      roadmap.progress = Math.max(0, Math.min(100, progress));
    }

    await roadmap.save();

    res.json({
      success: true,
      message: 'Roadmap progress updated',
      roadmap
    });
  } catch (error) {
    console.error('Update roadmap progress error:', error);
    res.status(500).json({ error: 'Failed to update roadmap progress' });
  }
};

/**
 * Get roadmap as PDF (placeholder - would need pdfkit implementation)
 * GET /api/roadmap/:id/pdf
 */
export const downloadRoadmapPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const roadmap = await Roadmap.findOne({ _id: id, userId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    // TODO: Implement PDF generation using pdfkit
    // For now, return roadmap data
    res.json({
      success: true,
      message: 'PDF generation not yet implemented. Roadmap data:',
      roadmap
    });
  } catch (error) {
    console.error('Download roadmap PDF error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

