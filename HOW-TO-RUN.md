# How to Run SkillBridge Web Application

## Quick Start (PowerShell)

### Option 1: Use the provided scripts

**Terminal 1 - Backend:**
```powershell
.\run-server.ps1
```

**Terminal 2 - Frontend:**
```powershell
.\run-client.ps1
```

### Option 2: Manual commands

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

## Prerequisites

### 1. Install Dependencies (if not done)

**Backend:**
```powershell
cd server
npm install
```

**Frontend:**
```powershell
cd client
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is installed and running
- Start MongoDB service or run `mongod`

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `server\.env`:
  ```
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge
  ```

### 3. Seed Database (First Time)

```powershell
cd server
node scripts/seed.js
```

This creates:
- Demo user: `test@example.com` / `password123`
- 18 job listings
- 20 learning resources

## Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/api/health

## Login Credentials

After seeding:
- **Email**: `test@example.com`
- **Password**: `password123`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally, or
- Update `MONGO_URI` in `server\.env` with your MongoDB Atlas connection string

### Port Already in Use
- Change `PORT` in `server\.env`
- Or stop the process using port 4000/3000

### Dependencies Issues
```powershell
# Delete node_modules and reinstall
cd server
Remove-Item -Recurse -Force node_modules
npm install

cd ..\client
Remove-Item -Recurse -Force node_modules
npm install
```

### PowerShell Execution Policy
If scripts are blocked:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## What You'll See

**Backend Terminal:**
```
✅ Connected to MongoDB
🚀 Server running on port 4000
```

**Frontend Terminal:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Next Steps

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account, or
3. Login with `test@example.com` / `password123`
4. Explore the dashboard, jobs, and resources!

