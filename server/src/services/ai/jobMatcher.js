/**
 * AI Job Matcher Service
 * Enhanced job matching with match percentage, missing skills, and explanations
 */
import User from '../../models/User.js';

/**
 * Calculate match score between user and job
 * @param {Object} user - User profile
 * @param {Object} job - Job posting
 * @returns {Object} Match details with score, matched skills, missing skills, and reason
 */
export const calculateJobMatch = (user, job) => {
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase());
  
  if (requiredSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      reason: 'No required skills specified for this job'
    };
  }

  // Find matched skills (case-insensitive partial matching)
  const matchedSkills = requiredSkills.filter(reqSkill => 
    userSkills.some(userSkill => 
      userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
    )
  );

  // Find missing skills
  const missingSkills = requiredSkills.filter(reqSkill => 
    !matchedSkills.includes(reqSkill)
  );

  // Calculate match percentage
  const skillMatchScore = (matchedSkills.length / requiredSkills.length) * 100;

  // Experience level matching
  let experienceScore = 0;
  const experienceLevels = ['Fresher', 'Junior', 'Mid', 'Senior'];
  const userLevelIndex = experienceLevels.indexOf(user.experienceLevel || 'Fresher');
  const jobLevel = job.recommendedExperience || '';
  
  if (jobLevel) {
    const jobLevelLower = jobLevel.toLowerCase();
    if (jobLevelLower.includes('senior') || jobLevelLower.includes('lead')) {
      experienceScore = userLevelIndex >= 3 ? 20 : (userLevelIndex >= 2 ? 10 : 0);
    } else if (jobLevelLower.includes('mid') || jobLevelLower.includes('intermediate')) {
      experienceScore = userLevelIndex >= 1 ? 20 : (userLevelIndex === 0 ? 10 : 0);
    } else if (jobLevelLower.includes('junior') || jobLevelLower.includes('entry')) {
      experienceScore = userLevelIndex <= 1 ? 20 : 15;
    } else {
      experienceScore = 10; // Neutral
    }
  } else {
    experienceScore = 10; // Neutral if not specified
  }

  // Preferred track matching
  let trackScore = 0;
  if (user.preferredTrack && job.title) {
    const trackLower = user.preferredTrack.toLowerCase();
    const titleLower = job.title.toLowerCase();
    if (titleLower.includes(trackLower) || trackLower.includes(titleLower.split(' ')[0])) {
      trackScore = 10;
    }
  }

  // Calculate total match percentage (skills: 70%, experience: 20%, track: 10%)
  const totalMatchPercentage = Math.min(100, Math.round(
    skillMatchScore * 0.7 + experienceScore + trackScore
  ));

  // Generate reason
  let reason = '';
  if (totalMatchPercentage >= 80) {
    reason = `Excellent match! You have ${matchedSkills.length} of ${requiredSkills.length} required skills.`;
  } else if (totalMatchPercentage >= 60) {
    reason = `Good match. You have ${matchedSkills.length} of ${requiredSkills.length} required skills.`;
  } else if (totalMatchPercentage >= 40) {
    reason = `Partial match. You have ${matchedSkills.length} of ${requiredSkills.length} required skills. Consider learning: ${missingSkills.slice(0, 3).join(', ')}.`;
  } else {
    reason = `Low match. You have ${matchedSkills.length} of ${requiredSkills.length} required skills. Missing: ${missingSkills.slice(0, 5).join(', ')}.`;
  }

  return {
    matchPercentage: totalMatchPercentage,
    matchedSkills: matchedSkills.map(ms => {
      // Find original case from requiredSkills
      return job.requiredSkills.find(rs => rs.toLowerCase() === ms) || ms;
    }),
    missingSkills: missingSkills.map(ms => {
      return job.requiredSkills.find(rs => rs.toLowerCase() === ms) || ms;
    }),
    reason,
    skillMatchCount: matchedSkills.length,
    totalRequiredSkills: requiredSkills.length
  };
};

/**
 * Get AI-powered job recommendations for a user
 * @param {Object} user - User profile
 * @param {Array} jobs - Available jobs
 * @returns {Array} Ranked job recommendations with match details
 */
export const getAIJobRecommendations = async (user, jobs) => {
  const jobMatches = jobs.map(job => {
    const match = calculateJobMatch(user, job);
    return {
      ...job.toObject(),
      matchPercentage: match.matchPercentage,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      reason: match.reason,
      skillMatchCount: match.skillMatchCount,
      totalRequiredSkills: match.totalRequiredSkills
    };
  });

  // Sort by match percentage (descending)
  return jobMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

/**
 * Get match score between user and job using AI
 * @param {Object} user - User profile
 * @param {Object} job - Job posting
 * @returns {Promise<Object>} Match details
 */
export const calculateMatchScore = async (user, job) => {
  return calculateJobMatch(user, job);
};
