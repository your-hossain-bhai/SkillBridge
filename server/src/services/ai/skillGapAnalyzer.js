/**
 * Skill Gap Analysis Service
 * Identifies missing skills and recommends learning resources
 */
import Resource from '../../models/Resource.js';

/**
 * Analyze skill gaps for a job match
 * @param {Array} userSkills - User's current skills
 * @param {Array} requiredSkills - Skills required for the job
 * @returns {Object} Gap analysis with missing skills and recommendations
 */
export const analyzeSkillGap = async (userSkills, requiredSkills) => {
  const userSkillsLower = (userSkills || []).map(s => s.toLowerCase());
  const requiredSkillsLower = (requiredSkills || []).map(s => s.toLowerCase());

  // Find missing skills
  const missingSkills = requiredSkillsLower
    .filter(reqSkill => 
      !userSkillsLower.some(userSkill => 
        userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
      )
    )
    .map(ms => {
      // Find original case from requiredSkills
      return requiredSkills.find(rs => rs.toLowerCase() === ms) || ms;
    });

  // Get learning resources for missing skills
  const recommendations = await getLearningRecommendations(missingSkills);

  return {
    missingSkills,
    gapCount: missingSkills.length,
    recommendations
  };
};

/**
 * Get learning resource recommendations for missing skills
 * @param {Array} missingSkills - Skills that need to be learned
 * @returns {Promise<Array>} Recommended learning resources
 */
export const getLearningRecommendations = async (missingSkills) => {
  if (!missingSkills || missingSkills.length === 0) {
    return [];
  }

  try {
    const allResources = await Resource.find({});
    
    // Match resources by related skills
    const recommendations = allResources
      .map(resource => {
        const resourceSkills = (resource.relatedSkills || []).map(s => s.toLowerCase());
        const missingSkillsLower = missingSkills.map(s => s.toLowerCase());
        
        // Count how many missing skills this resource covers
        const matchedSkills = missingSkillsLower.filter(missingSkill =>
          resourceSkills.some(resourceSkill =>
            resourceSkill.includes(missingSkill) || missingSkill.includes(resourceSkill)
          )
        );

        return {
          resource: resource.toObject(),
          matchedSkills: matchedSkills.map(ms => {
            return missingSkills.find(s => s.toLowerCase() === ms) || ms;
          }),
          matchCount: matchedSkills.length,
          relevanceScore: matchedSkills.length / missingSkills.length
        };
      })
      .filter(rec => rec.matchCount > 0)
      .sort((a, b) => {
        // Sort by match count, then by cost (free first)
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount;
        }
        if (a.resource.costType === 'Free' && b.resource.costType !== 'Free') {
          return -1;
        }
        if (b.resource.costType === 'Free' && a.resource.costType !== 'Free') {
          return 1;
        }
        return 0;
      })
      .slice(0, 10) // Top 10 recommendations
      .map(rec => ({
        ...rec.resource,
        matchedSkills: rec.matchedSkills,
        reason: `Covers ${rec.matchedSkills.length} missing skill${rec.matchedSkills.length > 1 ? 's' : ''}: ${rec.matchedSkills.join(', ')}`
      }));

    return recommendations;
  } catch (error) {
    console.error('Get learning recommendations error:', error);
    return [];
  }
};

/**
 * Get comprehensive skill gap analysis for a user
 * @param {Object} user - User profile
 * @param {Array} targetJobs - Jobs the user is interested in
 * @returns {Promise<Object>} Comprehensive gap analysis
 */
export const getComprehensiveGapAnalysis = async (user, targetJobs) => {
  const userSkills = user.skills || [];
  const allRequiredSkills = new Set();

  // Collect all required skills from target jobs
  targetJobs.forEach(job => {
    (job.requiredSkills || []).forEach(skill => {
      allRequiredSkills.add(skill);
    });
  });

  const requiredSkillsArray = Array.from(allRequiredSkills);
  const gapAnalysis = await analyzeSkillGap(userSkills, requiredSkillsArray);

  return {
    currentSkills: userSkills,
    targetSkills: requiredSkillsArray,
    gapAnalysis,
    prioritySkills: gapAnalysis.missingSkills.slice(0, 5) // Top 5 priority skills
  };
};

