/**
 * Skill Extraction Service
 * Extracts skills from CV text using OpenAI API or keyword-based extraction
 */

// Common tech skills database for keyword-based extraction
const TECH_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt', 'Svelte', 'HTML', 'CSS', 'SCSS', 'SASS', 'Tailwind', 'Bootstrap',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'FastAPI', 'NestJS',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'DynamoDB',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform',
  // Tools & Frameworks
  'Git', 'REST API', 'GraphQL', 'Microservices', 'WebSocket', 'JWT', 'OAuth',
  // Data Science
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android',
  // Other
  'Agile', 'Scrum', 'DevOps', 'Linux', 'Unix', 'Shell Scripting'
];

/**
 * Extract skills using OpenAI API
 */
export const extractSkillsWithOpenAI = async (cvText) => {
  try {
    const { default: OpenAI } = await import('openai');
    
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set, falling back to keyword extraction');
      return extractSkillsWithKeywords(cvText);
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Extract all technical skills, programming languages, tools, technologies, and frameworks from the following CV/resume text. 
Return only a JSON array of skill names, without any additional text or explanation.

CV Text:
${cvText.substring(0, 3000)}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a skill extraction assistant. Extract technical skills from CV text and return them as a JSON array of strings.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content.trim();
    
    // Try to parse JSON array
    try {
      const skills = JSON.parse(content);
      if (Array.isArray(skills)) {
        return skills.map(skill => skill.trim()).filter(skill => skill.length > 0);
      }
    } catch (e) {
      // If not JSON, try to extract from text
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      return lines;
    }

    return [];
  } catch (error) {
    console.error('OpenAI skill extraction error:', error);
    // Fallback to keyword extraction
    return extractSkillsWithKeywords(cvText);
  }
};

/**
 * Extract skills using keyword matching (fallback method)
 */
export const extractSkillsWithKeywords = (cvText) => {
  if (!cvText || typeof cvText !== 'string') {
    return [];
  }

  const text = cvText.toLowerCase();
  const foundSkills = [];

  // Check for each skill in the text
  for (const skill of TECH_SKILLS) {
    const skillLower = skill.toLowerCase();
    // Check for exact match or word boundary match
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  }

  // Also look for common patterns like "experience with X", "proficient in X", etc.
  const experiencePatterns = [
    /(?:experienced?|proficient|skilled|familiar|knowledgeable).*?(?:with|in)\s+([A-Z][a-zA-Z\s]+?)(?:\.|,|$)/gi,
    /(?:technologies?|tools?|languages?|frameworks?):\s*([A-Z][a-zA-Z\s,]+?)(?:\.|$)/gi
  ];

  experiencePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(cvText)) !== null) {
      const extracted = match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
      extracted.forEach(skill => {
        if (skill.length > 2 && skill.length < 50 && !foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      });
    }
  });

  return [...new Set(foundSkills)]; // Remove duplicates
};

/**
 * Main function to extract skills (tries OpenAI first, falls back to keywords)
 */
export const extractSkills = async (cvText) => {
  if (!cvText || cvText.trim().length === 0) {
    return [];
  }

  // Try OpenAI if API key is available, otherwise use keyword extraction
  if (process.env.OPENAI_API_KEY) {
    return await extractSkillsWithOpenAI(cvText);
  } else {
    return extractSkillsWithKeywords(cvText);
  }
};

/**
 * Extract experience level from CV text
 */
export const extractExperienceLevel = (cvText) => {
  if (!cvText) return null;

  const text = cvText.toLowerCase();
  
  // Look for years of experience
  const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1]);
    if (years >= 5) return 'Senior';
    if (years >= 2) return 'Mid';
    if (years >= 1) return 'Junior';
    return 'Fresher';
  }

  // Look for keywords
  if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
    return 'Senior';
  }
  if (text.includes('mid-level') || text.includes('mid level') || text.includes('intermediate')) {
    return 'Mid';
  }
  if (text.includes('junior') || text.includes('entry-level') || text.includes('entry level')) {
    return 'Junior';
  }

  return null;
};

