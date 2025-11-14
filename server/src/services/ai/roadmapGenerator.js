/**
 * AI Career Roadmap Generator Service
 * Generates step-by-step career roadmaps based on user skills and target role
 */
import { extractSkills } from './skillExtractor.js';

/**
 * Generate career roadmap using OpenAI or rule-based approach
 * @param {Object} user - User profile
 * @param {string} targetRole - Target career role
 * @param {string} timeframe - Timeframe (e.g., "3 months", "6 months", "1 year")
 * @param {number} learningHoursPerWeek - Hours per week for learning
 * @returns {Promise<Object>} Generated roadmap
 */
export const generateRoadmap = async (user, targetRole, timeframe, learningHoursPerWeek = 10) => {
  try {
    // Try OpenAI first if available
    if (process.env.OPENAI_API_KEY) {
      return await generateRoadmapWithOpenAI(user, targetRole, timeframe, learningHoursPerWeek);
    } else {
      return generateRoadmapRuleBased(user, targetRole, timeframe, learningHoursPerWeek);
    }
  } catch (error) {
    console.error('Roadmap generation error:', error);
    // Fallback to rule-based
    return generateRoadmapRuleBased(user, targetRole, timeframe, learningHoursPerWeek);
  }
};

/**
 * Generate roadmap using OpenAI
 */
const generateRoadmapWithOpenAI = async (user, targetRole, timeframe, learningHoursPerWeek) => {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const userSkills = (user.skills || []).join(', ');
  const experienceLevel = user.experienceLevel || 'Fresher';

  const prompt = `Create a detailed ${timeframe} career roadmap for transitioning to a ${targetRole} role.

Current Profile:
- Skills: ${userSkills || 'None specified'}
- Experience Level: ${experienceLevel}
- Learning Hours per Week: ${learningHoursPerWeek}

Generate a step-by-step roadmap with phases. Each phase should include:
- Phase number and title
- Duration (e.g., "Week 1-2")
- Topics to learn
- Technologies to master
- Project ideas
- Learning resources (title, type, and description)
- Milestones to achieve

Return the response as a JSON object with this structure:
{
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase Title",
      "duration": "Week 1-2",
      "topics": ["Topic 1", "Topic 2"],
      "technologies": ["Tech 1", "Tech 2"],
      "projectIdeas": ["Project 1", "Project 2"],
      "learningResources": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "type": "Course"
        }
      ],
      "milestones": ["Milestone 1", "Milestone 2"]
    }
  ]
}

Make it practical, achievable, and aligned with SDG 8 (decent work and economic growth).`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a career development expert. Create detailed, practical career roadmaps that help people achieve their career goals.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  const content = response.choices[0].message.content.trim();
  
  try {
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const roadmapData = JSON.parse(jsonMatch[0]);
      return {
        targetRole,
        timeframe,
        learningHoursPerWeek,
        phases: roadmapData.phases || []
      };
    }
  } catch (e) {
    console.error('Failed to parse OpenAI roadmap response:', e);
  }

  // Fallback to rule-based
  return generateRoadmapRuleBased(user, targetRole, timeframe, learningHoursPerWeek);
};

/**
 * Generate roadmap using rule-based approach
 */
