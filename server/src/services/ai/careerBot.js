/**
 * CareerBot / Mentor Assistant Service
 * Chatbot to answer career-related queries using OpenAI or rule-based responses
 */

/**
 * Get response from CareerBot
 * @param {string} query - User's question
 * @param {Object} user - User profile (optional)
 * @returns {Promise<string>} Bot response
 */
export const getCareerBotResponse = async (query, user = null) => {
  if (!query || query.trim().length === 0) {
    return "Hello! I'm your CareerBot assistant. How can I help you with your career journey today?";
  }

  const queryLower = query.toLowerCase().trim();

  // Try OpenAI if available
  if (process.env.OPENAI_API_KEY) {
    try {
      return await getOpenAIResponse(query, user);
    } catch (error) {
      console.error('OpenAI CareerBot error:', error);
      // Fallback to rule-based
    }
  }

  // Rule-based responses
  return getRuleBasedResponse(queryLower, user);
};

/**
 * Get response from OpenAI
 */
const getOpenAIResponse = async (query, user) => {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const userContext = user ? `
User Profile:
- Skills: ${(user.skills || []).join(', ') || 'Not specified'}
- Experience Level: ${user.experienceLevel || 'Fresher'}
- Preferred Track: ${user.preferredTrack || 'Not specified'}
` : '';

  const systemPrompt = `You are CareerBot, a helpful career mentor assistant for SkillBridge platform. 
Your goal is to help users with career guidance, skill development, and job matching aligned with SDG 8 (decent work and economic growth).
Provide practical, actionable advice. Be concise, friendly, and encouraging.
${userContext}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: query
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  return response.choices[0].message.content.trim();
};

/**
 * Get rule-based response
 */
const getRuleBasedResponse = (queryLower, user) => {
  const userSkills = user ? (user.skills || []) : [];
  const experienceLevel = user?.experienceLevel || 'Fresher';
  const preferredTrack = user?.preferredTrack || '';

  // Role matching queries
  if (queryLower.includes('role') && (queryLower.includes('fit') || queryLower.includes('match') || queryLower.includes('suit'))) {
    if (userSkills.length > 0) {
      return `Based on your skills (${userSkills.slice(0, 5).join(', ')}), you might be a good fit for roles like:
- ${preferredTrack || 'Full Stack Developer'}
- Software Developer
- ${experienceLevel === 'Senior' ? 'Senior Developer or Tech Lead' : 'Junior/Mid-level Developer'}

I recommend checking the Jobs page to see specific opportunities that match your profile!`;
    } else {
      return "To find roles that fit your skills, please update your profile with your skills. You can do this in the Profile page. Once you add your skills, I can provide better recommendations!";
    }
  }

  // Learning recommendations
  if (queryLower.includes('learn') || queryLower.includes('study') || queryLower.includes('skill')) {
    if (queryLower.includes('next')) {
      if (preferredTrack) {
        return `For ${preferredTrack}, I recommend focusing on:
1. Core technologies in your track
2. Industry-standard tools and frameworks
3. Building practical projects

Check the Resources page for curated learning materials, or visit your Dashboard to see personalized recommendations based on your skill gaps!`;
      } else {
        return "To get personalized learning recommendations, please set your preferred career track in your Profile. Then visit your Dashboard to see skill gap analysis and recommended resources!";
      }
    }
    return `Great question! I recommend:
1. Check your Dashboard for skill gap analysis
2. Browse the Resources page for learning materials
3. Consider creating a Career Roadmap for structured learning

What specific skill or area would you like to learn about?`;
  }

  // Job matching
  if (queryLower.includes('job') && (queryLower.includes('match') || queryLower.includes('recommend'))) {
    return "I can help you find jobs! Visit the Jobs page to see available opportunities. The Dashboard also shows personalized job recommendations based on your skills and experience level.";
  }

  // Career roadmap
  if (queryLower.includes('roadmap') || queryLower.includes('path') || queryLower.includes('plan')) {
    return `A career roadmap is a great way to structure your learning! You can generate one by:
1. Going to your Dashboard
2. Clicking 'Generate Career Roadmap'
3. Selecting your target role and timeframe

The roadmap will give you a step-by-step plan with phases, topics, projects, and resources. Would you like to create one?`;
  }

  // Skill gap
  if (queryLower.includes('gap') || queryLower.includes('missing') || queryLower.includes('need')) {
    return `To see your skill gaps:
1. Visit your Dashboard
2. Check the 'Skill Gap Analysis' section
3. View recommended learning resources for missing skills

This will help you identify what to learn next to reach your career goals!`;
  }

  // General greeting
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
    return `Hello! I'm CareerBot, your career mentor. I can help you with:
- Finding roles that match your skills
- Learning recommendations
- Career roadmap planning
- Skill gap analysis
- Job matching

What would you like to know?`;
  }

  // Help
  if (queryLower.includes('help') || queryLower.includes('what can you')) {
    return `I can help you with:
1. **Role Matching**: "Which roles fit my skills?"
2. **Learning**: "What should I learn next?"
3. **Job Recommendations**: "Find me jobs"
4. **Career Roadmap**: "Create a roadmap for [role]"
5. **Skill Gaps**: "What skills am I missing?"

Try asking me one of these questions!`;
  }

  // Default response
  return `I understand you're asking about "${queryLower}". Here's how I can help:

- Ask "Which roles fit my skills?" for role recommendations
- Ask "What should I learn next?" for learning guidance
- Ask "Create a roadmap" for career planning
- Visit your Dashboard for personalized recommendations

Feel free to ask me anything about your career journey!`;
};

