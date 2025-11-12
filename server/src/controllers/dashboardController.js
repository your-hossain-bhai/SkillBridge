import Job from '../models/Job.js';
import Resource from '../models/Resource.js';
import User from '../models/User.js';

/**
 * Get dashboard recommendations for logged-in user
 * GET /api/dashboard/recommendations
 * Returns rule-based job and resource recommendations with match explanations
 */
export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSkills = user.skills || [];
    const preferredTrack = user.preferredTrack || '';

    // Rule-based job matching
    const allJobs = await Job.find({});
    const jobRecommendations = allJobs
      .map(job => {
        // Find matching skills
        const matchedSkills = userSkills.filter(skill =>
          job.requiredSkills.some(requiredSkill =>
            requiredSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(requiredSkill.toLowerCase())
          )
        );

        const matchCount = matchedSkills.length;

        return {
          job,
          matchCount,
          matchedSkills,
          reason: matchCount > 0
            ? `Matches: ${matchedSkills.join(', ')}`
            : 'No skill matches found'
        };
      })
      .filter(rec => rec.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 10) // Top 10 recommendations
      .map(rec => ({
        ...rec.job.toObject(),
        matchCount: rec.matchCount,
        matchedSkills: rec.matchedSkills,
        reason: rec.reason
      }));

    // Rule-based resource matching
    const allResources = await Resource.find({});
    const resourceRecommendations = allResources
      .map(resource => {
        // Match by skills or preferred track
        const skillMatches = userSkills.filter(skill =>
          resource.relatedSkills.some(relatedSkill =>
            relatedSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(relatedSkill.toLowerCase())
          )
        );

        const trackMatch = preferredTrack &&
          resource.relatedSkills.some(relatedSkill =>
            relatedSkill.toLowerCase().includes(preferredTrack.toLowerCase()) ||
            preferredTrack.toLowerCase().includes(relatedSkill.toLowerCase())
          );

        const matchedSkills = trackMatch && !skillMatches.includes(preferredTrack)
          ? [...skillMatches, preferredTrack]
          : skillMatches;

        const matchCount = matchedSkills.length;

        return {
          resource,
          matchCount,
          matchedSkills,
          reason: matchCount > 0
            ? `Matches: ${matchedSkills.join(', ')}`
            : 'No skill matches found'
        };
      })
      .filter(rec => rec.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 10) // Top 10 recommendations
      .map(rec => ({
        ...rec.resource.toObject(),
        matchCount: rec.matchCount,
        matchedSkills: rec.matchedSkills,
        reason: rec.reason
      }));

    res.json({
      recommendedJobs: jobRecommendations,
      recommendedResources: resourceRecommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

