import Resource from '../models/Resource.js';

/**
 * Get all resources with filters
 * GET /api/resources
 */
export const getResources = async (req, res) => {
  try {
    const {
      search,
      platform,
      costType,
      skill,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Platform filter
    if (platform) {
      query.platform = { $regex: platform, $options: 'i' };
    }

    // Cost type filter
    if (costType) {
      query.costType = costType;
    }

    // Skill filter
    if (skill) {
      query.relatedSkills = { $in: [new RegExp(skill, 'i')] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const resources = await Resource.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

