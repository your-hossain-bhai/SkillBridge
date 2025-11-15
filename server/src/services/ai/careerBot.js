/**
 * CareerBot / Mentor Assistant Service
 * Chatbot to answer career-related queries using OpenAI or rule-based response *
 * Exports:
 *  - getCareerBotResponse(query, user)
 *
 * Notes:
 *  - Keeps OpenAI integration (if OPENAI_API_KEY present).
 *  - Falls back to rule-based responses when OpenAI is unavailable or fails.
 *  - Appends a short "Why this suggestion" sentence to rule-based replies for transparency.
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
  // Dynamic import to avoid requiring OpenAI in environments without it
  const { default: OpenAI } = await import('openai').catch((e) => {
    throw new Error('OpenAI library not available');
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const userContext = user ? `User Profile:
- Skills: ${(user.skills || []).join(', ') || 'Not specified'}
- Experience Level: ${user.experienceLevel || 'Fresher'}
- Preferred Track: ${user.preferredTrack || 'Not specified'}
` : '';

  const systemPrompt = `You are CareerBot, a helpful career mentor assistant for SkillBridge platform.
Your goal is to help users with career guidance, skill development, and job matching aligned with SDG 8 (decent work and economic growth).
Provide practical, actionable advice. Be concise, friendly, and encouraging.
${userContext}`;

  // Use Chat Completions endpoint shape that some OpenAI wrappers expose.
  // If your OpenAI client differs, adapt this call to your SDK.
  const resp = await openai.chat.completions.create({
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

  // The response shape may vary by SDK version. Try common paths:
  if (resp?.choices && resp.choices[0]?.message?.content) {
    return resp.choices[0].message.content.trim();
  }
  if (resp?.choices && typeof resp.choices[0] === 'string') {
    return resp.choices[0].trim();
  }
  // Fallback to stringifying response
  return JSON.stringify(resp).slice(0, 2000);
};

/**
 * Small helper to build a short "Why this suggestion" sentence based on user info.
 * Keeps the explanation concise and non-judgemental.
 */
const whyExplanation = (user, extra = '') => {
  const skills = user ? (user.skills || []) : [];
  const track = user?.preferredTrack || null;
  let base = 'Why this suggestion:';
  if (skills.length > 0) {
    base += ` based on your skills (${skills.slice(0, 5).join(', ')}).`;
  } else if (track) {
    base += ` because you indicated an interest in ${track}.`;
  } else {
    base += ` based on common industry expectations for these roles.`;
  }
  if (extra) base += ` ${extra}`;
  return `\n\n${base}`;
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
      const resp = `Based on your skills (${userSkills.slice(0, 5).join(', ')}), you might be a good fit for roles like:
- ${preferredTrack || 'Full Stack Developer'}
- Software Developer
- ${experienceLevel === 'Senior' ? 'Senior Developer or Tech Lead' : 'Junior/Mid-level Developer'}

I recommend checking the Jobs page to see specific opportunities that match your profile!`;
      return resp + whyExplanation(user, 'Check job descriptions for required seniority and tech stack.');
    } else {
      const resp = "To find roles that fit your skills, please update your profile with your skills. You can do this in the Profile page. Once you add your skills, I can provide better recommendations!";
      return resp + whyExplanation(user, 'Skills help match to real job requirements.');
    }
  }

  // Learning recommendations
  if (queryLower.includes('learn') || queryLower.includes('study') || queryLower.includes('skill')) {
    if (queryLower.includes('next')) {
      if (preferredTrack) {
        const resp = `For ${preferredTrack}, I recommend focusing on:
1. Core technologies in your track
2. Industry-standard tools and frameworks
3. Building practical projects

Check the Resources page for curated learning materials, or visit your Dashboard to see personalized recommendations based on your skill gaps!`;
        return resp + whyExplanation(user, `This sequence builds practical capability for ${preferredTrack}.`);
      } else {
        const resp = "To get personalized learning recommendations, please set your preferred career track in your Profile. Then visit your Dashboard to see skill gap analysis and recommended resources!";
        return resp + whyExplanation(user, 'Preferred track enables targeted learning plans.');
      }
    }
    const resp = `Great question! I recommend:
1. Check your Dashboard for skill gap analysis
2. Browse the Resources page for learning materials
3. Consider creating a Career Roadmap for structured learning

What specific skill or area would you like to learn about?`;
    return resp + whyExplanation(user, 'This helps you focus and track progress.');
  }

  // Job matching
  if (queryLower.includes('job') && (queryLower.includes('match') || queryLower.includes('recommend'))) {
    const resp = "I can help you find jobs! Visit the Jobs page to see available opportunities. The Dashboard also shows personalized job recommendations based on your skills and experience level.";
    return resp + whyExplanation(user, 'Jobs are matched by skill overlap and experience.');
  }

  // Career roadmap
  if (queryLower.includes('roadmap') || queryLower.includes('path') || queryLower.includes('plan')) {
    const resp = `A career roadmap is a great way to structure your learning! You can generate one by:
1. Going to your Dashboard
2. Clicking 'Generate Career Roadmap'
3. Selecting your target role and timeframe

The roadmap will give you a step-by-step plan with phases, topics, projects, and resources. Would you like to create one?`;
    return resp + whyExplanation(user, 'A roadmap focuses learning and timelines for progress.');
  }

  // Skill gap
  if (queryLower.includes('gap') || queryLower.includes('missing') || queryLower.includes('need')) {
    const resp = `To see your skill gaps:
1. Visit your Dashboard
2. Check the 'Skill Gap Analysis' section
3. View recommended learning resources for missing skills

This will help you identify what to learn next to reach your career goals!`;
    return resp + whyExplanation(user, 'Identifying gaps targets your study effectively.');
  }

  // General greeting
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
    const resp = `Hello! I'm CareerBot, your career mentor. I can help you with:
- Finding roles that match your skills
- Learning recommendations
- Career roadmap planning
- Skill gap analysis
- Job matching

What would you like to know?`;
    return resp + whyExplanation(user, '');
  }

  // Help
  if (queryLower.includes('help') || queryLower.includes('what can you')) {
    const resp = `I can help you with:
1. Role Matching: "Which roles fit my skills?"
2. Learning: "What should I learn next?"
3. Job Recommendations: "Find me jobs"
4. Career Roadmap: "Create a roadmap for [role]"
5. Skill Gaps: "What skills am I missing?"

Try asking me one of these questions!`;
    return resp + whyExplanation(user, '');
  }

  // Default response
  const resp = `I understand you're asking about "${queryLower}". Here's how I can help:

- Ask "Which roles fit my skills?" for role recommendations
- Ask "What should I learn next?" for learning guidance
- Ask "Create a roadmap" for career planning
- Visit your Dashboard for personalized recommendations

Feel free to ask me anything about your career journey!`;
  return resp + whyExplanation(user, 'I can guide you step-by-step based on your profile.');
};
 for learning guidance
- Ask "Create a roadmap" for career planning
- Visit your Dashboard for personalized recommendations

Feel free to ask me anything about your career journey!`;
};

