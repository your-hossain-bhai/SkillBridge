/**
 * AI Resume Parser Service
 * Parses uploaded CV/resume documents and extracts structured data
 */
import { extractSkills, extractExperienceLevel } from './skillExtractor.js';
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

/**
 * Parse PDF file
 */
export const parsePDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
};

/**
 * Parse resume text using AI
 * @param {string} cvText - Raw CV text
 * @returns {Promise<Object>} Parsed resume data
 */
export const parseResume = async (cvText) => {
  try {
    if (!cvText || cvText.trim().length === 0) {
      return {
        skills: [],
        experienceLevel: null,
        education: null,
        extractedText: '',
        relevantRoles: []
      };
    }

    // Extract skills
    const skills = await extractSkills(cvText);
    
    // Extract experience level
    const experienceLevel = extractExperienceLevel(cvText);
    
    // Extract education (simple pattern matching)
    const education = extractEducation(cvText);
    
    // Extract relevant roles
    const relevantRoles = extractRelevantRoles(cvText, skills);

    return {
      skills,
      experienceLevel,
      education,
      extractedText: cvText,
      relevantRoles
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error;
  }
};

/**
 * Extract education information
 */
const extractEducation = (cvText) => {
  const educationPatterns = [
    /(?:bachelor|b\.?s\.?|b\.?sc\.?|bachelor's)\s+(?:degree|in|of)\s+([a-zA-Z\s]+?)(?:\.|,|$)/i,
    /(?:master|m\.?s\.?|m\.?sc\.?|master's)\s+(?:degree|in|of)\s+([a-zA-Z\s]+?)(?:\.|,|$)/i,
    /(?:ph\.?d\.?|doctorate)\s+(?:in|of)\s+([a-zA-Z\s]+?)(?:\.|,|$)/i
  ];

  for (const pattern of educationPatterns) {
    const match = cvText.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
};

/**
 * Extract relevant roles based on skills and text
 */
const extractRelevantRoles = (cvText, skills) => {
  const roles = [];
  const text = cvText.toLowerCase();
  
  const roleKeywords = {
    'Full Stack Developer': ['full stack', 'fullstack', 'mern', 'mean'],
    'Frontend Developer': ['frontend', 'front-end', 'react', 'vue', 'angular'],
    'Backend Developer': ['backend', 'back-end', 'api', 'server', 'node.js'],
    'Data Scientist': ['data science', 'machine learning', 'ml', 'data analysis'],
    'DevOps Engineer': ['devops', 'ci/cd', 'docker', 'kubernetes', 'aws'],
    'UI/UX Designer': ['ui/ux', 'designer', 'figma', 'adobe xd']
  };

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const hasKeyword = keywords.some(keyword => text.includes(keyword));
    const hasSkill = skills.some(skill => 
      keywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    
    if (hasKeyword || hasSkill) {
      roles.push(role);
    }
  }

  return roles.length > 0 ? roles : ['Software Developer']; // Default role
};
