# SkillBridge

SkillBridge is a MERN stack application that connects users' skills with job opportunities and learning resources. The platform provides rule-based matching for jobs and resources, with placeholders for future AI-powered features.

## Project Overview

SkillBridge helps users discover career opportunities and learning resources based on their skills and preferences. The platform features user authentication, profile management, job listings, learning resources, and a personalized dashboard with recommendations.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Deployment**: Render

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge
   ```

2. **Setup Backend**

   Navigate to the server directory:
   ```bash
   cd server
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Create a `.env` file in the `server` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/skillbridge
   JWT_SECRET=supersecret_jwt_key_change_in_production
   PORT=4000
   NODE_ENV=development
   ```

   For MongoDB Atlas, use:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
   ```

3. **Setup Frontend**

   Navigate to the client directory:
   ```bash
   cd ../client
   ```

   Install dependencies:
   ```bash
   npm install
   ```

   Create a `.env` file in the `client` directory (optional for local dev):
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Seed the Database**

   From the project root:
   ```bash
   cd server
   node scripts/seed.js
   ```

   This will create:
   - 1 demo user (email: `test@example.com`, password: `password123`)
   - 18 job entries
   - 20 learning resources

### Running the Application

**Option 1: Run separately (recommended for development)**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

**Option 2: Use concurrently (if installed globally)**

From project root:
```bash
npm install -g concurrently
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Demo User Credentials

After seeding, you can login with:
- **Email**: `test@example.com`
- **Password**: `password123`

## Build & Deploy to Render

### Prerequisites for Render

1. GitHub repository with the code
2. MongoDB Atlas account (or Render MongoDB)
3. Render account

### Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy Backend Service**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `skillbridge-backend`
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       - `MONGO_URI`: Your MongoDB connection string
       - `JWT_SECRET`: A secure random string
       - `NODE_ENV`: `production`
       - `PORT`: `4000` (or leave default)

3. **Deploy Frontend (Static Site)**

   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure the site:
     - **Name**: `skillbridge-frontend`
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `client/dist`
     - **Environment Variables**:
       - `VITE_API_URL`: Your backend service URL (e.g., `https://skillbridge-backend.onrender.com`)

4. **Update Frontend API URL**

   After backend is deployed, update the frontend environment variable:
   - Go to your frontend service settings
   - Add/Update `VITE_API_URL` with your backend URL
   - Redeploy the frontend

5. **Alternative: Use render.yaml**

   If you prefer using `render.yaml`:
   - Push the `render.yaml` file to your repository
   - In Render, go to "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect and configure services from `render.yaml`
   - Make sure to set environment variables in the Render dashboard

### Post-Deployment

1. **Seed Production Database** (optional)

   You can seed the production database by calling the seed endpoint:
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/seed
   ```

   **Note**: Consider protecting this endpoint in production or removing it after seeding.

2. **Verify Deployment**

   - Visit your frontend URL
   - Test login with demo credentials
   - Verify API endpoints are accessible

## Project Structure

```
SkillBridge/
├── server/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/        # Business logic
│   │   │   ├── ai/         # AI service placeholders (Part 2)
│   │   │   └── n8n/        # n8n webhook handlers (Part 2)
│   │   └── index.js        # Express app entry
│   ├── scripts/
│   │   └── seed.js         # Database seed script
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── render.yaml              # Render deployment config
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/users/me` - Get current user profile (auth required)
- `PUT /api/users/me` - Update user profile (auth required)

### Jobs
- `GET /api/jobs` - List jobs (supports query params: search, location, jobType, skill, page, limit)
- `GET /api/jobs/:id` - Get job details

### Resources
- `GET /api/resources` - List resources (supports query params: search, platform, costType, skill, page, limit)

### Dashboard
- `GET /api/dashboard/recommendations` - Get personalized recommendations (auth required)

### AI (Part 2 - Placeholders)
- `POST /api/ai/parse-resume` - Resume parsing (returns 501/mock)

### Webhooks (Part 2 - Placeholders)
- `POST /api/webhooks/n8n` - n8n webhook handler

### Development
- `POST /api/seed` - Seed database (dev only)

## Part 2 Integration Points

The following files and routes are prepared for Part 2 AI and n8n integration:

### AI Services
- `server/src/services/ai/resumeParser.js` - Resume parsing with OpenAI/ML
- `server/src/services/ai/jobMatcher.js` - AI-powered job matching
- `server/src/routes/ai.js` - AI API routes

### n8n Integration
- `server/src/services/n8n/webhookHandler.js` - n8n webhook processing
- `server/src/routes/webhooks.js` - Webhook routes

### TODO Comments
All placeholder files contain `// TODO: Part 2` comments indicating where to implement:
- OpenAI API integration for resume parsing
- ML models for job matching
- n8n workflow triggers and handlers
- Vector database integration for semantic search

## Features

### Part 1 (Current)
- ✅ User authentication (JWT)
- ✅ User profile management with skills
- ✅ Job listings with filters
- ✅ Learning resources with filters
- ✅ Dashboard with rule-based recommendations
- ✅ Responsive UI with Tailwind CSS
- ✅ Seed script for sample data

### Part 2 (Future)
- 🔜 AI-powered resume parsing
- 🔜 Advanced job matching with ML
- 🔜 n8n automation workflows
- 🔜 Personalized learning paths
- 🔜 Career milestone tracking

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_secret_key
PORT=4000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
```

For production, set `VITE_API_URL` to your deployed backend URL.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Verify MongoDB Atlas connection string is correct
- Check network/firewall settings

### CORS Errors
- Backend has CORS enabled for all origins (development)
- For production, restrict CORS to your frontend domain

### Build Errors
- Ensure Node.js version is 16+
- Delete `node_modules` and reinstall dependencies
- Check for missing environment variables

## License

This project is part of a hackathon submission.

## Contributing

This is a hackathon project. For Part 2, focus on:
1. Implementing AI services in `server/src/services/ai/`
2. Integrating n8n workflows in `server/src/services/n8n/`
3. Enhancing recommendation algorithms
4. Adding more sophisticated matching logic

---

**Note**: Remember to change `JWT_SECRET` and other sensitive values in production!