const generateRoadmapRuleBased = (user, targetRole, timeframe, learningHoursPerWeek) => {
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const experienceLevel = user.experienceLevel || 'Fresher';

  // Define roadmap templates for common roles
  const roadmapTemplates = {
    'Full Stack Developer': {
      phases: [
        {
          phaseNumber: 1,
          title: 'Foundation & Core Concepts',
          duration: 'Week 1-3',
          topics: ['HTML/CSS Fundamentals', 'JavaScript Basics', 'Git Version Control', 'Command Line'],
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
          projectIdeas: ['Personal Portfolio Website', 'Todo List App', 'Calculator App'],
          learningResources: [
            { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', type: 'Documentation' },
            { title: 'freeCodeCamp', url: 'https://freecodecamp.org', type: 'Course' }
          ],
          milestones: ['Build first HTML page', 'Complete JavaScript basics', 'Push code to GitHub']
        },
        {
          phaseNumber: 2,
          title: 'Frontend Development',
          duration: 'Week 4-6',
          topics: ['React Fundamentals', 'Component Architecture', 'State Management', 'Styling'],
          technologies: ['React', 'JSX', 'Tailwind CSS', 'React Hooks'],
          projectIdeas: ['Weather App', 'E-commerce Product Page', 'Social Media Feed'],
          learningResources: [
            { title: 'React Official Docs', url: 'https://react.dev', type: 'Documentation' },
            { title: 'React Tutorial', url: 'https://react.dev/learn', type: 'Tutorial' }
          ],
          milestones: ['Build first React app', 'Understand props and state', 'Deploy to Vercel']
        },
        {
          phaseNumber: 3,
          title: 'Backend Development',
          duration: 'Week 7-9',
          topics: ['Node.js Basics', 'Express Framework', 'RESTful APIs', 'Database Design'],
          technologies: ['Node.js', 'Express', 'MongoDB', 'REST API'],
          projectIdeas: ['REST API for Blog', 'User Authentication System', 'CRUD Application'],
          learningResources: [
            { title: 'Node.js Docs', url: 'https://nodejs.org/docs', type: 'Documentation' },
            { title: 'Express Guide', url: 'https://expressjs.com/guide', type: 'Tutorial' }
          ],
          milestones: ['Create first API endpoint', 'Connect to database', 'Implement authentication']
        },
        {
          phaseNumber: 4,
          title: 'Full Stack Integration',
          duration: 'Week 10-12',
          topics: ['Connecting Frontend & Backend', 'Deployment', 'Testing', 'Performance Optimization'],
          technologies: ['MERN Stack', 'JWT', 'Docker', 'AWS/Vercel'],
          projectIdeas: ['Complete MERN Application', 'Real-time Chat App', 'E-commerce Platform'],
          learningResources: [
            { title: 'Full Stack Open', url: 'https://fullstackopen.com', type: 'Course' },
            { title: 'Deployment Guide', url: 'https://vercel.com/docs', type: 'Tutorial' }
          ],
          milestones: ['Deploy full stack app', 'Implement user authentication', 'Add real-time features']
        }
      ]
    }
  };

  // Get template or create generic one
  let phases = roadmapTemplates[targetRole]?.phases;
  
  if (!phases) {
    // Generic roadmap
    phases = [
      {
        phaseNumber: 1,
        title: 'Foundation Building',
        duration: 'Week 1-4',
        topics: ['Core Concepts', 'Fundamentals', 'Best Practices'],
        technologies: ['Relevant Technologies'],
        projectIdeas: ['Starter Project', 'Practice Project'],
        learningResources: [
          { title: 'Online Courses', url: 'https://coursera.org', type: 'Course' },
          { title: 'Documentation', url: 'https://example.com', type: 'Documentation' }
        ],
        milestones: ['Complete fundamentals', 'Build first project']
      },
      {
        phaseNumber: 2,
        title: 'Intermediate Skills',
        duration: 'Week 5-8',
        topics: ['Advanced Topics', 'Frameworks', 'Tools'],
        technologies: ['Advanced Tech Stack'],
        projectIdeas: ['Intermediate Project', 'Portfolio Project'],
        learningResources: [
          { title: 'Advanced Tutorials', url: 'https://example.com', type: 'Tutorial' }
        ],
        milestones: ['Master intermediate concepts', 'Complete portfolio project']
      },
      {
        phaseNumber: 3,
        title: 'Advanced & Specialization',
        duration: 'Week 9-12',
        topics: ['Specialized Skills', 'Industry Best Practices', 'Real-world Applications'],
        technologies: ['Specialized Tools'],
        projectIdeas: ['Capstone Project', 'Open Source Contribution'],
        learningResources: [
          { title: 'Industry Resources', url: 'https://example.com', type: 'Course' }
        ],
        milestones: ['Complete capstone project', 'Ready for job applications']
      }
    ];
  }

  // Adjust phases based on timeframe
  const timeframeMonths = parseInt(timeframe) || 3;
  if (timeframeMonths <= 3) {
    phases = phases.slice(0, 3);
  } else if (timeframeMonths <= 6) {
    phases = phases.slice(0, 4);
  }

  return {
    targetRole,
    timeframe,
    learningHoursPerWeek,
    phases
  };
};

