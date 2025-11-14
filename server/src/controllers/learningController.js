/**
 * Learning Recommendations Controller
 */
import User from '../models/User.js';
import { getLearningRecommendations, getComprehensiveGapAnalysis } from '../services/ai/skillGapAnalyzer.js';
import Job from '../models/Job.js';

/**
 * Get learning recommendations for user
 * GET /api/learning/recommendations/:userId
 */
export const getLearningRecommendationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's skill gaps from recommended jobs
    const allJobs = await Job.find({});
    const topJobs = allJobs.slice(0, 10); // Get top 10 jobs for gap analysis

    const gapAnalysis = await getComprehensiveGapAnalysis(user, topJobs);

    res.json({
      success: true,
      gapAnalysis,
      recommendations: gapAnalysis.gapAnalysis.recommendations
    });
  } catch (error) {
    console.error('Get learning recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch learning recommendations' });
  }
};

