# SkillBridge Part 2 - AI-Assisted Career Companion Features

This document describes all the new AI-powered features added to SkillBridge in Part 2.

## Overview

Part 2 extends the SkillBridge platform with comprehensive AI-assisted career companion features, including smart skill extraction, intelligent job matching, skill gap analysis, career roadmap generation, and an AI chatbot mentor.

## New Features

### 1. Smart Skill Extraction

**Backend:**
- **Route:** `POST /api/skills/extract`
- **Controller:** `skillController.js`
- **Service:** `services/ai/skillExtractor.js` and `services/ai/resumeParser.js`
- **Features:**
  - Upload CV files (PDF or TXT)
  - Paste CV text directly
  - Extract skills using OpenAI API (if configured) or keyword-based extraction
  - Extract experience level and education
  - Identify relevant roles

**Frontend:**
- **Component:** `SkillExtractor.jsx`
- **Location:** Profile page
- **Features:**
  - File upload interface
  - Text input for pasting CV
  - Display extracted skills as editable tags
  - One-click update to user profile

### 2. Intelligent Job Matching

**Backend:**
- **Routes:**
  - `GET /api/jobs/match/:userId` - Get matched jobs for user
  - `GET /api/jobs/:id/match` - Get match details for specific job
- **Controller:** `jobController.js` (enhanced)
- **Service:** `services/ai/jobMatcher.js`
- **Features:**
  - Calculate match percentage (0-100%)
  - Identify matched skills
  - Identify missing skills
  - Generate match explanations
  - Consider experience level and preferred track

**Frontend:**
- **Enhanced Pages:**
  - Dashboard: Shows match percentages for recommended jobs
  - JobDetails: Shows detailed match analysis with matched/missing skills

### 3. Skill Gap Analysis & Learning Recommendations

**Backend:**
- **Route:** `GET /api/learning/recommendations/:userId`
- **Controller:** `learningController.js`
- **Service:** `services/ai/skillGapAnalyzer.js`
- **Features:**
  - Analyze missing skills for target jobs
  - Recommend learning resources from database
  - Prioritize skills to learn
  - Match resources to missing skills

**Frontend:**
- **Component:** `SkillGapAnalysis.jsx`
- **Location:** Dashboard
- **Features:**
  - Display missing skills
  - Show priority skills
  - List recommended learning resources with reasons

### 4. AI-Generated Career Roadmap

**Backend:**
- **Routes:**
  - `POST /api/roadmap/generate` - Generate new roadmap
  - `GET /api/roadmap/current` - Get user's current roadmap
  - `PUT /api/roadmap/:id/progress` - Update roadmap progress
  - `GET /api/roadmap/:id/pdf` - Download roadmap as PDF (placeholder)
- **Controller:** `roadmapController.js`
- **Service:** `services/ai/roadmapGenerator.js`
- **Model:** `models/Roadmap.js`
- **Features:**
  - Generate step-by-step roadmaps using OpenAI or rule-based templates
  - Include phases with topics, technologies, projects, and resources
  - Track progress and current phase
  - Support different timeframes (3 months, 6 months, 1 year)

**Frontend:**
- **Component:** `RoadmapViewer.jsx`
- **Location:** Dashboard
- **Features:**
  - Form to generate new roadmap
  - Display roadmap phases with all details
  - Visual progress tracking
  - Phase status indicators

### 5. CareerBot / Mentor Assistant

**Backend:**
- **Route:** `POST /api/careerbot/chat`
- **Controller:** `careerBotController.js`
- **Service:** `services/ai/careerBot.js`
- **Features:**
  - OpenAI-powered responses (if API key configured)
  - Rule-based fallback responses
  - Context-aware using user profile
  - Answers questions about:
    - Role matching
    - Learning recommendations
    - Career roadmaps
    - Skill gaps
    - Job recommendations

**Frontend:**
- **Component:** `CareerBot.jsx`
- **Location:** Dashboard
- **Features:**
  - Chat interface
  - Message history
  - Quick suggestion buttons
  - Loading indicators

### 6. Enhanced Job Model

**New Fields:**
- `externalLinks.linkedin` - LinkedIn job posting URL
- `externalLinks.bdjobs` - BDJobs posting URL
- `externalLinks.other` - Other external links

**Frontend:**
- JobDetails page shows external links as buttons

## API Endpoints Summary

### Skills
- `POST /api/skills/extract` - Extract skills from CV
- `PUT /api/skills/update` - Update user skills

### Jobs
- `GET /api/jobs/match/:userId` - Get matched jobs
- `GET /api/jobs/:id/match` - Get job match details

### Roadmap
- `POST /api/roadmap/generate` - Generate roadmap
- `GET /api/roadmap/current` - Get current roadmap
- `PUT /api/roadmap/:id/progress` - Update progress

### Learning
- `GET /api/learning/recommendations/:userId` - Get learning recommendations

### CareerBot
- `POST /api/careerbot/chat` - Chat with CareerBot

## Environment Variables

Add to `server/.env`:
```
OPENAI_API_KEY=your_openai_api_key_here  # Optional, for AI features
```

If `OPENAI_API_KEY` is not set, the system will use rule-based/keyword-based fallbacks.

## Database Models

### New Model: Roadmap
- Stores user career roadmaps with phases, progress, and learning resources

### Updated Models:
- **User:** Added `currentRoadmap` reference
- **Job:** Added `externalLinks` object

## Installation

1. Install new dependencies:
```bash
cd SkillBridge/server
npm install
```

New packages:
- `openai` - OpenAI API client
- `multer` - File upload handling
- `pdf-parse` - PDF parsing
- `pdfkit` - PDF generation (for future roadmap PDF export)

## Usage Examples

### Extract Skills from CV
1. Go to Profile page
2. Use Skill Extractor component
3. Upload PDF/TXT or paste text
4. Click "Extract Skills"
5. Review and click "Update My Skills"

### Generate Career Roadmap
1. Go to Dashboard
2. Scroll to Career Roadmap section
3. Enter target role, timeframe, and learning hours
4. Click "Generate Roadmap"
5. View step-by-step phases

### Chat with CareerBot
1. Go to Dashboard
2. Scroll to CareerBot section
3. Ask questions like:
   - "Which roles fit my skills?"
   - "What should I learn next?"
   - "Create a roadmap for Full Stack Developer"

### View Job Match Details
1. Go to Jobs page
2. Click on any job
3. View match percentage, matched skills, and missing skills
4. See recommended learning resources for missing skills

## Technical Notes

- All AI features have fallbacks if OpenAI API is not configured
- File uploads are stored temporarily and cleaned up after processing
- Match percentages are calculated using weighted scoring (skills: 70%, experience: 20%, track: 10%)
- Roadmaps are saved to MongoDB and can be retrieved later
- CareerBot responses are context-aware using user profile data

## Future Enhancements

- PDF roadmap download implementation
- WebSocket support for real-time updates
- Advanced CV parsing with more formats (DOCX, etc.)
- Enhanced AI matching with embeddings
- Skill progress tracking over time

