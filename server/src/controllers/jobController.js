import Job from '../models/Job.js';
import User from '../models/User.js';
import { getAIJobRecommendations, calculateJobMatch } from '../services/ai/jobMatcher.js';
import { analyzeSkillGap } from '../services/ai/skillGapAnalyzer.js';

/**
 * Get all jobs with filters and pagination
 * GET /api/jobs
 */
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      skill,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    // Skill filter
    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

/**
 * Get job by ID
 * GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
};

/**
 * Get matched jobs for user with match percentage
 * GET /api/jobs/match/:userId
 */
export const getMatchedJobs = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allJobs = await Job.find({});
    const matchedJobs = await getAIJobRecommendations(user, allJobs);

    res.json({
      success: true,
      jobs: matchedJobs,
      count: matchedJobs.length
    });
  } catch (error) {
    console.error('Get matched jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch matched jobs' });
  }
};

/**
 * Get job match details with skill gap analysis
 * GET /api/jobs/:id/match
 */
export const getJobMatchDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate match
    const match = calculateJobMatch(user, job);

    // Get skill gap analysis
    const gapAnalysis = await analyzeSkillGap(user.skills || [], job.requiredSkills || []);

    res.json({
      success: true,
      match,
      gapAnalysis
    });
  } catch (error) {
    console.error('Get job match details error:', error);
    res.status(500).json({ error: 'Failed to get job match details' });
  }
};

